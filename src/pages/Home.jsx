import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { categories, collections, products } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { Lines, ProductCard, SectionHeading, SmartLink, responsive } from '../ui.jsx'
import { store } from '../store.js'
import { savedContent } from '../content.js'
import { SiteIcon } from '../icons.jsx'

// Textos e imagens da página inicial. Este é o padrão; o painel (Página inicial) substitui
// campo a campo pelo que for salvo (tabela site_content, chave 'home').
// Nos textos, Enter (\n) vira quebra de linha.
export const homeDefaults = {
  heroSlides: [
    {
      image: '/img/banners/hero-sagrada-familia.webp',
      alt: 'Imagem da Sagrada Família em marfim e dourado',
      eyebrow: 'Arte sacra • Devoção • Tradição',
      title: 'Peças sacras,\nbeleza e devoção',
      text: 'Imagens escolhidas com cuidado para fortalecer a sua fé e tornar o seu lar um espaço de oração e paz.',
      button: 'Conheça a loja',
      link: '/produtos',
      features: '08, 11',
    },
    {
      image: '/img/banners/hero-nossa-senhora.webp',
      alt: 'Imagem de Nossa Senhora de Fátima com manto de pérolas',
      eyebrow: 'Coleção Nossa Senhora',
      title: 'Maria, Mãe\ne Rainha do lar',
      text: 'Aparecida, Fátima, Guadalupe e outras representações de Nossa Senhora, com acabamentos delicados.',
      button: 'Ver coleção',
      link: '/produtos?categoria=nossa-senhora',
      features: '04, 06',
    },
  ],
  heroBenefits: [
    { icon: 'gem', text: 'Acabamento\nsofisticado' },
    { icon: 'gift', text: 'Presentes com\nsignificado' },
    { icon: 'package', text: 'Embalado com\ncarinho' },
  ],
  featureLabel: 'Peça em destaque',
  categoriesAll: 'Todas',
  categoriesNew: 'Novidades',
  bestTitle: 'Mais vendidos',
  newsTitle: 'Novidades da loja',
  banners: [
    { image: '/img/banners/colecao-nossa-senhora.webp', title: 'Coleção\nNossa Senhora', text: 'Diversas representações de Maria para a sua devoção.', button: 'Ver coleção', link: '/produtos?categoria=nossa-senhora' },
    { image: '/img/banners/presentes-de-fe.webp', title: 'Presentes\nde Fé', text: 'Peças especiais para batizados, casamentos e datas importantes.', button: 'Escolher presente', link: '/produtos' },
  ],
  // {parcelas} = número de parcelas das Configurações da loja.
  reasonsTitle: 'Por que comprar com a gente?',
  reasons: [
    { icon: 'truck', title: 'Entrega combinada', text: 'Com embalagem reforçada' },
    { icon: 'shield', title: 'Compra segura', text: 'Atendimento direto com a loja' },
    { icon: 'card', title: 'Em até {parcelas}x sem juros', text: 'No cartão de crédito' },
    { icon: 'headset', title: 'Atendimento humanizado', text: 'Tire dúvidas pelo WhatsApp' },
    { icon: 'gem', title: 'Acabamento sofisticado', text: 'Riqueza em cada detalhe' },
  ],
}

// Campos obrigatórios: vazio = texto padrão. Campos opcionais: se foi apagado no painel, o site não mostra.
const blank = v => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)
const OPTIONAL = ['heroBenefits', 'reasons', 'reasonsTitle', 'featureLabel']
export const mergeHome = (saved = {}) => {
  const c = { ...homeDefaults }
  Object.entries(saved || {}).forEach(([k, v]) => {
    if (!(k in homeDefaults)) return
    c[k] = OPTIONAL.includes(k) ? (v === undefined || v === null ? homeDefaults[k] : v) : (blank(v) ? homeDefaults[k] : v)
  })
  const slides = (c.heroSlides || []).filter(s => s?.image)
  return {
    ...c,
    heroSlides: slides.length ? slides : homeDefaults.heroSlides,
    heroBenefits: (c.heroBenefits || []).filter(b => b?.text),
    banners: homeDefaults.banners.map((base, i) => ({ ...base, ...Object.fromEntries(Object.entries(c.banners?.[i] || {}).filter(([k, v]) => k === 'text' || k === 'button' ? v !== undefined && v !== null : !blank(v))) })),
    reasons: (c.reasons || []).filter(r => r?.title),
  }
}
export const homeContent = () => mergeHome(savedContent('home'))

const fill = text => String(text || '').replace(/\{parcelas\}/g, store.installments)
// "08, 11" → produtos de código 08 e 11 (disponíveis)
const featuresOf = codes => String(codes || '').split(/[\s,;]+/).filter(Boolean)
  .map(code => products.find(p => p.id === code.padStart(2, '0') && p.available)).filter(Boolean).slice(0, 2)
const heroSrcSet = image => responsive(image, 1200)

function Hero({ content }) {
  const slides = content.heroSlides
  const [current, setCurrent] = useState(0)
  const multiple = slides.length > 1
  const go = step => setCurrent(index => (index + step + slides.length) % slides.length)
  const slide = slides[current] || slides[0]
  const features = featuresOf(slide.features)

  useEffect(() => { if (current >= slides.length) setCurrent(0) }, [slides.length, current])
  useEffect(() => {
    if (!multiple) return
    const timer = setInterval(() => go(1), 7000)
    return () => clearInterval(timer)
  }, [multiple, current])

  return (
    <section className="hero" id="inicio">
      {slides.map((item, index) => (
        <img key={item.image + index} className={index === current ? 'active' : ''} src={item.image} srcSet={heroSrcSet(item.image)} sizes="100vw" alt={index === current ? (item.alt || '') : ''} fetchPriority={index === 0 ? 'high' : 'auto'} />
      ))}
      <div className="hero-inner">
        <div className="hero-copy" key={current}>
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h1><Lines text={slide.title} /></h1>
          {slide.text && <h2>{slide.text}</h2>}
          {slide.button && <SmartLink className="button dark" to={slide.link}>{slide.button} <ArrowRight /></SmartLink>}
          {content.heroBenefits.length > 0 && (
            <ul className="hero-benefits">
              {content.heroBenefits.map((b, i) => <li key={i}><SiteIcon name={b.icon} /> <span><Lines text={b.text} /></span></li>)}
            </ul>
          )}
        </div>
      </div>
      {features.length > 0 && (
        <div className="hero-features" key={`f-${current}`}>
          {features.map((feature, i) => (
            <Link to={`/produto/${feature.slug}`} className="hero-feature" key={feature.id} style={{ '--i': i }}>
              <img src={feature.thumbs[0]} alt="" />
              <span>
                {content.featureLabel && <small>{content.featureLabel}</small>}
                <b>{feature.name}</b>
                <strong>{feature.priceLabel}</strong>
                <em>Ver produto <ArrowRight /></em>
              </span>
            </Link>
          ))}
        </div>
      )}
      {multiple && <>
        <button className="slider-arrow left" onClick={() => go(-1)} aria-label="Banner anterior"><ChevronLeft /></button>
        <button className="slider-arrow right" onClick={() => go(1)} aria-label="Próximo banner"><ChevronRight /></button>
        <div className="hero-dots">
          {slides.map((item, index) => <button key={item.image + index} className={index === current ? 'active' : ''} onClick={() => setCurrent(index)} aria-label={`Ir para o banner ${index + 1}`} />)}
        </div>
      </>}
    </section>
  )
}

function Shelf({ id, title, to, items }) {
  if (!items.length) return null
  return (
    <section className="shelf" aria-labelledby={id}>
      <div className="shell">
        <SectionHeading id={id} title={title} to={to} />
        <div className="shelf-grid">
          {items.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageTitle(null)
  useShop() // redesenha quando o catálogo do Supabase chega
  const content = homeContent()
  const available = products.filter(product => product.available)
  // "Mais vendidos": a ordem do catálogo (painel → Produtos → arrastar).
  const bestSellers = available.slice(0, 4)
  const used = new Set(bestSellers)
  const take = (list, n = 4) => {
    const picked = [...new Set(list)].filter(p => !used.has(p)).slice(0, n)
    picked.forEach(p => used.add(p))
    return picked
  }
  const news = take([...available.filter(p => p.isNew), ...available])

  // Atalhos redondos: "Todas" + categorias marcadas "na página inicial" (painel → Categorias) + "Novidades".
  const firstPhoto = test => { const p = products.find(test); return p && (p.thumbs[1] || p.thumbs[0]) }
  const homeCats = categories.filter(c => c.active && c.home_card).sort((a, b) => a.home_card_order - b.home_card_order)
  const chips = [
    { key: 'todos', label: content.categoriesAll, photo: products[0] && (products[0].thumbs[1] || products[0].thumbs[0]), count: products.length },
    ...homeCats.map(c => {
      const test = collections.find(x => x.key === c.slug)?.test || (p => p.categorySlugs.includes(c.slug))
      return { key: c.slug, label: (c.home_title || c.name).replace(/\n/g, ' '), photo: c.home_image || firstPhoto(test), count: products.filter(test).length }
    }),
    content.categoriesNew && { key: 'novidades', label: content.categoriesNew, photo: firstPhoto(p => p.isNew), count: products.filter(p => p.isNew).length },
  ].filter(c => c && c.count && c.label)

  return (
    <>
      <Hero content={content} />

      <section className="shell category-panel-wrap" aria-label="Categorias">
        <div className="category-panel" data-reveal>
          {chips.map(c => (
            <Link to={c.key === 'todos' ? '/produtos' : `/produtos?categoria=${c.key}`} className="category-chip" key={c.key}>
              <span><img src={c.photo || '/img/placeholder-produto.webp'} alt="" loading="lazy" /></span>
              <b>{c.label}</b>
            </Link>
          ))}
        </div>
      </section>

      <Shelf id="mais-vendidos" title={content.bestTitle} to="/produtos" items={bestSellers} />

      <section className="shell collection-row" aria-label="Coleções">
        {content.banners.map((banner, i) => (
          <SmartLink key={i} to={banner.link} className="collection-banner" data-reveal style={i ? { '--i': i } : undefined}>
            <img src={banner.image} srcSet={responsive(banner.image, 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
            <div>
              <h2><Lines text={banner.title} /></h2>
              {banner.text && <p>{banner.text}</p>}
              {banner.button && <span className="button dark small">{banner.button} <ArrowRight /></span>}
            </div>
          </SmartLink>
        ))}
      </section>

      <Shelf id="novidades" title={content.newsTitle} to="/produtos?categoria=novidades" items={news} />

      {content.reasons.length > 0 && (
        <section className="shell reasons-wrap" aria-labelledby="reasons-title">
          <div className="reasons" data-reveal>
            {content.reasonsTitle && <h2 id="reasons-title">{content.reasonsTitle}</h2>}
            <ul>
              {content.reasons.map((r, i) => (
                <li key={i}><SiteIcon name={r.icon} /><span><b>{fill(r.title)}</b>{fill(r.text)}</span></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
