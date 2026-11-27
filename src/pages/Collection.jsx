import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Gift } from 'lucide-react'
import { products } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { Ornament, PageIntro, ProductCard, WhatsApp } from '../ui.jsx'
import { whatsappLink } from '../store.js'
import { pageContent } from '../content.js'

// Página da coleção (/colecao): tudo vem do painel → Coleção (site_content 'collection'):
// nome (também é o nome no menu, quando ligado), textos do topo, produtos escolhidos na ordem
// e o quadro do final. Serve para qualquer coleção: Natal, Páscoa, Dia das Mães, Batizado…

export const COLLECTION_PATH = '/colecao'

export const collectionDefaults = {
  name: 'Coleção de Natal',
  showInMenu: false,
  eyebrow: 'Edição especial',
  title: 'Coleção\nde Natal.',
  text: 'Presépios, Sagrada Família e imagens escolhidas para celebrar o nascimento de Jesus com a família reunida.',
  image: '/img/banners/sagrada-familia.webp',
  listSuffix: 'para o seu Natal',
  emptyText: 'Em breve, novidades especiais.',
  giftShow: true,
  giftTitle: 'Vai presentear alguém?',
  giftText: 'Conta pra gente no WhatsApp: ajudamos a escolher a imagem e preparamos tudo com carinho. 🙏',
  giftMessage: 'Olá, Artes com Fé! 🎁 Quero presentear alguém com uma imagem da coleção. Pode me ajudar?',
  productIds: [],
}

export const getCollection = () => {
  const c = pageContent('collection', collectionDefaults)
  return { ...c, name: String(c.name || '').trim() || collectionDefaults.name }
}

// Produtos da coleção, na ordem escolhida no painel (ocultos não estão no catálogo e ficam de fora).
export const collectionProducts = c => (Array.isArray(c.productIds) ? c.productIds : [])
  .map(uuid => products.find(p => p.uuid === uuid)).filter(Boolean)

export default function Collection() {
  useShop() // redesenha quando o catálogo do Supabase chega
  const c = getCollection()
  usePageTitle(c.name)
  const items = collectionProducts(c)

  return (
    <div className="colecao-page">
      <PageIntro
        crumbs={[{ label: c.name }]}
        eyebrow={c.eyebrow}
        title={c.title || c.name}
        text={c.text}
        banner={c.image || collectionDefaults.image}
      />

      <div className="shell">
        <section className="colecao-list">
          <div className="colecao-divider" aria-hidden="true"><Ornament /></div>
          <h2 className="colecao-heading">{items.length
            ? `${items.length} ${items.length === 1 ? 'produto escolhido' : 'produtos escolhidos'}${c.listSuffix ? ` ${c.listSuffix}` : ''}`
            : 'A coleção está chegando…'}</h2>
          {items.length > 0 ? (
            <div className="catalog-grid">
              {items.map((p, i) => <ProductCard key={p.id} product={p} index={i % 3} sizes="(max-width: 900px) 46vw, 300px" />)}
            </div>
          ) : (
            <p className="colecao-empty">{c.emptyText} Enquanto isso, <Link to="/produtos">veja todos os produtos</Link>.</p>
          )}
        </section>

        {c.giftShow && (c.giftTitle || c.giftText) && (
          <section className="colecao-gift" data-reveal>
            <span className="colecao-gift-icon"><Gift /></span>
            <div>
              {c.giftTitle && <h2>{c.giftTitle}</h2>}
              {c.giftText && <p>{c.giftText}</p>}
            </div>
            <div className="colecao-gift-actions">
              <a className="button whatsapp" href={whatsappLink(c.giftMessage || collectionDefaults.giftMessage)} target="_blank" rel="noreferrer"><WhatsApp /> Falar com a Artes com Fé</a>
              <Link className="button outline" to="/produtos">Ver todos os produtos <ArrowRight /></Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
