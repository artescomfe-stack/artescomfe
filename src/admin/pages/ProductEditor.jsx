import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../../supabase.js'
import { deleteProduct, getProduct, listCategories, nextProductCode, uniqueSlug, slugify } from '../api.js'
import { BASE } from '../sections.js'
import { CardHead, InfoTip, Loading, Switch, errorText, useConfirm, useToast, useUnsavedGuard } from '../ui.jsx'
import ProductPhotos, { syncPhotos } from '../components/ProductPhotos.jsx'

// Categorias do painel → colunas que o site lê (products.type / products.line / category_label).
const TYPE_BY_SLUG = { 'nossa-senhora': 'maria', santos: 'santo', 'jesus-cristo': 'jesus', 'sagrada-familia': 'familia' }
const LINE_BY_SLUG = { 'imagens-sacras': 'imagens', quadros: 'quadros', tercos: 'tercos', presentes: 'presentes' }
const TYPE_LABEL = { maria: 'Nossa Senhora', santo: 'Santos', jesus: 'Jesus Cristo', familia: 'Sagrada Família' }
// Acabamentos já usados no site (filtro do catálogo) com a cor da bolinha.
const FINISHES = {
  'Bronze': 'linear-gradient(135deg,#6b4a2b,#a57a4c)', 'Ouro velho': 'linear-gradient(135deg,#5c4422,#b08d4f)',
  'Cobre': 'linear-gradient(135deg,#7a3f22,#c27a4b)', 'Dourado': 'linear-gradient(135deg,#a8842f,#e6c56a)',
  'Branco perolado': 'linear-gradient(135deg,#f7f2ea,#d9c9a8)', 'Marfim e dourado': 'linear-gradient(135deg,#efe6d2 55%,#c9a24a 55%)',
  'Azul e dourado': 'linear-gradient(135deg,#a9c6dd 55%,#c9a24a 55%)', 'Rosé e dourado': 'linear-gradient(135deg,#f1cdb8 55%,#c9a24a 55%)',
  'Colorida': 'conic-gradient(#b32c35 0 33%,#2f6b4f 0 66%,#d8b14a 0)',
}

const emptyProduct = () => ({
  name: '', slug: '', price: '', old_price: '', description: '',
  finish: '', swatch: '', material: '', dimensions: '', is_new: true, photo_align: 'center', details: [],
  active: true, available: true, categoryIds: [], photos: [],
  inst_mode: 'padrao', inst_times: '6', inst_value: '', inst_note: '',
})

// Parcelamento do produto: padrão da loja (tudo vazio), só à vista (1) ou personalizado.
const instForm = row => ({
  inst_mode: !row.installments_times ? 'padrao' : row.installments_times === 1 ? 'avista' : 'custom',
  inst_times: String(row.installments_times > 1 ? row.installments_times : 6),
  inst_value: moneyText(row.installment_value), inst_note: row.installment_note || '',
})
const INST_MODES = [['padrao', 'Padrão'], ['custom', 'Personalizar'], ['avista', 'À vista']]

// Linha do banco → formulário
const toForm = row => ({
  name: row.name, slug: row.slug,
  price: moneyText(row.price), old_price: moneyText(row.old_price),
  description: row.description || '',
  finish: row.finish || '', swatch: row.swatch || '', material: row.material || '', dimensions: row.dimensions || '',
  is_new: !!row.is_new, photo_align: row.photo_align || 'center', details: row.details || [],
  active: row.active, available: row.available,
  categoryIds: (row.product_categories || []).map(pc => pc.category_id),
  photos: (row.product_images || []).map(img => ({ id: img.id, path: img.path, thumb_path: img.thumb_path })),
  ...instForm(row),
})

// "89,90", "89.90", "1.299,90" → número. Vírgula é sempre o decimal; ponto só é decimal em "89.90".
const toNumber = value => {
  let s = String(value ?? '').trim()
  if (!s) return NaN
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (!/^\d+\.\d{1,2}$/.test(s)) s = s.replace(/\./g, '')
  return Number(s)
}
const moneyText = value => value === null || value === undefined || value === '' ? '' : Number(value).toFixed(2).replace('.', ',')


// Confere o formulário e devolve os problemas (campo → mensagem).
// Endereço atual ainda serve para o nome? (igual ao nome, ou nome + "-2", "-3"… quando já existia outro igual)
const slugMatchesName = (slug, name) => { const root = slugify(name); return slug === root || new RegExp(`^${root}-\\d+$`).test(slug) }
const slugPreview = (name, row) => (row && slugMatchesName(row.slug, name)) ? row.slug : (slugify(name) || '…')

// Campos de endereço a gravar: novo produto ganha um; renomeado ganha outro e guarda o antigo em old_slugs.
const slugFields = async (name, row) => {
  if (!row) return { slug: await uniqueSlug(name, 'products') }
  if (slugMatchesName(row.slug, name)) return {}
  const slug = await uniqueSlug(name, 'products', row.id)
  const old_slugs = [...new Set([...(row.old_slugs || []), row.slug])].filter(s => s !== slug)
  return { slug, old_slugs }
}

const validate = (form, categories) => {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Escreva o nome do produto.'
  const price = toNumber(form.price)
  if (!form.price || !(price > 0)) errors.price = 'Informe um preço maior que zero (ex.: 89,90).'
  if (form.old_price) {
    const old = toNumber(form.old_price)
    if (!(old > 0)) errors.old_price = 'Preço antigo inválido.'
    else if (old <= price) errors.old_price = 'Para entrar em promoção, o preço antigo precisa ser MAIOR que o preço atual.'
  }
  if (form.inst_mode === 'custom' && form.inst_value && !(toNumber(form.inst_value) > 0)) errors.inst_value = 'Valor da parcela inválido.'
  const picked = form.categoryIds.map(id => categories.find(c => c.id === id)).filter(Boolean)
  if (!picked.some(c => c.kind === 'colecao')) errors.categories = 'Escolha a linha (ex.: Imagens sacras).'
  else if (!picked.some(c => TYPE_BY_SLUG[c.slug])) errors.categories = 'Escolha a devoção (Nossa Senhora, Santos, Jesus Cristo ou Sagrada Família).'
  if (form.details.some(d => !d.label.trim() || !d.value.trim())) errors.details = 'Preencha os dois campos de cada detalhe (ou remova a linha).'
  return errors
}

function Field({ label, hint, error, children }) {
  return (
    <label className={`adm-field ${error ? 'has-error' : ''}`}>
      <span>{label}{hint && <InfoTip>{hint}</InfoTip>}</span>
      {children}
      {error && <small className="adm-field-error">{error}</small>}
    </label>
  )
}

// Lista de etiquetas com campo para adicionar (sabores, tamanhos extras).
function TagInput({ values, onChange, placeholder }) {
  const [text, setText] = useState('')
  const add = () => {
    const v = text.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setText('')
  }
  return (
    <div className="adm-tags">
      {values.map(v => <span key={v} className="adm-tag">{v}<button type="button" onClick={() => onChange(values.filter(x => x !== v))} aria-label={`Remover ${v}`}><X /></button></span>)}
      <input className="adm-input" value={text} onChange={e => setText(e.target.value)} placeholder={placeholder}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }} onBlur={add} />
    </div>
  )
}

export default function ProductEditor() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(null)          // última versão gravada (para saber se há mudanças)
  const [row, setRow] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [storeTimes, setStoreTimes] = useState(2) // parcelas padrão (Configurações)

  useEffect(() => {
    supabase.from('store_settings').select('installments_max').eq('id', 1).maybeSingle()
      .then(({ data }) => { if (data?.installments_max) setStoreTimes(data.installments_max) })
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cats = await listCategories()
        if (!alive) return
        setCategories(cats)
        if (isNew) {
          const blank = emptyProduct()
          setForm(blank); setSaved(blank); setRow(null)
        } else {
          const product = await getProduct(id)
          if (!alive) return
          if (!product) { setLoadError('Produto não encontrado (pode ter sido excluído).'); return }
          const f = toForm(product)
          setForm(f); setSaved(f); setRow(product)
        }
      } catch (error) { if (alive) setLoadError(errorText(error)) }
    })()
    return () => { alive = false }
  }, [id, isNew])

  const dirty = useMemo(() => form && saved && JSON.stringify(form) !== JSON.stringify(saved), [form, saved])

  // Avisa antes de sair com alterações não salvas (links do painel e ao fechar/recarregar a aba).
  useUnsavedGuard(dirty && !saving, 'Você fez alterações neste produto que ainda não foram salvas. Se sair agora, elas serão perdidas.')

  if (loadError) return <div className="adm-card"><p className="adm-notice is-error">{loadError}</p><Link className="adm-btn outline" to={`${BASE}/produtos`}><ArrowLeft /> Voltar para produtos</Link></div>
  if (!form) return <Loading text="Carregando produto…" />

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setName = name => setForm(f => ({ ...f, name }))
  // Uma linha e uma devoção por produto (o site usa uma de cada).
  const pickCategory = (cid, kind) => set('categoryIds', [...form.categoryIds.filter(x => categories.find(c => c.id === x)?.kind !== kind), cid])
  const setFinish = finish => setForm(f => ({ ...f, finish, swatch: FINISHES[finish] || f.swatch }))

  const colecoes = categories.filter(c => c.kind === 'colecao')
  const tipos = categories.filter(c => c.kind === 'tipo')

  const save = async () => {
    const problems = validate(form, categories)
    setErrors(problems)
    if (Object.keys(problems).length) {
      toast('Confira os campos destacados em vermelho.', 'error')
      document.querySelector('.adm-field.has-error, .adm-field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSaving(true)
    try {
      const picked = form.categoryIds.map(cid => categories.find(c => c.id === cid)).filter(Boolean)
      const type = TYPE_BY_SLUG[picked.find(c => TYPE_BY_SLUG[c.slug])?.slug]
      const line = LINE_BY_SLUG[picked.find(c => c.kind === 'colecao')?.slug] || 'imagens'
      const fields = {
        name: form.name.trim(),
        // Endereço da página acompanha o nome. Ao renomear, o endereço antigo vai para old_slugs
        // e continua abrindo (o site redireciona para o novo), então nenhum link compartilhado quebra.
        ...(await slugFields(form.name, row)),
        type, line, category_label: TYPE_LABEL[type],
        finish: form.finish.trim() || null,
        swatch: form.swatch.trim() || null,
        material: form.material.trim() || null,
        dimensions: form.dimensions.trim() || null,
        is_new: form.is_new,
        photo_align: form.photo_align === 'center' ? null : form.photo_align,
        price: toNumber(form.price),
        old_price: form.old_price ? toNumber(form.old_price) : null,
        description: form.description.trim(),
        details: form.details.map(d => ({ label: d.label.trim(), value: d.value.trim() })),
        active: form.active,
        available: form.available,
        installments_times: form.inst_mode === 'padrao' ? null : form.inst_mode === 'avista' ? 1 : Number(form.inst_times),
        installment_value: form.inst_mode === 'custom' && form.inst_value ? toNumber(form.inst_value) : null,
        installment_note: form.inst_mode === 'custom' ? form.inst_note.trim() || null : null,
      }

      let productId = row?.id
      let code = row?.code
      if (isNew) {
        code = await nextProductCode()
        const { data: first } = await supabase.from('products').select('sort_order').order('sort_order').limit(1).maybeSingle()
        const { data, error } = await supabase.from('products').insert({ ...fields, code, sort_order: (first?.sort_order ?? 10) - 10 }).select('id').single()
        if (error) throw error
        productId = data.id
      } else {
        const { error } = await supabase.from('products').update(fields).eq('id', productId)
        if (error) throw error
      }

      // categorias: tira as desmarcadas e inclui as novas
      const before = isNew ? [] : (row.product_categories || []).map(pc => pc.category_id)
      const removed = before.filter(c => !form.categoryIds.includes(c))
      const added = form.categoryIds.filter(c => !before.includes(c))
      if (removed.length) { const { error } = await supabase.from('product_categories').delete().eq('product_id', productId).in('category_id', removed); if (error) throw error }
      if (added.length) { const { error } = await supabase.from('product_categories').insert(added.map(category_id => ({ product_id: productId, category_id }))); if (error) throw error }

      // fotos (etapa 6): envia as novas, grava a ordem e apaga as removidas
      await syncPhotos({ productId, code, name: fields.name, photos: form.photos, previous: row?.product_images || [] })

      const fresh = await getProduct(productId)
      const f = toForm(fresh)
      setRow(fresh); setForm(f); setSaved(f); setErrors({})
      toast(isNew ? 'Produto criado! Ele já aparece no site.' : 'Alterações salvas. O site já mostra a versão nova.')
      if (isNew) navigate(`${BASE}/produtos/${productId}`, { replace: true })
    } catch (error) {
      toast(errorText(error), 'error')
    }
    setSaving(false)
  }

  const remove = async () => {
    const ok = await confirm({ title: 'Excluir produto', text: `"${row.name}" será excluído do site e do painel, junto com as fotos dele. Essa ação não pode ser desfeita.`, confirmLabel: 'Excluir de vez', danger: true })
    if (!ok) return
    setSaving(true)
    try {
      await deleteProduct(row)
      setSaved(form)
      toast('Produto excluído.')
      navigate(`${BASE}/produtos`, { replace: true })
    } catch (error) { toast(errorText(error), 'error'); setSaving(false) }
  }

  const promo = form.old_price && toNumber(form.old_price) > toNumber(form.price)

  // Prévia do texto do site: "ou 6x de R$ 13,32 sem juros"
  const instPreview = (() => {
    const times = form.inst_mode === 'padrao' ? storeTimes : form.inst_mode === 'avista' ? 1 : Number(form.inst_times)
    const price = toNumber(form.price)
    if (times <= 1 || !(price > 0)) return null
    const value = form.inst_mode === 'custom' && toNumber(form.inst_value) > 0 ? toNumber(form.inst_value) : price / times
    const note = (form.inst_mode === 'custom' && form.inst_note.trim()) || 'sem juros'
    return `ou ${times}x de R$ ${moneyText(value)} ${note}`
  })()

  return (
    <div className="adm-editor">
      <div className="adm-page-head">
        <Link className="adm-btn ghost small" to={`${BASE}/produtos`}><ArrowLeft /> Produtos</Link>
        {!isNew && row?.active && <a className="adm-btn outline small" href={`/produto/${row.slug}`} target="_blank" rel="noreferrer"><ExternalLink /> Ver no site</a>}
      </div>

      <div className="adm-editor-grid">
        <div className="adm-editor-main">
          <section className="adm-card adm-ed-info">
            <Field label="Nome do produto *" error={errors.name}>
              <input value={form.name} onChange={e => setName(e.target.value)} placeholder="Ex.: Nossa Senhora Aparecida (Dourada)" maxLength={120} />
            </Field>
            <p className="adm-hint adm-slug-info">
              <b>artescomfe.com.br/produto/{slugPreview(form.name, row)}</b>
              <InfoTip>{'O endereço da página acompanha o nome do produto sozinho.\n\nAo renomear, os links antigos continuam funcionando e levam para o novo endereço.'}</InfoTip>
            </p>
            <Field label="Descrição" hint={'A primeira frase (até a primeira linha em branco) aparece em destaque.\n\nDeixe uma linha em branco entre os parágrafos.'}>
              <textarea rows={9} value={form.description} onChange={e => set('description', e.target.value)} placeholder={'A Padroeira do Brasil, com toda a beleza que ela merece. 💛\n\nImagem com manto trabalhado em relevo e acabamento dourado…\n\nQue ela cubra o seu lar com o seu manto. 🙏'} />
            </Field>
          </section>

          <section className="adm-card adm-ed-photos">
            <CardHead title="Fotos" text="A primeira foto é a capa." info="Proporção do site: 4 × 5 (retrato), com a peça centralizada. A primeira foto é a capa do produto nos cards e na página." />
            <ProductPhotos photos={form.photos} onChange={photos => set('photos', photos)} />
          </section>

          <section className="adm-card adm-ed-kind">
            <div className="adm-card-head"><div><h2>Acabamento e medidas</h2><p>Aparecem na página do produto e no filtro de acabamento.</p></div></div>
            <div className="adm-grid-2">
              <Field label="Acabamento" hint="Escolha um da lista ou escreva outro.">
                <input list="adm-finishes" value={form.finish} onChange={e => setFinish(e.target.value)} placeholder="Ex.: Dourado" maxLength={40} />
                <datalist id="adm-finishes">{Object.keys(FINISHES).map(f => <option key={f} value={f} />)}</datalist>
              </Field>
              <Field label="Cor da bolinha do filtro" hint="Preenchida sozinha para os acabamentos da lista. Para um novo, escolha a cor.">
                <div className="adm-color-row">
                  <span style={{ width: 34, height: 34, borderRadius: '50%', background: form.swatch || '#e2d2bb', border: '1px solid #0002', flex: 'none' }} />
                  <input type="color" value={/^#[0-9a-f]{6}$/i.test(form.swatch) ? form.swatch : '#c9a24a'} onChange={e => set('swatch', e.target.value)} aria-label="Escolher a cor" />
                </div>
              </Field>
              <Field label="Material"><input value={form.material} onChange={e => set('material', e.target.value)} placeholder="Ex.: Resina" maxLength={80} /></Field>
              <Field label="Medidas"><input value={form.dimensions} onChange={e => set('dimensions', e.target.value)} placeholder="Ex.: Altura 30 cm" maxLength={80} /></Field>
            </div>
            <div className="adm-field">
              <span>Enquadramento das fotos<InfoTip>Base: as fotos são alinhadas pela parte de baixo (não cortam a base da imagem).</InfoTip></span>
              <div className="adm-segmented adm-seg-compact" role="radiogroup">
                {[['center', 'Centro'], ['bottom', 'Base']].map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={form.photo_align === k} className={form.photo_align === k ? 'active' : ''} onClick={() => set('photo_align', k)}>{l}</button>)}
              </div>
            </div>
          </section>

          <section className="adm-card adm-ed-details">
            <CardHead title="Detalhes extras" text="Linhas a mais na ficha do produto." info="Ex.: Peso → 1,2 kg; Feito à mão → Sim." />
            <div className={`adm-details ${errors.details ? 'has-error' : ''}`}>
              {form.details.map((d, i) => (
                <div key={i} className="adm-detail-row">
                  <input className="adm-input" value={d.label} onChange={e => set('details', form.details.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="Nome (ex.: Peso)" />
                  <input className="adm-input" value={d.value} onChange={e => set('details', form.details.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="Valor (ex.: 1,2 kg)" />
                  <button type="button" className="adm-icon-btn danger" onClick={() => set('details', form.details.filter((_, j) => j !== i))} aria-label="Remover detalhe"><Trash2 /></button>
                </div>
              ))}
              {errors.details && <small className="adm-field-error">{errors.details}</small>}
              <button type="button" className="adm-btn outline small" onClick={() => set('details', [...form.details, { label: '', value: '' }])}><Plus /> Adicionar detalhe</button>
            </div>
          </section>
        </div>

        <aside className="adm-editor-side">
          <section className="adm-card adm-ed-visibility">
            <h2>Visibilidade</h2>
            <div className="adm-side-switches">
              <Switch checked={form.active} onChange={v => set('active', v)} label={form.active ? 'No site' : 'Oculto'} />
              <Switch checked={form.available} onChange={v => set('available', v)} label={form.available ? 'À venda' : 'Indisponível'} />
              <Switch checked={form.is_new} onChange={v => set('is_new', v)} label={form.is_new ? 'Novidade' : 'Sem selo de novidade'} />
            </div>
          </section>

          <section className="adm-card adm-ed-price">
            <h2>Preço</h2>
            <div className="adm-price-pair">
              <Field label="Preço *" error={errors.price}>
                <div className="adm-money"><span>R$</span><input inputMode="decimal" value={form.price} onChange={e => set('price', e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="89,90" /></div>
              </Field>
              <Field label="Preço antigo" error={errors.old_price} hint="Opcional. Preencha com um valor MAIOR que o preço para colocar em promoção: ele aparece riscado e o produto entra em Promoções.">
                <div className="adm-money"><span>R$</span><input inputMode="decimal" value={form.old_price} onChange={e => set('old_price', e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="119,90" /></div>
              </Field>
            </div>
            {promo && <p className="adm-hint adm-price-hint is-promo">Em promoção.</p>}
          </section>

          <section className="adm-card adm-ed-inst">
            <CardHead title="Parcelamento" info={`Padrão: segue as Configurações da loja (hoje ${storeTimes > 1 ? `${storeTimes}x sem juros` : 'só à vista'}).\n\nPersonalizar: escolha as vezes, o valor de cada parcela e o texto só deste produto. Valor vazio = preço dividido pelas vezes.`} />
            <div className="adm-segmented adm-seg-3" role="radiogroup">
              {INST_MODES.map(([key, label]) => (
                <button key={key} type="button" role="radio" aria-checked={form.inst_mode === key} className={form.inst_mode === key ? 'active' : ''} onClick={() => set('inst_mode', key)}>{label}</button>
              ))}
            </div>
            {form.inst_mode === 'custom' && <>
              <div className="adm-price-pair adm-inst-pair">
                <Field label="Vezes">
                  <select value={form.inst_times} onChange={e => set('inst_times', e.target.value)}>
                    {Array.from({ length: 23 }, (_, i) => String(i + 2)).map(n => <option key={n} value={n}>{n}x</option>)}
                  </select>
                </Field>
                <Field label="Valor da parcela" error={errors.inst_value} hint="Vazio = preço dividido pelas vezes.">
                  <div className="adm-money"><span>R$</span><input inputMode="decimal" value={form.inst_value} onChange={e => set('inst_value', e.target.value.replace(/[^0-9,.]/g, ''))} placeholder={toNumber(form.price) > 0 ? moneyText(toNumber(form.price) / Number(form.inst_times)) : '0,00'} /></div>
                </Field>
              </div>
              <Field label="Texto depois do valor" hint={'Ex.: "sem juros", "com juros", "no cartão".\n\nVazio = "sem juros".'}>
                <input value={form.inst_note} onChange={e => set('inst_note', e.target.value)} placeholder="sem juros" maxLength={40} />
              </Field>
            </>}
            <p className="adm-hint adm-price-hint">{instPreview || 'Sem parcelas no site.'}</p>
          </section>

          <section className={`adm-card adm-ed-cats ${errors.categories ? 'has-error-card' : ''}`}>
            <h2 className="adm-title-info">Categorias<InfoTip>{'Linha = tipo de produto (Imagens sacras, Quadros…).\nDevoção = onde a peça aparece no menu (Nossa Senhora, Santos…).'}</InfoTip></h2>
            <p className="adm-group-label">Linha</p>
            <div className="adm-check-grid">{colecoes.map(c => <label key={c.id} className="adm-check" title={c.name}><input type="radio" name="linha" checked={form.categoryIds.includes(c.id)} onChange={() => pickCategory(c.id, 'colecao')} /> <span>{c.name}</span></label>)}</div>
            <p className="adm-group-label">Devoção</p>
            <div className="adm-check-grid">{tipos.map(c => <label key={c.id} className="adm-check" title={c.name}><input type="radio" name="devocao" checked={form.categoryIds.includes(c.id)} onChange={() => pickCategory(c.id, 'tipo')} /> <span>{c.name}</span></label>)}</div>
            {errors.categories && <small className="adm-field-error">{errors.categories}</small>}
          </section>

          {!isNew && (
            <section className="adm-card adm-ed-delete">
              <button className="adm-btn danger-text" onClick={remove} disabled={saving}><Trash2 /> Excluir produto</button>
              <InfoTip>{'Para tirar do site só por um tempo, prefira desligar "Aparece no site".'}</InfoTip>
            </section>
          )}
        </aside>
      </div>

      <div className="adm-savebar">
        <span className="adm-savebar-msg">{dirty ? 'Você tem alterações não salvas.' : isNew ? 'Preencha e clique em Criar produto.' : 'Tudo salvo.'}</span>
        <Link className="adm-btn outline" to={`${BASE}/produtos`}>Cancelar</Link>
        <button className="adm-btn primary" onClick={save} disabled={saving || (!dirty && !isNew)}>{saving ? 'Salvando…' : isNew ? 'Criar produto' : 'Salvar alterações'}</button>
      </div>
    </div>
  )
}
