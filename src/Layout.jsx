import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useNavigationType, useSearchParams } from 'react-router-dom'
import { ArrowRight, CreditCard, Heart, LockKeyhole, Menu, Minus, Plus, Search, ShoppingBag, Trash2, Truck, UserRound, X } from 'lucide-react'
import { trackPage } from './track.js'
import { useRevealObserver, useShop } from './shop.jsx'
import { Brand, HandHeart, Instagram, WhatsApp } from './ui.jsx'
import { bagMessage, helloMessage, store, whatsappLink } from './store.js'
import { products } from './products.js'
import { supabase } from './supabase.js'
import AlphaCredit from './alpha-credit/AlphaCredit.jsx'

export const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Produtos', to: '/produtos' },
  { label: 'Nossa Senhora', to: '/produtos?categoria=nossa-senhora' },
  { label: 'Santos', to: '/produtos?categoria=santos' },
  { label: 'Sobre nós', to: '/sobre' },
]
const navCategories = navItems.map(item => item.to.split('categoria=')[1]).filter(Boolean)

// Marca o item do menu certo também quando a página é /produtos com categoria.
function isActive(item, location, params) {
  const [path, query] = item.to.split('?')
  if (path !== location.pathname) return false
  const categoria = params.get('categoria')
  if (query) return query === `categoria=${categoria}`
  return path !== '/produtos' || !categoria || !navCategories.includes(categoria)
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
      <input value={term} onChange={e => setTerm(e.target.value)} aria-label="Buscar produtos" placeholder="Buscar imagens…" />
    </form>
  )
}

function BagDrawer() {
  const { bagItems, bagOpen, closeBag, changeQuantity, removeFromBag } = useShop()
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
              <a className="button whatsapp" href={whatsappLink(bagMessage(bagItems))} target="_blank" rel="noreferrer"><WhatsApp /> Finalizar pelo WhatsApp</a>
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

export default function Layout() {
  const location = useLocation()
  const [params] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const { bagCount, openBag, toast, dismissToast, user, profile } = useShop()
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
    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }))
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
      <div className="announcement" aria-label="Vantagens da loja">
        <div className="shell announcement-inner">
          <span><Truck /> Envio e retirada combinados no WhatsApp</span>
          <span><CreditCard /> Em até 2x sem juros</span>
          <span><LockKeyhole /> Compra segura com atendimento direto</span>
        </div>
      </div>

      <header className="header">
        <div className="shell header-inner">
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <Brand horizontal />
          <nav className="main-nav" aria-label="Menu principal">
            {navItems.map(item => (
              <NavLink key={item.label} to={item.to} className={() => isActive(item, location, params) ? 'active' : ''} end>{item.label}</NavLink>
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
        {navItems.map(item => <Link to={item.to} key={item.label} className={isActive(item, location, params) ? 'active' : ''}>{item.label}<ArrowRight /></Link>)}
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
              <h2 id="community-title">Faça parte da nossa comunidade</h2>
              <p>Seja o primeiro a saber dos lançamentos, das novas imagens e das ofertas especiais.</p>
            </div>
            <div className="community-form"><Newsletter /></div>
            <div className="community-art" aria-hidden="true">
              <img src="/img/logo/emblema.webp" alt="" />
              <p>Fé em cada<br />detalhe<HandHeart className="hand-heart small" /></p>
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="shell footer-inner">
          <div className="footer-brand" data-reveal>
            <Brand light />
            <div className="footer-social">
              <a href={store.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
              <a href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
            </div>
          </div>
          <div data-reveal style={{ '--i': 1 }}><h3>Loja</h3><Link to="/produtos">Todos os produtos</Link><Link to="/produtos?categoria=nossa-senhora">Nossa Senhora</Link><Link to="/produtos?categoria=santos">Santos</Link><Link to="/produtos?categoria=sagrada-familia">Sagrada Família</Link><Link to="/promocoes">Ofertas</Link></div>
          <div data-reveal style={{ '--i': 2 }}><h3>Ajuda</h3><Link to="/sobre#como-comprar">Como comprar</Link><Link to="/sobre#como-comprar">Envio e entrega</Link><Link to="/entrar">Minha conta</Link></div>
          <div data-reveal style={{ '--i': 3 }}><h3>Artes com Fé</h3><Link to="/sobre">Sobre nós</Link><a href={store.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer">Fale conosco</a></div>
          <div className="footer-contact" data-reveal style={{ '--i': 4 }}>
            <h3>Atendimento</h3>
            <p>Tire dúvidas, confira medidas e finalize seu pedido direto com a gente.</p>
            <a className="button whatsapp small" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Chamar no WhatsApp</a>
          </div>
        </div>
        <div className="copyright"><div className="shell">© {new Date().getFullYear()} Artes com Fé. Todos os direitos reservados.</div></div>
        <div className="dev-credit"><div className="shell"><AlphaCredit /></div></div>
      </footer>

      <BagDrawer />

      {toast && (
        <div className="toast" key={toast.key} role="status">
          <ShoppingBag /> <span><b>{toast.name}</b> foi para a sacola</span>
          <button onClick={() => { dismissToast(); openBag() }}>Ver sacola</button>
        </div>
      )}


    </>
  )
}
