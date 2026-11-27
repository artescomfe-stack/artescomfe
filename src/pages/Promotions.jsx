import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, Tag } from 'lucide-react'
import { products } from '../products.js'
import { usePageTitle, useShop } from '../shop.jsx'
import { Instagram, PageIntro, ProductCard, SectionHeading, WhatsApp } from '../ui.jsx'
import { store, whatsappLink } from '../store.js'

// Promoções: qualquer peça com `oldPrice` no catálogo aparece aqui automaticamente.
const promoMessage = 'Olá, Artes com Fé! 🙏 Quero ficar sabendo das próximas promoções. Pode me avisar?'

export default function Promotions() {
  usePageTitle('Promoções')
  useShop() // redesenha quando o catálogo do Supabase chega
  const onSale = products.filter(p => p.oldPrice && p.available)
  const suggestions = products.filter(p => p.available).slice(0, 4)

  return (
    <div className="promo-page">
      <PageIntro
        crumbs={[{ label: 'Promoções' }]}
        eyebrow="Promoções Artes com Fé"
        title={'Sua imagem de devoção,\ncom um carinho a mais.'}
        text="Ofertas especiais em imagens selecionadas — enquanto durarem os estoques. As novidades aparecem primeiro no nosso Instagram e no WhatsApp. 🙏"
        banner="/img/banners/presentes-de-fe.webp"
      />

      <div className="shell">
        {onSale.length ? (
          <section className="promo-list">
            <SectionHeading title={`${onSale.length} ${onSale.length === 1 ? 'imagem em promoção' : 'imagens em promoção'}`} />
            <div className="catalog-grid">
              {onSale.map((p, i) => <ProductCard key={p.id} product={p} index={i % 3} sizes="(max-width: 900px) 46vw, 300px" />)}
            </div>
          </section>
        ) : (
          <section className="promo-soon" data-reveal>
            <div className="promo-soon-icon"><Tag /><span /></div>
            <h2>Promoções chegando por aí… ✨</h2>
            <p>No momento não temos imagens em promoção, mas as ofertas aparecem primeiro para quem acompanha a Artes com Fé de pertinho.</p>
            <div className="promo-soon-actions">
              <a className="button whatsapp" href={whatsappLink(promoMessage)} target="_blank" rel="noreferrer"><BellRing /> Quero ser avisado(a)</a>
              <a className="button outline" href={store.instagram} target="_blank" rel="noreferrer"><Instagram /> Seguir no Instagram</a>
            </div>
          </section>
        )}

        <section className="related">
          <SectionHeading title="Enquanto isso, você vai amar" to="/produtos" />
          <div className="related-grid">
            {suggestions.map((p, i) => <ProductCard key={p.id} product={p} index={i} sizes="(max-width: 900px) 46vw, 300px" />)}
          </div>
        </section>
      </div>
    </div>
  )
}
