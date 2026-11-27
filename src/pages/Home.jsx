import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, CreditCard, Gem, Gift, Headset, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { collections, products } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { ProductCard, SectionHeading, responsive } from '../ui.jsx'

// Rotativo do topo: para adicionar banners, inclua itens aqui (setas e bolinhas aparecem sozinhas).
// Imagens em /public/img/banners: versão 3000px + versão -1200 (1500px).
const heroSlides = [
  {
    image: '/img/banners/hero-sagrada-familia.webp',
    alt: 'Imagem da Sagrada Família em marfim e dourado',
    eyebrow: 'Arte sacra • Devoção • Tradição',
    title: ['Peças sacras,', 'beleza e devoção'],
    text: 'Imagens escolhidas com cuidado para fortalecer a sua fé e tornar o seu lar um espaço de oração e paz.',
    cta: { label: 'Conheça a loja', to: '/produtos' },
    features: ['08', '11'], // peças dos cartões "Peça em destaque" (códigos dos produtos)
  },
  {
    image: '/img/banners/hero-nossa-senhora.webp',
    alt: 'Imagem de Nossa Senhora de Fátima com manto de pérolas',
    eyebrow: 'Coleção Nossa Senhora',
    title: ['Maria, Mãe', 'e Rainha do lar'],
    text: 'Aparecida, Fátima, Guadalupe e outras representações de Nossa Senhora, com acabamentos delicados.',
    cta: { label: 'Ver coleção', to: '/produtos?categoria=nossa-senhora' },
    features: ['04', '06'],
  },
]
const heroSrcSet = image => `${image.replace('.webp', '-1200.webp')} 1500w, ${image} 3000w`

// Categorias do painel: `cover` = código da peça usada na foto redonda.
const categoryItems = [
  { key: 'todos', label: 'Todas', cover: '10' },
  { key: 'nossa-senhora', label: 'Nossa Senhora', cover: '06' },
  { key: 'santos', label: 'Santos', cover: '03' },
  { key: 'sagrada-familia', label: 'Sagrada Família', cover: '08' },
  { key: 'jesus-cristo', label: 'Jesus Cristo', cover: '07' },
  { key: 'novidades', label: 'Novidades', cover: '02' },
]

const reasons = [
  { icon: Truck, title: 'Entrega combinada', text: 'Com embalagem reforçada' },
  { icon: ShieldCheck, title: 'Compra segura', text: 'Atendimento direto com a loja' },
  { icon: CreditCard, title: 'Parcelamento disponível', text: 'Consulte as condições' },
  { icon: Headset, title: 'Atendimento humanizado', text: 'Tire dúvidas pelo WhatsApp' },
  { icon: Gem, title: 'Acabamento sofisticado', text: 'Riqueza em cada detalhe' },
]

function Hero() {
  const [current, setCurrent] = useState(0)
  const multiple = heroSlides.length > 1
  const go = step => setCurrent(index => (index + step + heroSlides.length) % heroSlides.length)
  const slide = heroSlides[current]
  const features = (slide.features || []).map(id => products.find(p => p.id === id && p.available)).filter(Boolean)

  useEffect(() => {
    if (!multiple) return
    const timer = setInterval(() => go(1), 7000)
    return () => clearInterval(timer)
  }, [multiple, current])

  return (
    <section className="hero" id="inicio">
      {heroSlides.map((item, index) => (
        <img key={item.image} className={index === current ? 'active' : ''} src={item.image} srcSet={heroSrcSet(item.image)} sizes="100vw" alt={index === current ? item.alt : ''} fetchPriority={index === 0 ? 'high' : 'auto'} />
      ))}
      <div className="hero-inner">
        <div className="hero-copy" key={current}>
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1>{slide.title[0]}<br />{slide.title[1]}</h1>
          <h2>{slide.text}</h2>
          <Link className="button dark" to={slide.cta.to}>{slide.cta.label} <ArrowRight /></Link>
          <ul className="hero-benefits">
            <li><Gem /> <span>Acabamento<br />sofisticado</span></li>
            <li><Gift /> <span>Presentes com<br />significado</span></li>
            <li><PackageCheck /> <span>Embalado com<br />carinho</span></li>
          </ul>
        </div>
      </div>
      {features.length > 0 && (
        <div className="hero-features" key={`f-${current}`}>
          {features.map((feature, i) => (
            <Link to={`/produto/${feature.slug}`} className="hero-feature" key={feature.id} style={{ '--i': i }}>
              <img src={feature.thumbs[0]} alt="" />
              <span>
                <small>Peça em destaque</small>
                <b>{feature.name}</b>
                <strong>{feature.priceLabel}</strong>
                <em>Ver imagem <ArrowRight /></em>
              </span>
            </Link>
          ))}
        </div>
      )}
      {multiple && <>
        <button className="slider-arrow left" onClick={() => go(-1)} aria-label="Banner anterior"><ChevronLeft /></button>
        <button className="slider-arrow right" onClick={() => go(1)} aria-label="Próximo banner"><ChevronRight /></button>
        <div className="hero-dots">
          {heroSlides.map((item, index) => <button key={item.image} className={index === current ? 'active' : ''} onClick={() => setCurrent(index)} aria-label={`Ir para o banner ${index + 1}`} />)}
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
  const available = products.filter(product => product.available)
  // "Mais vendidos": por enquanto, a ordem do catálogo (sort_order no Supabase).
  const bestSellers = available.slice(0, 4)
  const used = new Set(bestSellers)
  const take = (list, n = 4) => {
    const picked = [...new Set(list)].filter(p => !used.has(p)).slice(0, n)
    picked.forEach(p => used.add(p))
    return picked
  }
  const news = take([...available.filter(p => p.isNew), ...available])

  const categories = categoryItems.map(item => {
    const collection = collections.find(c => c.key === item.key)
    const cover = products.find(p => p.id === item.cover) || products.find(p => collection.test(p))
    return { ...item, photo: cover && (cover.thumbs[1] || cover.thumbs[0]), count: products.filter(collection.test).length }
  }).filter(c => c.count)

  return (
    <>
      <Hero />

      <section className="shell category-panel-wrap" aria-label="Categorias">
        <div className="category-panel" data-reveal>
          {categories.map(c => (
            <Link to={c.key === 'todos' ? '/produtos' : `/produtos?categoria=${c.key}`} className="category-chip" key={c.key}>
              <span><img src={c.photo || '/img/placeholder-produto.webp'} alt="" loading="lazy" /></span>
              <b>{c.label}</b>
            </Link>
          ))}
        </div>
      </section>

      <Shelf id="mais-vendidos" title="Mais vendidos" to="/produtos" items={bestSellers} />

      <section className="shell collection-row" aria-label="Coleções">
        <Link to="/produtos?categoria=nossa-senhora" className="collection-banner" data-reveal>
          <img src="/img/banners/colecao-nossa-senhora.webp" srcSet={responsive('/img/banners/colecao-nossa-senhora.webp', 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
          <div>
            <h2>Coleção<br />Nossa Senhora</h2>
            <p>Diversas representações de Maria para a sua devoção.</p>
            <span className="button dark small">Ver coleção <ArrowRight /></span>
          </div>
        </Link>
        <Link to="/produtos" className="collection-banner" data-reveal style={{ '--i': 1 }}>
          <img src="/img/banners/presentes-de-fe.webp" srcSet={responsive('/img/banners/presentes-de-fe.webp', 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
          <div>
            <h2>Presentes<br />de Fé</h2>
            <p>Peças especiais para batizados, casamentos e datas importantes.</p>
            <span className="button dark small">Escolher presente <ArrowRight /></span>
          </div>
        </Link>
      </section>

      <Shelf id="novidades" title="Novidades da loja" to="/produtos?categoria=novidades" items={news} />

      <section className="shell reasons-wrap" aria-labelledby="reasons-title">
        <div className="reasons" data-reveal>
          <h2 id="reasons-title">Por que comprar com a gente?</h2>
          <ul>
            {reasons.map(({ icon: Icon, title, text }) => (
              <li key={title}><Icon /><span><b>{title}</b>{text}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
