import React, { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, ImageOff, Plus, Search, Sparkles, X } from 'lucide-react'
import { listProducts, getSiteContent, saveSiteContent } from '../api.js'
import { CardHead, InfoTip, Loading, Switch, errorText, formatBRL, useToast, useUnsavedGuard } from '../ui.jsx'
import { Fields, clean, finalize, imagesOf, mergePage, validate } from '../components/ContentEditor.jsx'
import { removeSiteImage } from '../components/ImageField.jsx'
import { collectionDefaults, COLLECTION_PATH } from '../../pages/Collection.jsx'

// Coleção: a página /colecao inteira (site_content 'collection'). Nome (vira o nome do menu),
// textos do topo, peças escolhidas na ordem, enfeites dourados e o quadro do final.
// Serve para qualquer coleção: "Coleção Janeiro", "Verão", "Dia das Mães"…

const normalize = t => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const problem = p => !p.active ? 'Oculto — não aparece' : !p.available ? 'Indisponível — aparece sem preço' : null

const topSchema = [
  { key: 'name', label: 'Nome da coleção', type: 'text', required: true, max: 24, placeholder: 'Ex.: Coleção de Natal',
    hint: 'Nome no menu, na página e na aba do navegador.' },
  { key: 'eyebrow', label: 'Texto pequeno (acima do título)', type: 'text', max: 50, hint: 'Vazio = não mostra.' },
  { key: 'title', label: 'Título grande', type: 'textarea', rows: 2, max: 60, hint: 'Enter = quebra de linha. A última linha fica em itálico. Vazio = usa o nome da coleção.' },
  { key: 'text', label: 'Texto', type: 'textarea', rows: 3, max: 220, hint: 'Vazio = não mostra.' },
  { key: 'image', label: 'Foto do topo', type: 'image', required: true, image: { aspect: 1600 / 760, outputs: [{ width: 1600, height: 760, quality: 0.84 }, { width: 800, height: 380, quality: 0.8 }], suffixes: ['', '800'] } },
]
const listSchema = [
  { key: 'listSuffix', label: 'Frase depois do número de peças', type: 'text', max: 40, placeholder: 'para o seu Natal',
    hint: 'Ex.: "4 produtos escolhidos para o seu Natal".' },
  { key: 'emptyText', label: 'Aviso quando não há peças', type: 'text', max: 80 },
]
const giftSchema = [
  { key: 'giftTitle', label: 'Título', type: 'text', max: 50 },
  { key: 'giftText', label: 'Texto', type: 'textarea', rows: 2, max: 200 },
  { key: 'giftMessage', label: 'Mensagem que abre no WhatsApp', type: 'textarea', rows: 2, max: 200, hint: 'Texto que já vem escrito quando a pessoa toca em "Falar com a Artes com Fé".' },
]
const textSchema = [...topSchema, ...listSchema, ...giftSchema]

function Thumb({ product }) {
  const src = product.product_images[0]?.thumb_path
  return <span className="adm-thumb">{src ? <img src={src} alt="" /> : <ImageOff />}</span>
}

export default function CollectionPage() {
  const toast = useToast()
  const [products, setProducts] = useState(null)
  const [saved, setSaved] = useState(null)
  const [form, setForm] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [loadError, setLoadError] = useState(null)

  const load = async () => {
    try {
      const [list, content] = await Promise.all([listProducts(), getSiteContent('collection')])
      const merged = mergePage(collectionDefaults, content)
      const known = new Set(list.map(p => p.id))
      merged.productIds = (Array.isArray(merged.productIds) ? merged.productIds : []).filter(id => known.has(id))
      setProducts(list); setSaved(merged); setForm(merged); setLoadError(null)
    } catch (e) { setLoadError(errorText(e)) }
  }
  useEffect(() => { load() }, [])

  const snapshot = value => JSON.stringify(value, (k, v) => (v && typeof v === 'object' && v.preview ? `nova:${v.preview}` : v))
  const dirty = Boolean(form && saved) && snapshot(form) !== snapshot(saved)
  useUnsavedGuard(dirty && !saving)

  const byId = useMemo(() => Object.fromEntries((products || []).map(p => [p.id, p])), [products])
  const ids = form?.productIds || []
  const chosen = ids.map(id => byId[id]).filter(Boolean)
  const options = useMemo(() => {
    if (!products) return []
    const term = normalize(search.trim())
    return products.filter(p => !ids.includes(p.id) && (!term || normalize(`${p.name} ${p.code}`).includes(term)))
  }, [products, ids, search])

  if (loadError) return <div className="adm-card"><p className="adm-notice is-error">{loadError}</p><button className="adm-btn outline" onClick={load}>Tentar de novo</button></div>
  if (!form) return <Loading text="Carregando coleção…" />

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const setIds = fn => setForm(f => ({ ...f, productIds: fn(f.productIds) }))
  const add = id => setIds(list => [...list, id])
  const remove = id => setIds(list => list.filter(x => x !== id))
  const move = (i, delta) => setIds(list => {
    const j = i + delta
    if (j < 0 || j >= list.length) return list
    const next = [...list];[next[i], next[j]] = [next[j], next[i]]
    return next
  })

  const save = async () => {
    const problemText = validate(textSchema, form)
    if (problemText) return setError(problemText)
    setSaving(true); setError(null)
    try {
      const value = { ...form, ...(await finalize(textSchema, form, 'paginas')) }
      await saveSiteContent('collection', value)
      const now = new Set(imagesOf(textSchema, value).map(i => i.url))
      await Promise.all(imagesOf(textSchema, saved).filter(i => !now.has(i.url)).map(i => removeSiteImage(i.url, i.suffixes)))
      setSaved(value); setForm(value)
      toast('Coleção salva. O site já mostra a versão nova.')
    } catch (e) { setError(errorText(e)) }
    setSaving(false)
  }

  return (
    <div className="adm-editor">
      <div className="adm-page-head">
        <p className="adm-muted adm-title-info">A página de coleção especial do site.<InfoTip>{'Troque o nome, os textos e as peças sempre que mudar a coleção (Natal, Páscoa, Dia das Mães, Batizado…).\n\nO nome também aparece no menu do topo. O endereço da página é sempre artescomfe.com.br/colecao.'}</InfoTip></p>
        <span className="adm-head-actions">
          <a className="adm-btn outline small" href={COLLECTION_PATH} target="_blank" rel="noreferrer"><ExternalLink /> Ver no site</a>
        </span>
      </div>
      {error && <p className="adm-notice is-error" role="alert">{error}</p>}

      <section className="adm-card">
        <CardHead title="Topo da página" text="Nome, títulos e foto."
          aside={<Switch checked={!!form.showInMenu} onChange={v => set('showInMenu', v)} label={form.showInMenu ? 'Aparece no menu do topo' : 'Fora do menu (só pelo link)'} />} />
        <Fields schema={topSchema} value={form} onChange={setForm} />
      </section>

      <div className="adm-spot-grid">
        <section className="adm-card">
          <CardHead title={`Produtos da coleção (${chosen.length})`} text="Na ordem em que aparecem."
            info="Os produtos aparecem na página nesta ordem. Ocultos não aparecem; indisponíveis aparecem com o selo." />
          {chosen.length === 0 ? (
            <div className="adm-empty"><Sparkles /><b>Nenhum produto escolhido</b>Adicione pela lista ao lado.</div>
          ) : (
            <ol className="adm-spot-list">
              {chosen.map((p, i) => (
                <li key={p.id} className={!p.active ? 'is-hidden' : ''}>
                  <span className="adm-spot-pos">{i + 1}</span>
                  <Thumb product={p} />
                  <span className="adm-cat-info">
                    <b>{p.name}</b>
                    <small>{formatBRL(p.price)} · código {p.code}</small>
                    {problem(p) && <span className="adm-badge warn">{problem(p)}</span>}
                  </span>
                  <span className="adm-prow-order">
                    <button className="adm-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir ${p.name}`}><ArrowUp /></button>
                    <button className="adm-icon-btn" onClick={() => move(i, 1)} disabled={i === chosen.length - 1} aria-label={`Descer ${p.name}`}><ArrowDown /></button>
                  </span>
                  <button className="adm-icon-btn danger" onClick={() => remove(p.id)} aria-label={`Tirar ${p.name} da coleção`} title="Tirar da coleção"><X /></button>
                </li>
              ))}
            </ol>
          )}
          <Fields schema={listSchema} value={form} onChange={setForm} />
        </section>

        <section className="adm-card">
          <CardHead title="Adicionar produto" />
          <label className="adm-search"><Search /><input className="adm-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou código" aria-label="Buscar produto" /></label>
          <ul className="adm-spot-options">
            {options.length === 0 && <li className="adm-muted">Nenhum produto encontrado.</li>}
            {options.map(p => (
              <li key={p.id}>
                <button type="button" onClick={() => add(p.id)} className={!p.active ? 'is-hidden' : ''}>
                  <Thumb product={p} />
                  <span className="adm-cat-info"><b>{p.name}</b><small>{formatBRL(p.price)}{!p.active ? ' · oculto' : !p.available ? ' · indisponível' : ''}</small></span>
                  <Plus />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="adm-card">
        <CardHead title="Quadro do final" text="Convite para falar no WhatsApp."
          aside={<Switch checked={form.giftShow} onChange={v => set('giftShow', v)} label={form.giftShow ? 'Aparece' : 'Escondido'} />} />
        {form.giftShow && <Fields schema={giftSchema} value={form} onChange={setForm} />}
      </section>

      <div className="adm-savebar">
        <span className="adm-savebar-msg">{dirty ? 'Você tem alterações não salvas.' : 'Tudo salvo.'}</span>
        <button className="adm-btn outline" onClick={() => { setForm(saved); setError(null) }} disabled={!dirty || saving}>Desfazer</button>
        <button className="adm-btn primary" onClick={save} disabled={!dirty || saving}>{saving ? 'Salvando…' : 'Salvar coleção'}</button>
      </div>
    </div>
  )
}
