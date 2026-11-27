import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { usePageTitle, useShop } from '../shop.jsx'
import { Instagram, Lines, Ornament, SmartLink, WhatsApp, responsive } from '../ui.jsx'
import { helloMessage, store, whatsappLink } from '../store.js'
import { pageContent } from '../content.js'
import { SiteIcon } from '../icons.jsx'

// Página "Sobre nós" (/sobre). Textos e imagens: painel → Textos das páginas → Sobre nós / Como comprar
// (site_content 'about' e 'howto'). O que for salvo vale como está; campo opcional vazio some do site.
export const aboutDefaults = {
  heroEyebrow: 'Nossa história',
  heroTitle: 'Arte que nasce\nda fé.',
  heroText: 'A Artes com Fé nasceu do desejo de levar beleza e devoção para dentro de cada lar. Selecionamos imagens sacras com acabamento cuidadoso para que o seu oratório, a sua sala ou o seu presente sejam um sinal da presença de Deus no dia a dia.',
  heroButton: 'Conhecer a loja',
  heroImage: '/img/logo/logo.webp',
  quote: 'Cada imagem é um convite à oração: um lembrete silencioso de que nunca caminhamos sozinhos.',
  story: [
    { text: 'Nosso logotipo traz Santo Antônio com os lírios nas mãos e o olhar voltado para o alto — um símbolo de pureza, de confiança e de quem busca a Deus em cada detalhe da vida. É esse olhar que guia a escolha de cada peça da loja. 🙏' },
    { text: 'Nossa Senhora, os santos de devoção, a Sagrada Família e o Cristo: imagens escolhidas com cuidado, valorizando a tradição cristã, para fortalecer a sua fé e tornar o seu lar um espaço de oração e paz.' },
  ],
  signature: 'Com carinho e devoção,',
  signatureName: 'Artes com Fé',
  values: [
    { icon: 'sparkles', title: 'Elegância devocional', text: 'Arte sacra que inspira, acolhe e fortalece a fé de quem reza e de quem contempla.' },
    { icon: 'gem', title: 'Acabamento sofisticado', text: 'Pérolas, dourados, bronze e cores pintadas à mão: riqueza de detalhes em cada peça.' },
    { icon: 'gift', title: 'Presentes com significado', text: 'Imagens que marcam batizados, casamentos, aniversários e momentos de fé.' },
  ],
  lines: [
    { image: '/img/banners/colecao-nossa-senhora.webp', eyebrow: 'Coleção Nossa Senhora', title: 'Maria, Mãe\ne Rainha do lar.', button: 'Ver coleção', link: '/produtos?categoria=nossa-senhora' },
    { image: '/img/banners/santos.webp', eyebrow: 'Santos', title: 'Amigos de Deus,\nexemplos de fé.', button: 'Ver santos', link: '/produtos?categoria=santos' },
  ],
  verse: 'Onde está o teu tesouro, aí estará também o teu coração.',
  verseRef: 'Mateus 6,21',
  communityEyebrow: 'No Instagram',
  communityTitle: 'Sua imagem no oratório é a nossa alegria',
  communityText: 'Acompanhe as novidades, os bastidores e os oratórios dos nossos clientes no Instagram. Recebeu a sua imagem? Marque a gente — vamos amar ver onde ela foi morar! 🙏',
  instaPhotos: [
    { image: '/img/produtos/02-02-480.webp' },
    { image: '/img/produtos/06-02-480.webp' },
    { image: '/img/produtos/09-02-480.webp' },
    { image: '/img/produtos/12-02-480.webp' },
  ],
}

export const howtoDefaults = {
  eyebrow: 'Simples e com atendimento de perto',
  title: 'Como comprar na Artes com Fé',
  steps: [
    { icon: 'bag', title: 'Escolha suas imagens', text: 'Navegue pela loja, veja todas as fotos e junte as suas favoritas na sacola.' },
    { icon: 'chat', title: 'Chame no WhatsApp', text: 'Seu pedido vai pronto para a nossa conversa. Lá confirmamos medidas, pagamento e frete.' },
    { icon: 'package', title: 'Receba com cuidado', text: 'Entrega combinada pelo WhatsApp, com embalagem reforçada para a sua imagem chegar perfeita.' },
  ],
  whatsappButton: 'Falar com a Artes com Fé',
  shopButton: 'Escolher minhas imagens',
}

export default function About() {
  usePageTitle('Sobre nós')
  useShop() // redesenha quando as configurações e os textos chegam
  const c = pageContent('about', aboutDefaults)
  const how = pageContent('howto', howtoDefaults)
  const story = (c.story || []).filter(p => p?.text)

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="shell about-hero-inner">
          <div className="about-hero-copy">
            <nav className="breadcrumb" aria-label="Você está em"><Link to="/">Início</Link><span>/</span><b>Sobre nós</b></nav>
            {c.heroEyebrow && <p className="eyebrow">{c.heroEyebrow}</p>}
            <h1><Lines text={c.heroTitle} lastEm /></h1>
            {c.heroText && <p>{c.heroText}</p>}
            <div className="about-hero-actions">
              {c.heroButton && <Link className="button dark" to="/produtos">{c.heroButton} <ArrowRight /></Link>}
              <a className="button outline" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> {store.instagramHandle}</a>
            </div>
          </div>
          <figure className="about-logo" aria-hidden="true">
            <img src={c.heroImage || aboutDefaults.heroImage} alt="" />
          </figure>
        </div>
      </section>

      <section className="story shell">
        {c.quote && (
          <div className="story-quote" data-reveal>
            <span className="quote-mark">“</span>
            <blockquote>{c.quote}</blockquote>
          </div>
        )}
        <div className="story-text">
          {story.map((p, i) => <p key={i} data-reveal style={i ? { '--i': i } : undefined}>{p.text}</p>)}
          {(c.signature || c.signatureName) && <p className="signature" data-reveal style={{ '--i': story.length }}>{c.signature} <b>{c.signatureName}</b></p>}
        </div>
      </section>

      {(c.values || []).length > 0 && (
        <section className="values shell" aria-label="O que nos move">
          {c.values.map((v, i) => (
            <article key={i} data-reveal style={{ '--i': i }}>
              <SiteIcon name={v.icon} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </section>
      )}

      {(c.lines || []).length > 0 && (
        <section className="collection-row shell about-collections" aria-label="Nossas coleções">
          {c.lines.map((line, i) => (
            <SmartLink key={i} to={line.link} className="collection-banner" data-reveal={i % 2 ? 'right' : 'left'}>
              <img src={line.image} srcSet={responsive(line.image, 800)} sizes="(max-width: 900px) 100vw, 50vw" alt="" loading="lazy" />
              <div>
                {line.eyebrow && <p className="eyebrow">{line.eyebrow}</p>}
                <h2><Lines text={line.title} /></h2>
                {line.button && <span className="button dark small">{line.button} <ArrowRight /></span>}
              </div>
            </SmartLink>
          ))}
        </section>
      )}

      {c.verse && (
        <section className="verse-x" aria-label="Versículo">
          <div className="shell" data-reveal>
            <Ornament />
            <blockquote>“<Lines text={c.verse} />”</blockquote>
            {c.verseRef && <span>{c.verseRef}</span>}
          </div>
        </section>
      )}

      <section className="how shell" id="como-comprar" aria-labelledby="how-title">
        <div className="editorial-heading" data-reveal>
          {how.eyebrow && <p className="eyebrow">{how.eyebrow}</p>}
          <h2 id="how-title">{how.title}</h2>
        </div>
        <ol className="how-steps">
          {(how.steps || []).map((step, i) => (
            <li key={i} data-reveal style={{ '--i': i }}>
              <span className="how-number">0{i + 1}</span>
              <SiteIcon name={step.icon} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="how-cta" data-reveal>
          {how.whatsappButton && <a className="button whatsapp" href={whatsappLink(helloMessage)} target="_blank" rel="noreferrer"><WhatsApp /> {how.whatsappButton}</a>}
          {how.shopButton && <Link className="button outline" to="/produtos">{how.shopButton} <ArrowRight /></Link>}
        </div>
      </section>

      <section className="community">
        <div className="shell community-inner">
          <div className="community-copy" data-reveal="left">
            {c.communityEyebrow && <p className="eyebrow">{c.communityEyebrow}</p>}
            <h2><Lines text={c.communityTitle} /></h2>
            {c.communityText && <p>{c.communityText}</p>}
            <a className="button dark" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> Seguir {store.instagramHandle}</a>
          </div>
          {(c.instaPhotos || []).length > 0 && (
            <ul className="insta-row" data-reveal="right">
              {c.instaPhotos.filter(p => p?.image).map((p, i) => (
                <li key={i}><a href={store.instagram} target="_blank" rel="noreferrer" aria-label="Ver no Instagram"><img src={p.image} alt="" loading="lazy" /><Instagram /></a></li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
