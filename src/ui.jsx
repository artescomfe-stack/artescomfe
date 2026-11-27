import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import { useShop } from './shop.jsx'
import { helloMessage, store, whatsappLink } from './store.js'

// Links escolhidos no painel: '/página' (dentro do site), 'https://…' (outro site, nova aba),
// '{instagram}' (Instagram da loja) e '{whatsapp}' (conversa no WhatsApp da loja).
export const resolveLink = link => link === '{instagram}' ? store.instagram : link === '{whatsapp}' ? whatsappLink(helloMessage) : link

export function SmartLink({ to, className, children, fallback = '/produtos', ...rest }) {
  const href = resolveLink(to) || fallback
  if (/^(https?:|mailto:)/.test(href)) return <a className={className} href={href} target="_blank" rel="noreferrer" {...rest}>{children}</a>
  return <Link className={className} to={href} {...rest}>{children}</Link>
}

// Texto com Enter → linhas com <br />. A última linha pode vir em itálico (<em>) nos títulos.
export const Lines = ({ text, lastEm = false }) => {
  const lines = String(text || '').split('\n')
  return lines.map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{lastEm && i === lines.length - 1 && lines.length > 1 ? <em>{line}</em> : line}</React.Fragment>)
}

// Imagens otimizadas em /public/img. Cada banner tem duas versões (leve e grande); o navegador escolhe a ideal.
export const logo = '/img/logo/emblema.webp'
export const logoFull = '/img/logo/logo.webp'
// Banners: hero 2400px (+ versão 1200px) · boxes 1600px (+ versão 800px)
// Fotos enviadas pelo painel seguem o mesmo padrão (nome.webp + nome-800.webp / -1200.webp).
// Imagem sem versão leve (.jpg/.png ou foto de produto) volta sem srcSet.
export const responsive = (image, small) => /^\/img\/banners\/|\/storage\/v1\/object\/public\/site\/(banners|categorias|paginas)\//.test(image || '') && /\.webp(\?.*)?$/.test(image)
  ? `${image.replace(/\.webp(\?.*)?$/, `-${small}.webp$1`)} ${small}w, ${image} ${small === 1200 ? 2400 : 1600}w`
  : undefined

export function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  )
}

export function WhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}

// Coraçãozinho desenhado à mão que acompanha a frase manuscrita.
export function HandHeart({ className = 'hand-heart' }) {
  return (
    <svg className={className} viewBox="0 0 40 36" aria-hidden="true">
      <path d="M20 33C14 27 4 21 4.5 12.5 5 6.5 11 3.5 15.5 6.5 18 8.2 19.4 10.8 20 12.6 21 9.6 23.4 6 27.6 5 33.4 3.8 37 8.8 35.4 14.6 33.6 21 25.6 26.6 19.4 34.2" />
    </svg>
  )
}

// Logotipo.
// - padrão: original (escudo com Santo Antônio + nome em arco + ornamento) — rodapé, Sobre, Login.
// - `horizontal`: emblema + nome lado a lado — cabeçalho e menu do celular.
// `light` = versão clara para fundos escuros.
export function Brand({ onClick, light = false, horizontal = false }) {
  if (horizontal) {
    return (
      <Link to="/" className="brand horizontal" aria-label="Artes com Fé, página inicial" onClick={onClick}>
        <img src={store.logo || logo} alt="" width="354" height="480" />
        <span className="brand-name">Artes com Fé<small>Arte Sacra • Devoção • Tradição</small></span>
      </Link>
    )
  }
  return (
    <Link to="/" className={`brand ${light ? 'light' : ''}`} aria-label="Artes com Fé, página inicial" onClick={onClick}>
      <img src={light ? (store.logoFooter || '/img/logo/logo-claro.webp') : logoFull} alt="Artes com Fé" width="495" height="840" />
    </Link>
  )
}

// Ornamento do logotipo: linhas finas com losangos ao centro (◇◆◇).
export function Ornament({ className = '' }) {
  return (
    <svg className={`ornament ${className}`} viewBox="0 0 220 24" aria-hidden="true">
      <path d="M2 12h78M140 12h78" />
      <path d="M24 17h58M138 17h58" opacity=".55" />
      <circle cx="2" cy="12" r="1.6" /><circle cx="218" cy="12" r="1.6" />
      <path d="M110 3l9 9-9 9-9-9z" />
      <path d="M92 12l5-5 5 5-5 5z M118 12l5-5 5 5-5 5z" />
    </svg>
  )
}

export function Price({ product, className = '' }) {
  return (
    <span className={`price ${className}`}>
      {product.oldPriceLabel && <s>{product.oldPriceLabel}</s>}
      <strong className={product.available ? '' : 'struck'}>{product.priceLabel}</strong>
    </span>
  )
}

const defaultSizes = '(max-width: 900px) 46vw, (max-width: 1200px) 30vw, 290px'

// Card de produto: foto em fundo claro, favorito no canto, botão da sacola sobre a foto,
// nome, preço e parcelas alinhados à esquerda.
export function ProductCard({ product, index = 0, sizes = defaultSizes }) {
  const { liked, toggleLike, addToBag } = useShop()
  const isLiked = liked.includes(product.id)
  const url = `/produto/${product.slug}`
  return (
    <article className={`product ${product.available ? '' : 'sold-out'}`} data-reveal style={{ '--i': index % 4 }}>
      <div className="product-image">
        <Link className="product-open" to={url} aria-label={`Ver detalhes de ${product.name}`}>
          <img src={product.thumbs[0]} srcSet={`${product.thumbs[0]} 480w, ${product.photos[0]} 1000w`} sizes={sizes} alt={product.name} loading="lazy" style={product.photoStyle} />
          {product.photos[1] && <img className="alt" src={product.thumbs[1]} srcSet={`${product.thumbs[1]} 480w, ${product.photos[1]} 1000w`} sizes={sizes} alt="" loading="lazy" style={product.photoStyle} />}
        </Link>
        {product.oldPrice && product.available ? <span className="badge-tag">Oferta</span> : product.isNew && product.available && <span className="badge-tag new">Novidade</span>}
        <button className={`like ${isLiked ? 'liked' : ''}`} onClick={() => toggleLike(product.id)} aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}><Heart fill={isLiked ? 'currentColor' : 'none'} /></button>
        {product.available
          ? <button className="add" onClick={() => addToBag(product)} aria-label={`Adicionar ${product.name} à sacola`}><ShoppingBag /></button>
          : <span className="badge-soldout">Esgotado</span>}
      </div>
      <div className="product-body">
        <h3><Link to={url}>{product.name}</Link></h3>
        <Price product={product} />
        <small>{product.available ? `${product.installments} sem juros` : 'Indisponível no momento'}</small>
      </div>
    </article>
  )
}

// Título de seção: nome à esquerda, "Ver todas" à direita.
export function SectionHeading({ title, to, linkLabel = 'Ver todas', id }) {
  return (
    <div className="section-heading" data-reveal>
      <h2 id={id}>{title}</h2>
      {to && <Link to={to}>{linkLabel} <ArrowRight /></Link>}
    </div>
  )
}

// Cabeçalho das páginas internas: um banner único, com a foto da coleção à esquerda e o texto à direita.
// Sem `banner`, vira uma faixa clara com o emblema em marca d'água.
export function PageIntro({ crumbs = [], eyebrow, title, text, aside, banner }) {
  const lines = String(title).split(/\n/)
  return (
    <section className="page-intro">
      <div className="shell">
        <div className={`page-banner-x ${banner ? 'with-photo' : ''}`}>
          {banner
            ? <img className="page-banner-photo" src={banner} srcSet={responsive(banner, 800)} sizes="(max-width: 900px) 100vw, 1240px" alt="" />
            : <img className="page-banner-emblem" src={logo} alt="" aria-hidden="true" />}
          <div className="page-banner-copy">
            <nav className="breadcrumb" aria-label="Você está em">
              <Link to="/">Início</Link>
              {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  <span>/</span>
                  {crumb.to && i < crumbs.length - 1 ? <Link to={crumb.to}>{crumb.label}</Link> : <b>{crumb.label}</b>}
                </React.Fragment>
              ))}
            </nav>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{lines.map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</h1>
            {text && <p className="page-intro-text">{text}</p>}
            {aside}
          </div>
        </div>
      </div>
    </section>
  )
}
