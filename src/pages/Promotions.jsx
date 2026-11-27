import React from 'react'
import { BellRing, Tag } from 'lucide-react'
import { products } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { Instagram, PageIntro, ProductCard, SectionHeading } from '../ui.jsx'
import { store, whatsappLink } from '../store.js'
import { pageContent } from '../content.js'

// Promoções (/promocoes): qualquer produto com "preço antigo" aparece aqui sozinho.
// Textos: painel → Textos das páginas → Ofertas (site_content 'promotions').
export const promotionsDefaults = {
  eyebrow: 'Promoções Artes com Fé',
  title: 'Sua imagem de devoção,\ncom um carinho a mais.',
  text: 'Ofertas especiais em imagens selecionadas — enquanto durarem os estoques. As novidades aparecem primeiro no nosso Instagram e no WhatsApp. 🙏',
  image: '/img/banners/presentes-de-fe.webp',
  emptyTitle: 'Promoções chegando por aí… ✨',
  emptyText: 'No momento não temos imagens em promoção, mas as ofertas aparecem primeiro para quem acompanha a Artes com Fé de pertinho.',
  notifyButton: 'Quero ser avisado(a)',
  notifyMessage: 'Olá, Artes com Fé! 🙏 Quero ficar sabendo das próximas promoções. Pode me avisar?',
  suggestionsTitle: 'Enquanto isso, você vai amar',
}

export default function Promotions() {
  usePageTitle('Promoções')
  useShop() // redesenha quando o catálogo do Supabase chega
  const c = pageContent('promotions', promotionsDefaults)
  const onSale = products.filter(p => p.oldPrice && p.available)
  const suggestions = products.filter(p => p.available).slice(0, 4)

  return (
    <div className="promo-page">
      <PageIntro
        crumbs={[{ label: 'Promoções' }]}
        eyebrow={c.eyebrow}
        title={c.title}
        text={c.text}
        banner={c.image || promotionsDefaults.image}
      />

      <div className="shell">
        {onSale.length ? (
          <section className="promo-list">
            <SectionHeading title={`${onSale.length} ${onSale.length === 1 ? 'produto em promoção' : 'produtos em promoção'}`} />
            <div className="catalog-grid">
              {onSale.map((p, i) => <ProductCard key={p.id} product={p} index={i % 3} sizes="(max-width: 900px) 46vw, 300px" />)}
            </div>
          </section>
        ) : (
          <section className="promo-soon" data-reveal>
            <div className="promo-soon-icon"><Tag /><span /></div>
            <h2>{c.emptyTitle}</h2>
            {c.emptyText && <p>{c.emptyText}</p>}
            <div className="promo-soon-actions">
              {c.notifyButton && <a className="button whatsapp" href={whatsappLink(c.notifyMessage || promotionsDefaults.notifyMessage)} target="_blank" rel="noreferrer"><BellRing /> {c.notifyButton}</a>}
              <a className="button outline" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> Seguir no Instagram</a>
            </div>
          </section>
        )}

        {c.suggestionsTitle && (
          <section className="related">
            <SectionHeading title={c.suggestionsTitle} to="/produtos" />
            <div className="related-grid">
              {suggestions.map((p, i) => <ProductCard key={p.id} product={p} index={i} sizes="(max-width: 900px) 46vw, 300px" />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
