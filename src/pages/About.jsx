import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Gem, Gift, MessageCircle, Package, ShoppingBag, Sparkles } from 'lucide-react'
import { usePageTitle, useShop } from '../shop.jsx'
import { Instagram, Ornament, WhatsApp, responsive } from '../ui.jsx'
import { helloMessage, store, whatsappLink } from '../store.js'

// TODO: revisar a história com a dona da loja — texto inicial escrito a partir da identidade da marca.

const values = [
  { icon: Sparkles, title: 'Elegância devocional', text: 'Arte sacra que inspira, acolhe e fortalece a fé de quem reza e de quem contempla.' },
  { icon: Gem, title: 'Acabamento sofisticado', text: 'Pérolas, dourados, bronze e cores pintadas à mão: riqueza de detalhes em cada peça.' },
  { icon: Gift, title: 'Presentes com significado', text: 'Imagens que marcam batizados, casamentos, aniversários e momentos de fé.' },
]

const steps = [
  { icon: ShoppingBag, title: 'Escolha suas imagens', text: 'Navegue pela loja, veja todas as fotos e junte as suas favoritas na sacola.' },
  { icon: MessageCircle, title: 'Chame no WhatsApp', text: 'Seu pedido vai pronto para a nossa conversa. Lá confirmamos medidas, pagamento e frete.' },
  { icon: Package, title: 'Receba em casa', text: 'Enviamos para todo o Brasil, com embalagem reforçada para a sua imagem chegar perfeita.' },
]

// Fotos da vitrine do Instagram (troque pelas do perfil quando quiser).
const instaPhotos = ['/img/produtos/02-02-480.webp', '/img/produtos/06-02-480.webp', '/img/produtos/09-02-480.webp', '/img/produtos/12-02-480.webp']

export default function About() {
  usePageTitle('Sobre nós')
  useShop() // redesenha quando as configurações (Instagram/WhatsApp) chegam
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="shell about-hero-inner">
          <div className="about-hero-copy">
            <nav className="breadcrumb" aria-label="Você está em"><Link to="/">Início</Link><span>/</span><b>Sobre nós</b></nav>
            <p className="eyebrow">Nossa história</p>
            <h1>Arte que nasce<br /><em>da fé.</em></h1>
            <p>A Artes com Fé nasceu do desejo de levar beleza e devoção para dentro de cada lar. Selecionamos imagens sacras com acabamento cuidadoso para que o seu oratório, a sua sala ou o seu presente sejam um sinal da presença de Deus no dia a dia.</p>
            <div className="about-hero-actions">
              <Link className="button dark" to="/produtos">Conhecer a loja <ArrowRight /></Link>
              <a className="button outline" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> {store.instagramHandle}</a>
            </div>
          </div>
          <figure className="about-logo" aria-hidden="true">
            <img src="/img/logo/logo.webp" alt="" />
          </figure>
        </div>
      </section>

      <section className="story shell">
        <div className="story-quote" data-reveal>
          <span className="quote-mark">“</span>
          <blockquote>Cada imagem é um convite à oração: um lembrete silencioso de que nunca caminhamos sozinhos.</blockquote>
        </div>
        <div className="story-text">
          <p data-reveal>Nosso logotipo traz Santo Antônio com os lírios nas mãos e o olhar voltado para o alto — um símbolo de pureza, de confiança e de quem busca a Deus em cada detalhe da vida. É esse olhar que guia a escolha de cada peça da loja. 🙏</p>
          <p data-reveal style={{ '--i': 1 }}>Nossa Senhora, os santos de devoção, a Sagrada Família e o Cristo: imagens escolhidas com cuidado, valorizando a tradição cristã, para fortalecer a sua fé e tornar o seu lar um espaço de oração e paz.</p>
          <p className="signature" data-reveal style={{ '--i': 2 }}>Com carinho e devoção, <b>Artes com Fé</b></p>
        </div>
      </section>

      <section className="values shell" aria-label="O que nos move">
        {values.map(({ icon: Icon, title, text }, i) => (
          <article key={title} data-reveal style={{ '--i': i }}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="collection-row shell about-collections" aria-label="Nossas coleções">
        <Link to="/produtos?categoria=nossa-senhora" className="collection-banner" data-reveal="left">
          <img src="/img/banners/colecao-nossa-senhora.webp" srcSet={responsive('/img/banners/colecao-nossa-senhora.webp', 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
          <div>
            <p className="eyebrow">Coleção Nossa Senhora</p>
            <h2>Maria, Mãe<br />e Rainha do lar.</h2>
            <span className="button dark small">Ver coleção <ArrowRight /></span>
          </div>
        </Link>
        <Link to="/produtos?categoria=santos" className="collection-banner" data-reveal="right">
          <img src="/img/banners/santos.webp" srcSet={responsive('/img/banners/santos.webp', 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
          <div>
            <p className="eyebrow">Santos</p>
            <h2>Amigos de Deus,<br />exemplos de fé.</h2>
            <span className="button dark small">Ver santos <ArrowRight /></span>
          </div>
        </Link>
      </section>

      <section className="verse-x" aria-label="Versículo">
        <div className="shell" data-reveal>
          <Ornament />
          <blockquote>“Onde está o teu tesouro, aí estará também o teu coração.”</blockquote>
          <span>Mateus 6,21</span>
        </div>
      </section>

      <section className="how shell" id="como-comprar" aria-labelledby="how-title">
        <div className="editorial-heading" data-reveal>
          <p className="eyebrow">Simples e com atendimento de perto</p>
          <h2 id="how-title">Como comprar na Artes com Fé</h2>
        </div>
        <ol className="how-steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} data-reveal style={{ '--i': i }}>
              <span className="how-number">0{i + 1}</span>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="how-cta" data-reveal>
          <a className="button whatsapp" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Falar com a Artes com Fé</a>
          <Link className="button outline" to="/produtos">Escolher minhas imagens <ArrowRight /></Link>
        </div>
      </section>

      <section className="community">
        <div className="shell community-inner">
          <div className="community-copy" data-reveal="left">
            <p className="eyebrow">No Instagram</p>
            <h2>Sua imagem no oratório é a nossa alegria</h2>
            <p>Acompanhe as novidades, os bastidores e os oratórios dos nossos clientes no Instagram. Recebeu a sua imagem? Marque a gente — vamos amar ver onde ela foi morar! 🙏</p>
            <a className="button dark" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> Seguir {store.instagramHandle}</a>
          </div>
          <ul className="insta-row" data-reveal="right">
            {instaPhotos.map(src => (
              <li key={src}><a href={store.instagram} target="_blank" rel="noreferrer" aria-label="Ver no Instagram"><img src={src} alt="" loading="lazy" /><Instagram /></a></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
