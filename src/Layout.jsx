import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useNavigationType, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, UserRound, X } from 'lucide-react'
import { trackPage } from './track.js'
import { useRevealObserver, useShop } from './shop.jsx'
import { Brand, HandHeart, Instagram, Lines, SmartLink, WhatsApp } from './ui.jsx'
import { bagMessage, helloMessage, store, whatsappLink } from './store.js'
import { products, spotlightProducts } from './products.js'
import { supabase } from './supabase.js'
import { pageContent } from './content.js'
import { SiteIcon, SocialIcon, socialHref } from './icons.jsx'
import AlphaCredit from './alpha-credit/AlphaCredit.jsx'

// ---------- Faixa de avisos do topo (painel → Textos das páginas → Faixa do topo) ----------
// {parcelas} = parcelas das Configurações; link '{instagram}' / '{whatsapp}' = Instagram / WhatsApp da loja.
export const announcementDefaults = {
  items: [
    { icon: 'truck', text: 'Envio e retirada combinados no WhatsApp', link: '' },
    { icon: 'card', text: 'Em até {parcelas}x sem juros', link: '' },
    { icon: 'lock', text: 'Compra segura com atendimento direto', link: '' },
  ],
}
const fillParcelas = text => String(text || '').replace(/\{parcelas\}/g, store.installments)

// ---------- Menu do topo (painel → Menu do site) ----------
// Os endereços são fixos; os nomes vêm do painel. A Coleção só aparece quando está ligada (painel → Coleção).
export const menuDefaults = { inicio: 'Início', produtos: 'Produtos', menuCat1: 'Nossa Senhora', menuCat2: 'Santos', promocoes: 'Ofertas', sobre: 'Sobre nós' }
export const getNavItems = () => {
  const names = pageContent('menu', menuDefaults)
  const label = key => String(names[key] || '').trim() || menuDefaults[key]
  const collection = pageContent('collection', { name: '', showInMenu: false })
  const showPromos = String(names.showPromos) === 'true'
  return [
    { label: label('inicio'), to: '/' },
    { label: label('produtos'), to: '/produtos' },
    { label: label('menuCat1'), to: '/produtos?categoria=nossa-senhora' },
    { label: label('menuCat2'), to: '/produtos?categoria=santos' },
    collection.showInMenu && String(collection.name || '').trim() && { label: String(collection.name).trim(), to: '/colecao' },
    showPromos && { label: label('promocoes'), to: '/promocoes' },
    { label: label('sobre'), to: '/sobre' },
  ].filter(Boolean)
}

// ---------- Rodapé (painel → Logo e rodapé) ----------
// Links: '{whatsapp}' = conversa no WhatsApp da loja; '{instagram}' = Instagram da loja. {ano} = ano atual.
export const footerDefaults = {
  columns: [
    { title: 'Loja', links: [{ label: 'Todos os produtos', link: '/produtos' }, { label: 'Nossa Senhora', link: '/produtos?categoria=nossa-senhora' }, { label: 'Santos', link: '/produtos?categoria=santos' }, { label: 'Sagrada Família', link: '/produtos?categoria=sagrada-familia' }, { label: 'Ofertas', link: '/promocoes' }] },
    { title: 'Ajuda', links: [{ label: 'Como comprar', link: '/sobre#como-comprar' }, { label: 'Envio e entrega', link: '/sobre#como-comprar' }, { label: 'Minha conta', link: '/entrar' }] },
    { title: 'Artes com Fé', links: [{ label: 'Sobre nós', link: '/sobre' }, { label: 'Instagram', link: '{instagram}' }, { label: 'Fale conosco', link: '{whatsapp}' }] },
  ],
  contactTitle: 'Atendimento',
  contactText: 'Tire dúvidas, confira medidas e finalize seu pedido direto com a gente.',
  contactButton: 'Chamar no WhatsApp',
  newsletterTitle: 'Faça parte da nossa comunidade',
  newsletterText: 'Seja o primeiro a saber dos lançamentos, das novas imagens e das ofertas especiais.',
  newsletterScript: 'Fé em cada\ndetalhe',
  copyright: '© {ano} Artes com Fé. Todos os direitos reservados.',
}

// Marca o item do menu certo também quando a página é /produtos com categoria.
function isActive(item, location, params, navCategories) {
  const [path, query] = item.to.split('?')
  if (path !== location.pathname) return false
  const categoria = params.get('categoria')
  if (query) return query === `categoria=${categoria}`
  return path !== '/produtos' || !categoria || !navCategories.includes(categoria)
}

// Faixa de avisos do topo: esteira infinita (mesma da Maré). Duas metades iguais andando de 0 a -50%.
// Pausa com o mouse em cima; parada para quem pede menos movimento no aparelho.
function Announcement() {
  const items = (pageContent('announcement', announcementDefaults).items || [])
    .filter(item => item?.text && !(store.installments <= 1 && item.text.includes('{parcelas}')))
    .map(item => ({ ...item, text: fillParcelas(item.text) }))
  if (!items.length) return null
  const reps = items.length >= 4 ? 3 : items.length >= 2 ? 5 : 10 // cada metade passa de ~3.000px (cobre monitores largos)
  const run = Array.from({ length: reps }, () => items).flat()
  const piece = (item, key) => {
    const content = <><SiteIcon name={item.icon} /> {item.text}</>
    return (
      <React.Fragment key={key}>
        {item.link
          ? <SmartLink to={item.link} className="marquee-item" tabIndex={-1}>{content}</SmartLink>
          : <span className="marquee-item">{content}</span>}
        <span className="marquee-sep" aria-hidden="true">✦</span>
      </React.Fragment>
    )
  }
  return (
    <div className="announcement" aria-label="Avisos da loja">
      <ul className="sr-only">{items.map((item, i) => <li key={i}>{item.link ? <SmartLink to={item.link}>{item.text}</SmartLink> : item.text}</li>)}</ul>
      <div className="marquee" aria-hidden="true" style={{ '--marquee-time': `${Math.round(Math.max(24, run.length * 5) / 0.65)}s` }}>
        <div className="marquee-track">
          {[0, 1].map(half => <div className="marquee-group" key={half}>{run.map((item, i) => piece(item, i))}</div>)}
        </div>
      </div>
    </div>
  )
}

function SearchBox({ onDone }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [term, setTerm] = useState(params.get('busca') || '')
  useEffect(() => { setTerm(params.get('busca') || '') }, [params])
  const submit = event => {
    event.preventDefault()
    navigate(term.trim() ? `/produtos?busca=${encodeURIComponent(term.trim())}` : '/produtos')
    onDone?.()
  }
  return (
    <form className="search" role="search" onSubmit={submit}>
      <Search />
      <input value={term} onChange={e => setTerm(e.target.value)} aria-label="Buscar produtos" placeholder="Buscar produtos…" />
    </form>
  )
}

function BagDrawer() {
  const { bagItems, bagOpen, closeBag, changeQuantity, removeFromBag, user, profile } = useShop()
  const buyer = { name: profile?.full_name, email: user?.email, phone: profile?.phone }
  const total = bagItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  useEffect(() => {
    if (!bagOpen) return
    const onKey = event => { if (event.key === 'Escape') closeBag() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bagOpen, closeBag])

  return (
    <>
      <aside className={`bag ${bagOpen ? 'open' : ''}`} aria-hidden={!bagOpen} aria-label="Sacola">
        <div className="bag-head">
          <h2>Meu pedido</h2>
          <button className="icon-button" onClick={closeBag} aria-label="Fechar sacola"><X /></button>
        </div>
        {bagItems.length === 0 ? (
          <div className="bag-empty">
            <ShoppingBag />
            <p>Sua sacola está vazia por enquanto.</p>
            <span>Escolha as imagens que tocaram o seu coração e finalize tudo de uma vez pelo WhatsApp. 🙏</span>
            <Link className="button dark small" to="/produtos" onClick={closeBag}>Ver imagens <ArrowRight /></Link>
          </div>
        ) : (
          <>
            <ul className="bag-list">
              {bagItems.map(({ product, quantity }) => (
                <li key={product.id}>
                  <Link to={`/produto/${product.slug}`} onClick={closeBag}><img src={product.thumbs[0]} alt="" style={product.photoStyle} /></Link>
                  <div>
                    <h3><Link to={`/produto/${product.slug}`} onClick={closeBag}>{product.name}</Link></h3>
                    <strong>{product.priceLabel}</strong>
                    <div className="bag-qty">
                      <button onClick={() => changeQuantity(product.id, quantity - 1)} aria-label="Diminuir quantidade"><Minus /></button>
                      <span aria-live="polite">{quantity}</span>
                      <button onClick={() => changeQuantity(product.id, quantity + 1)} aria-label="Aumentar quantidade"><Plus /></button>
                    </div>
                  </div>
                  <button className="bag-remove" onClick={() => removeFromBag(product.id)} aria-label={`Remover ${product.name}`}><Trash2 /></button>
                </li>
              ))}
            </ul>
            <div className="bag-foot">
              <p><span>Total estimado</span><strong>R$ {total.toFixed(2).replace('.', ',')}</strong></p>
              <a className="button whatsapp" href={whatsappLink(bagMessage(bagItems, buyer))} target="_blank" rel="noreferrer"><WhatsApp /> Finalizar pelo WhatsApp</a>
              <small>O WhatsApp da Artes com Fé abre com a sua lista pronta. Lá combinamos pagamento, frete e entrega.</small>
            </div>
          </>
        )}
      </aside>
      {bagOpen && <button className="bag-backdrop" onClick={closeBag} aria-label="Fechar sacola" />}
    </>
  )
}

// Newsletter: grava o e-mail no Supabase (função subscribe_newsletter).
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'ok' | 'error'
  const submit = async event => {
    event.preventDefault()
    if (!supabase) { setStatus('error'); return }
    setStatus('sending')
    const { error } = await supabase.rpc('subscribe_newsletter', { p_email: email, p_source: 'comunidade' })
    setStatus(error ? 'error' : 'ok')
    if (!error) setEmail('')
  }
  if (status === 'ok') return <p className="newsletter-ok" role="status">Prontinho! Você vai receber as novidades da Artes com Fé em primeira mão. 🙏</p>
  return (
    <>
      <form onSubmit={submit}>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus(null) }} aria-label="Seu e-mail" placeholder="Seu melhor e-mail" required disabled={status === 'sending'} />
        <button disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Cadastrar'}</button>
      </form>
      {status === 'error' && <p className="newsletter-error" role="alert">Não deu certo agora. Confira o e-mail e tente de novo, por favor.</p>}
    </>
  )
}

// ---------- Card flutuante (painel → Flutuantes): até 5 produtos, trocando sozinho ----------
function Spotlight() {
  const items = spotlightProducts()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState('next')
  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)
  const [paused, setPaused] = useState(false)
  const [offset, setOffset] = useState(0)
  const dragStart = useRef(null)
  const dragged = useRef(false)

  const go = step => {
    setDir(step > 0 ? 'next' : 'prev')
    setIndex(i => (i + step + items.length) % items.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible || closed || paused || items.length < 2) return
    const timer = setInterval(() => go(1), 5000)
    return () => clearInterval(timer)
  }, [visible, closed, paused, items.length, index])

  if (closed || !items.length) return null
  const product = items[index % items.length]

  const onPointerDown = event => {
    if (event.button !== undefined && event.button !== 0) return
    dragStart.current = event.clientX
    dragged.current = false
    setPaused(true)
  }
  const onPointerMove = event => {
    if (dragStart.current === null) return
    const dx = event.clientX - dragStart.current
    if (Math.abs(dx) > 6) dragged.current = true
    setOffset(Math.max(-90, Math.min(90, dx)))
  }
  const endDrag = event => {
    if (dragStart.current === null) return
    const dx = event.clientX - dragStart.current
    dragStart.current = null
    setOffset(0)
    if (event.pointerType !== 'mouse') setPaused(false)
    if (dx <= -40) go(1)
    else if (dx >= 40) go(-1)
  }

  return (
    <aside className={`spotlight ${visible ? 'show' : ''} ${offset ? 'dragging' : ''}`} aria-label="Destaques da Artes com Fé"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); dragStart.current = null; setOffset(0) }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={() => { dragStart.current = null; setOffset(0) }}>
      <div className="spotlight-viewport">
        <Link to={`/produto/${product.slug}`} className={`spotlight-body from-${dir}`} key={product.id}
          style={{ transform: offset ? `translateX(${offset}px)` : undefined, opacity: offset ? 1 - Math.abs(offset) / 220 : undefined }}
          onClick={event => { if (dragged.current) event.preventDefault() }} draggable={false}>
          <img src={product.thumbs[0]} alt="" draggable={false} />
          <div>
            <span className="spotlight-eyebrow">Destaque da Artes com Fé</span>
            <strong>{product.name}</strong>
            <span className="spotlight-link">{product.priceLabel} · Ver produto <ArrowUpRight /></span>
          </div>
        </Link>
      </div>
      <button className="spotlight-close" onClick={() => setClosed(true)} onPointerDown={event => event.stopPropagation()} aria-label="Fechar destaques"><X /></button>
      <div className="spotlight-dots" role="tablist" aria-label="Escolher destaque" onPointerDown={event => event.stopPropagation()}>
        {items.map((item, i) => (
          <button key={item.id} role="tab" aria-selected={i === index} aria-label={item.name} className={i === index ? 'active' : ''} onClick={() => { setDir(i > index ? 'next' : 'prev'); setIndex(i) }}>
            {i === index && !paused && <i key={index} />}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default function Layout() {
  const location = useLocation()
  const [params] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const { bagCount, openBag, toast, dismissToast, user, profile } = useShop()
  const navItems = getNavItems()
  const navCategories = navItems.map(item => item.to.split('categoria=')[1]).filter(Boolean)
  const footer = pageContent('footer', footerDefaults)
  const year = new Date().getFullYear()
  const accountIcon = profile?.avatar_url ? <img className="account-photo" src={profile.avatar_url} alt="" /> : <UserRound />
  useEffect(() => { trackPage(location.pathname) }, [location.pathname])
  useRevealObserver()

  // Ao trocar de página: volta ao topo (ou rola até a âncora #) e fecha o menu.
  // Filtros, ordenação e chips do catálogo atualizam a URL com "replace" — nesses casos
  // a página fica exatamente onde está (sem pular para o topo).
  const navigationType = useNavigationType()
  useEffect(() => {
    setMenuOpen(false)
    if (navigationType === 'REPLACE') return
    // Só âncoras de verdade (#como-comprar). Links de login/confirmação voltam com "#access_token=…", que não é seletor.
    if (/^#[a-z][\w-]*$/i.test(location.hash)) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Announcement />

      <header className="header">
        <div className="shell header-inner">
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <Brand horizontal />
          <nav className="main-nav" aria-label="Menu principal">
            {navItems.map(item => (
              <NavLink key={item.label} to={item.to} className={() => isActive(item, location, params, navCategories) ? 'active' : ''} end>{item.label}</NavLink>
            ))}
          </nav>
          <SearchBox />
          <div className="header-actions">
            <Link to="/entrar" className={`header-action hide-small account-link ${user ? 'logged' : ''}`} aria-label={user ? 'Minha conta' : 'Entrar na minha conta'} title={user ? 'Minha conta' : 'Entrar'}>{accountIcon}{user && <i aria-hidden="true" />}</Link>
            <Link to="/entrar" className="header-action hide-small" aria-label="Meus favoritos" title="Favoritos"><Heart /></Link>
            <button className="header-action cart" onClick={openBag} aria-label={`Sacola com ${bagCount} itens`} title="Sacola"><ShoppingBag /><b key={bagCount} className={bagCount ? 'bump' : ''}>{bagCount}</b></button>
            <a className="header-whats" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer" aria-label="Falar com a Artes com Fé no WhatsApp"><WhatsApp /><span>WhatsApp</span></a>
          </div>
        </div>
      </header>

      <div className={`drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-head"><Brand horizontal onClick={() => setMenuOpen(false)} /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div>
        {navItems.map(item => <Link to={item.to} key={item.label} className={isActive(item, location, params, navCategories) ? 'active' : ''}>{item.label}<ArrowRight /></Link>)}
        <Link to="/entrar" className="drawer-account">{user && profile?.avatar_url ? <img className="account-photo" src={profile.avatar_url} alt="" /> : <UserRound />} {user ? 'Minha conta' : 'Entrar / criar conta'}</Link>
        <a className="drawer-whats" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Fale com a gente</a>
      </div>
      {menuOpen && <button className="backdrop" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}

      <main id="conteudo" key={location.pathname}>
        <Outlet />
      </main>

      {location.pathname !== '/entrar' && (
        <section className="community-band" aria-labelledby="community-title">
          <div className="shell community-band-inner">
            <div>
              <h2 id="community-title">{footer.newsletterTitle}</h2>
              {footer.newsletterText && <p>{footer.newsletterText}</p>}
            </div>
            <div className="community-form"><Newsletter /></div>
            <div className="community-art" aria-hidden="true">
              <img src="/img/logo/emblema.webp" alt="" />
              {footer.newsletterScript && <p><Lines text={footer.newsletterScript} /><HandHeart className="hand-heart small" /></p>}
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="shell footer-inner">
          <div className="footer-brand" data-reveal>
            <Brand light />
            {store.footerText && <p className="footer-text"><Lines text={store.footerText} /></p>}
            <div className="footer-social">
              <a href={store.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
              <a href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
              {(store.social || []).filter(item => item.url && item.network !== 'instagram').map((item, i) => (
                <a key={i} href={socialHref(item)} target="_blank" rel="noreferrer" aria-label={item.label || item.network}><SocialIcon network={item.network} /></a>
              ))}
            </div>
          </div>
          {(footer.columns || []).map((column, i) => (
            <div key={i} data-reveal style={{ '--i': i + 1 }}>
              <h3>{column.title}</h3>
              {(column.links || []).map((item, k) => <SmartLink key={k} to={item.link} fallback="/">{item.label}</SmartLink>)}
            </div>
          ))}
          {(footer.contactTitle || footer.contactText) && (
            <div className="footer-contact" data-reveal style={{ '--i': (footer.columns || []).length + 1 }}>
              {footer.contactTitle && <h3>{footer.contactTitle}</h3>}
              {footer.contactText && <p>{footer.contactText}</p>}
              {footer.contactButton && <a className="button whatsapp small" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> {footer.contactButton}</a>}
            </div>
          )}
        </div>
        <div className="copyright"><div className="shell">{String(footer.copyright || footerDefaults.copyright).replace(/\{ano\}/g, year)}</div></div>
        <div className="dev-credit"><div className="shell"><AlphaCredit /></div></div>
      </footer>

      <BagDrawer />
      {location.pathname !== '/entrar' && <Spotlight />}

      {toast && (
        <div className="toast" key={toast.key} role="status">
          <ShoppingBag /> <span><b>{toast.name}</b> foi para a sacola</span>
          <button onClick={() => { dismissToast(); openBag() }}>Ver sacola</button>
        </div>
      )}


    </>
  )
}
