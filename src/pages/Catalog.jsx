import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Heart, SlidersHorizontal, Truck, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { collections, products, typeLabels } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { PageIntro, ProductCard, WhatsApp } from '../ui.jsx'
import { helloMessage, whatsappLink } from '../store.js'

// Textos do cabeçalho da página, conforme a categoria.
const banners = {
  'nossa-senhora': { banner: '/img/banners/colecao-nossa-senhora.webp', eyebrow: 'Coleção Nossa Senhora', title: 'Maria, Mãe\ne Rainha do lar.', text: 'Diversas representações de Nossa Senhora para a sua devoção — Aparecida, Fátima, Guadalupe e muito mais.' },
  santos: { banner: '/img/banners/santos.webp', eyebrow: 'Santos', title: 'Amigos de Deus,\nexemplos de fé.', text: 'Imagens dos santos que intercedem por nós, com acabamentos ricos em detalhes.' },
  'jesus-cristo': { banner: '/img/banners/jesus-cristo.webp', eyebrow: 'Jesus Cristo', title: 'O Caminho,\na Verdade e a Vida.', text: 'Imagens para meditar a vida e a Paixão de Cristo e renovar a fé todos os dias.' },
  'sagrada-familia': { banner: '/img/banners/sagrada-familia.webp', eyebrow: 'Sagrada Família', title: 'Jesus, Maria\ne José.', text: 'A família de Nazaré para abençoar o seu lar — linda o ano inteiro e especial no Natal.' },
  novidades: { banner: '/img/banners/presentes-de-fe.webp', eyebrow: 'Novidades da loja', title: 'Acabaram\nde chegar.', text: 'As imagens mais recentes da Artes com Fé, escolhidas com carinho para o seu oratório.' },
  default: { banner: '/img/banners/presentes-de-fe.webp', eyebrow: 'Nossa loja', title: 'Peças sacras,\nbeleza e devoção.', text: 'Arte sacra de qualidade para fortalecer a sua fé e tornar o seu lar um espaço de oração e paz.' },
}

const sorts = [
  { key: 'destaques', label: 'Destaques' },
  { key: 'menor-preco', label: 'Menor preço' },
  { key: 'maior-preco', label: 'Maior preço' },
  { key: 'a-z', label: 'Nome (A–Z)' },
]

// Opções dos filtros, calculadas a partir do catálogo atual.
const filterOptions = () => ({
  allTypes: [...new Set(products.map(p => typeLabels[p.type]))],
  priceFloor: Math.floor(Math.min(...products.map(p => p.price)) / 10) * 10,
  priceCeil: Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10,
})

const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const listParam = (params, key) => (params.get(key) || '').split(',').filter(Boolean)

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`filter-group ${open ? 'open' : ''}`}>
      <button className="filter-title" onClick={() => setOpen(!open)} aria-expanded={open}>{title}<ChevronDown /></button>
      <div className="filter-body">{children}</div>
    </div>
  )
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { catalogVersion } = useShop()
  const { allTypes, priceFloor, priceCeil } = useMemo(filterOptions, [catalogVersion])

  const categoria = params.get('categoria') || 'todos'
  const busca = params.get('busca') || ''
  const tipos = listParam(params, 'tipo')
  const maxPrice = Number(params.get('ate')) || priceCeil
  const onlyAvailable = params.get('disponiveis') === '1'
  const sort = params.get('ordem') || 'destaques'

  const collection = collections.find(c => c.key === categoria) || collections[0]
  const banner = banners[categoria] || banners.default
  usePageTitle(busca ? `Busca: ${busca}` : collection.key === 'todos' ? 'Loja' : collection.label)

  // Atualiza um filtro na URL (assim o link filtrado pode ser compartilhado).
  const update = (changes, { keepFilters = true } = {}) => {
    const next = new URLSearchParams(keepFilters ? params : {})
    if (!('pagina' in changes)) next.delete('pagina') // filtro novo volta para a página 1
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && !value.length)) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : value)
    })
    setParams(next, { replace: true })
  }
  const toggleIn = (key, list, value) => update({ [key]: list.includes(value) ? list.filter(v => v !== value) : [...list, value] })
  const clearFilters = () => update({ tipo: null, ate: null, disponiveis: null, busca: null })

  const result = useMemo(() => {
    const term = normalize(busca.trim())
    const list = products.filter(p =>
      collection.test(p) &&
      (!term || normalize(`${p.name} ${p.finish || ''} ${typeLabels[p.type]} ${p.category}`).includes(term)) &&
      (!tipos.length || tipos.includes(typeLabels[p.type])) &&
      p.price <= maxPrice &&
      (!onlyAvailable || p.available))
    const sorted = [...list]
    if (sort === 'menor-preco') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'maior-preco') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'a-z') sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    return sorted.sort((a, b) => Number(b.available) - Number(a.available))
  }, [collection, busca, tipos.join(), maxPrice, onlyAvailable, sort, catalogVersion])

  // Paginação: 9 produtos por página (3 × 3) (?pagina=2…).
  const PER_PAGE = 9
  const pages = Math.max(1, Math.ceil(result.length / PER_PAGE))
  const page = Math.min(pages, Math.max(1, Number(params.get('pagina')) || 1))
  const pageItems = result.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const goTo = n => {
    update({ pagina: n === 1 ? null : String(n) })
    document.querySelector('.catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeCount = tipos.length + (maxPrice < priceCeil ? 1 : 0) + (onlyAvailable ? 1 : 0) + (busca ? 1 : 0)

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  return (
    <div className="catalog-page">
      <PageIntro
        crumbs={[{ label: 'Loja', to: '/produtos' }, ...(collection.key !== 'todos' ? [{ label: collection.label }] : [])]}
        eyebrow={banner.eyebrow}
        title={banner.title}
        text={banner.text}
        banner={banner.banner}
        aside={(
          <ul className="intro-meta">
            <li><b>{products.filter(collection.test).length}</b> {products.filter(collection.test).length === 1 ? 'produto' : 'produtos'}</li>
            <li><Truck /> Entrega combinada no WhatsApp</li>
            <li><WhatsApp /> Compra pelo WhatsApp</li>
          </ul>
        )}
      />

      <div className="shell">
        <div className="chips" role="tablist" aria-label="Categorias">
          {collections.map((c, index) => (
            <button key={c.key} role="tab" aria-selected={c.key === collection.key} className={c.key === collection.key ? 'active' : ''} onClick={() => update({ categoria: c.key === 'todos' ? null : c.key })} style={{ '--i': index }}>
              {c.label}
              <small>{products.filter(c.test).length}</small>
            </button>
          ))}
        </div>

        <div className="catalog">
          <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Filtros">
            <div className="filters-head">
              <h2>Filtros</h2>
              {activeCount > 0 && <button className="link-button" onClick={clearFilters}>Limpar tudo</button>}
              <button className="icon-button filters-close" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros"><X /></button>
            </div>

            <FilterGroup title="Categoria">
              {allTypes.map(type => (
                <label key={type} className="check">
                  <input type="checkbox" checked={tipos.includes(type)} onChange={() => toggleIn('tipo', tipos, type)} />
                  <span className="box"><Check /></span>{type}
                  <small>{products.filter(p => typeLabels[p.type] === type && collection.test(p)).length}</small>
                </label>
              ))}
            </FilterGroup>


            <FilterGroup title="Preço">
              <div className="price-range">
                <input type="range" min={priceFloor} max={priceCeil} step="10" value={maxPrice} onChange={e => update({ ate: Number(e.target.value) >= priceCeil ? null : e.target.value })} aria-label="Preço máximo" style={{ '--fill': `${((maxPrice - priceFloor) / (priceCeil - priceFloor)) * 100}%` }} />
                <div><span>R$ {priceFloor}</span><b>até R$ {maxPrice}</b></div>
              </div>
            </FilterGroup>

            <FilterGroup title="Disponibilidade">
              <label className="toggle">
                <input type="checkbox" checked={onlyAvailable} onChange={() => update({ disponiveis: onlyAvailable ? null : '1' })} />
                <span className="track"><span /></span> Só produtos disponíveis
              </label>
            </FilterGroup>

            <div className="filters-help">
              <p>Ficou com dúvida sobre medidas ou acabamento?</p>
              <a href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Chama a gente no WhatsApp</a>
            </div>

            <button className="button dark filters-apply" onClick={() => setFiltersOpen(false)}>Ver {result.length} {result.length === 1 ? 'produto' : 'produtos'}</button>
          </aside>
          {filtersOpen && <button className="backdrop filters-backdrop" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros" />}

          <section className="catalog-results" aria-live="polite">
            <div className="results-bar">
              <div>
                <h2>{busca ? <>Resultados para “{busca}”</> : collection.key === 'todos' ? 'Todos os produtos' : collection.label}</h2>
                <span>{result.length} {result.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</span>
              </div>
              <button className="button outline small filters-toggle" onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> Filtros{activeCount > 0 && <b>{activeCount}</b>}</button>
              <label className="sort">
                <span>Ordenar</span>
                <select value={sort} onChange={e => update({ ordem: e.target.value === 'destaques' ? null : e.target.value })}>
                  {sorts.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
                <ChevronDown />
              </label>
            </div>

            {activeCount > 0 && (
              <div className="active-filters">
                {busca && <button onClick={() => update({ busca: null })}>“{busca}” <X /></button>}
                {tipos.map(t => <button key={t} onClick={() => toggleIn('tipo', tipos, t)}>{t} <X /></button>)}
                {maxPrice < priceCeil && <button onClick={() => update({ ate: null })}>Até R$ {maxPrice} <X /></button>}
                {onlyAvailable && <button onClick={() => update({ disponiveis: null })}>Disponíveis <X /></button>}
              </div>
            )}

            {result.length ? (
              <>
                <div className="catalog-grid" key={`${categoria}-${sort}-${page}`}>
                  {pageItems.map((product, index) => <ProductCard key={product.id} product={product} index={index % 3} sizes="(max-width: 900px) 46vw, (max-width: 1200px) 30vw, 300px" />)}
                </div>
                {pages > 1 && (
                  <nav className="pagination" aria-label="Páginas">
                    <button className="pagination-arrow" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Página anterior"><ChevronLeft /></button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={n === page ? 'active' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => goTo(n)}>{n}</button>
                    ))}
                    <button className="pagination-arrow" onClick={() => goTo(page + 1)} disabled={page === pages} aria-label="Próxima página"><ChevronRight /></button>
                  </nav>
                )}
              </>
            ) : (
              <div className="empty-state" data-reveal>
                <Heart />
                <h3>Nenhum produto por aqui… ainda!</h3>
                <p>Tente tirar algum filtro ou fale com a gente: às vezes a imagem que você procura está chegando ou pode ser encomendada. 🙏</p>
                <div>
                  <button className="button outline small" onClick={() => update({ categoria: null }, { keepFilters: false })}>Ver todos os produtos</button>
                  <a className="button whatsapp small" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Perguntar no WhatsApp</a>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

    </div>
  )
}
