import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ContentEditor from '../components/ContentEditor.jsx'
import { useConfirm } from '../ui.jsx'
import { aboutDefaults, howtoDefaults } from '../../pages/About.jsx'
import { catalogDefaults } from '../../pages/Catalog.jsx'
import { promotionsDefaults } from '../../pages/Promotions.jsx'
import { productPageDefaults } from '../../pages/Product.jsx'
import { loginDefaults } from '../../pages/Login.jsx'
import { announcementDefaults } from '../../Layout.jsx'

// Textos das páginas: uma aba por página. Cada aba é um esquema de campos (ver ContentEditor).

const ENTER = 'Enter = quebra de linha.'
const TITLE_HINT = 'Enter = quebra de linha. A última linha aparece em itálico.'
const BANNER = { aspect: 1600 / 760, outputs: [{ width: 1600, height: 760, quality: 0.84 }, { width: 800, height: 380, quality: 0.8 }], suffixes: ['', '800'] }
const SQUARE = { aspect: 1, outputs: [{ width: 480, height: 480, quality: 0.82 }], suffixes: [''] }
const LOGO = { aspect: 495 / 840, outputs: [{ width: 495, height: 840, quality: 0.86 }], suffixes: [''] }

const tabs = [
  {
    key: 'sobre', label: 'Sobre nós', contentKey: 'about', defaults: aboutDefaults, previewUrl: '/sobre',
    intro: 'Página "Sobre nós" (/sobre).', info: 'O quadro "Como comprar" fica na aba ao lado.',
    schema: [
      { type: 'heading', label: 'Topo da página' },
      { key: 'heroEyebrow', label: 'Texto pequeno (acima do título)', type: 'text', max: 60 },
      { key: 'heroTitle', label: 'Título', type: 'textarea', rows: 2, required: true, max: 80, hint: TITLE_HINT },
      { key: 'heroText', label: 'Texto', type: 'textarea', rows: 4, max: 500 },
      { key: 'heroButton', label: 'Texto do botão (leva à loja)', type: 'text', max: 30 },
      { key: 'heroImage', label: 'Imagem ao lado do título', type: 'image', required: true, image: LOGO, hint: 'Em pé. Padrão: o logotipo completo.' },
      { type: 'heading', label: 'Nossa história' },
      { key: 'quote', label: 'Frase em destaque (citação)', type: 'textarea', rows: 2, max: 200 },
      { key: 'story', label: 'Parágrafos', type: 'list', min: 1, max: 5, itemLabel: 'Parágrafo', addLabel: 'Adicionar parágrafo', item: [
        { key: 'text', label: 'Texto', type: 'textarea', rows: 4, required: true, max: 600 },
      ] },
      { key: 'signature', label: 'Assinatura', type: 'text', max: 80 },
      { key: 'signatureName', label: 'Nome na assinatura (em destaque)', type: 'text', max: 30 },
      { type: 'heading', label: 'O que nos move', text: 'Os quadros com ícone.' },
      { key: 'values', label: 'Quadros', type: 'list', min: 0, max: 4, itemLabel: 'Quadro', addLabel: 'Adicionar quadro', columns: 3, item: [
        { key: 'icon', label: 'Ícone', type: 'icon' },
        { key: 'title', label: 'Título', type: 'text', required: true, max: 40 },
        { key: 'text', label: 'Texto', type: 'textarea', rows: 3, required: true, max: 200 },
      ] },
      { type: 'heading', label: 'Nossas coleções', text: 'Os cards grandes com foto.' },
      { key: 'lines', label: 'Cards', type: 'list', min: 0, max: 2, itemLabel: 'Card', addLabel: 'Adicionar card', columns: 2, item: [
        { key: 'image', label: 'Imagem', type: 'image', required: true, image: BANNER, hint: 'Paisagem. Texto à esquerda.' },
        { key: 'eyebrow', label: 'Texto pequeno', type: 'text', max: 40 },
        { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 60, hint: ENTER },
        { key: 'button', label: 'Texto do botão', type: 'text', max: 30 },
        { key: 'link', label: 'Para onde o card leva', type: 'link' },
      ] },
      { type: 'heading', label: 'Versículo' },
      { key: 'verse', label: 'Versículo (vazio = a faixa some)', type: 'textarea', rows: 2, max: 200, hint: ENTER },
      { key: 'verseRef', label: 'Referência', type: 'text', max: 40 },
      { type: 'heading', label: 'Comunidade (Instagram)' },
      { key: 'communityEyebrow', label: 'Texto pequeno', type: 'text', max: 60 },
      { key: 'communityTitle', label: 'Título', type: 'textarea', rows: 2, required: true, max: 80, hint: ENTER },
      { key: 'communityText', label: 'Texto', type: 'textarea', rows: 3, max: 300 },
      { key: 'instaPhotos', label: 'Fotos da vitrine do Instagram', type: 'list', min: 0, max: 4, itemLabel: 'Foto', addLabel: 'Adicionar foto', columns: 4, item: [
        { key: 'image', label: 'Foto', type: 'image', required: true, image: SQUARE },
      ] },
    ],
  },
  {
    key: 'como-comprar', label: 'Como comprar', contentKey: 'howto', defaults: howtoDefaults, previewUrl: '/sobre#como-comprar',
    intro: 'Quadro "Como comprar na Artes com Fé".', info: 'Fica na página Sobre. Os links "Como comprar" do rodapé levam até ele.',
    schema: [
      { key: 'eyebrow', label: 'Texto pequeno', type: 'text', max: 60 },
      { key: 'title', label: 'Título', type: 'text', required: true, max: 60 },
      { key: 'steps', label: 'Passos', type: 'list', min: 3, max: 3, itemLabel: 'Passo', columns: 3, item: [
        { key: 'icon', label: 'Ícone', type: 'icon' },
        { key: 'title', label: 'Título', type: 'text', required: true, max: 40 },
        { key: 'text', label: 'Texto', type: 'textarea', rows: 3, required: true, max: 200 },
      ] },
      { key: 'whatsappButton', label: 'Botão do WhatsApp', type: 'text', max: 40 },
      { key: 'shopButton', label: 'Botão da loja', type: 'text', max: 40 },
    ],
  },
  {
    key: 'catalogo', label: 'Catálogo', contentKey: 'catalog', defaults: catalogDefaults, previewUrl: '/produtos',
    intro: 'Topo do catálogo de produtos.', info: 'Vale para "Todos os produtos" e "Novidades". Cada categoria tem o próprio topo (Categorias → editar).',
    schema: [
      { key: 'eyebrow', label: 'Texto pequeno', type: 'text', max: 60 },
      { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 80, hint: ENTER },
      { key: 'text', label: 'Texto', type: 'textarea', rows: 3, max: 300 },
      { key: 'image', label: 'Foto do topo', type: 'image', required: true, image: BANNER },
      { key: 'shippingBadge', label: 'Selo de entrega', type: 'text', max: 40 },
      { key: 'whatsappBadge', label: 'Selo do WhatsApp', type: 'text', max: 40 },
      { type: 'heading', label: 'Topo da vitrine "Novidades"' },
      { key: 'newsEyebrow', label: 'Texto pequeno', type: 'text', max: 60 },
      { key: 'newsTitle', label: 'Título', type: 'textarea', rows: 2, required: true, max: 80, hint: ENTER },
      { key: 'newsText', label: 'Texto', type: 'textarea', rows: 3, max: 300 },
    ],
  },
  {
    key: 'ofertas', label: 'Ofertas', contentKey: 'promotions', defaults: promotionsDefaults, previewUrl: '/promocoes',
    intro: 'Página de ofertas (/promocoes).', info: 'Os produtos aparecem sozinhos quando têm "preço antigo" no cadastro.',
    schema: [
      { key: 'eyebrow', label: 'Texto pequeno', type: 'text', max: 60 },
      { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 80, hint: ENTER },
      { key: 'text', label: 'Texto', type: 'textarea', rows: 3, max: 300 },
      { key: 'image', label: 'Foto do topo', type: 'image', required: true, image: BANNER },
      { type: 'heading', label: 'Quando não há produtos em oferta' },
      { key: 'emptyTitle', label: 'Título', type: 'text', required: true, max: 60 },
      { key: 'emptyText', label: 'Texto', type: 'textarea', rows: 3, max: 300 },
      { key: 'notifyButton', label: 'Botão "quero ser avisado"', type: 'text', max: 40 },
      { key: 'notifyMessage', label: 'Mensagem que abre no WhatsApp', type: 'textarea', rows: 2, max: 200 },
      { key: 'suggestionsTitle', label: 'Título das sugestões no fim da página', type: 'text', max: 60, hint: 'Vazio = as sugestões somem.' },
    ],
  },
  {
    key: 'produto', label: 'Página do produto', contentKey: 'product', defaults: productPageDefaults, previewUrl: '/produtos',
    intro: 'Textos que se repetem em todos os produtos.', info: 'A descrição, as fotos e a ficha de cada produto ficam em Produtos.',
    schema: [
      { type: 'heading', label: 'Abas' },
      { key: 'tabAbout', label: 'Aba 1', type: 'text', required: true, max: 30 },
      { key: 'tabCare', label: 'Aba 2', type: 'text', required: true, max: 30 },
      { key: 'tabHow', label: 'Aba 3', type: 'text', required: true, max: 30 },
      { key: 'tabShipping', label: 'Aba 4', type: 'text', required: true, max: 30 },
      { type: 'heading', label: 'Medidas e cuidados' },
      { key: 'noMeasures', label: 'Quando o produto não tem medidas', type: 'textarea', rows: 2, required: true, max: 200 },
      { key: 'care', label: 'Cuidados', type: 'textarea', rows: 3, max: 300 },
      { key: 'howSteps', label: 'Como comprar (passos)', type: 'list', min: 1, max: 4, itemLabel: 'Passo', addLabel: 'Adicionar passo', hint: '*texto* = negrito.', item: [
        { key: 'text', label: 'Texto', type: 'text', required: true, max: 120 },
      ] },
      { type: 'heading', label: 'Envio' },
      { key: 'shipping', label: 'Texto', type: 'textarea', rows: 2, required: true, max: 200 },
      { key: 'shippingNote', label: 'Observação', type: 'textarea', rows: 2, max: 200 },
      { type: 'heading', label: 'Compra e indisponível' },
      { key: 'buyNote', label: 'Aviso na janela de compra', type: 'text', max: 120 },
      { key: 'soldOutText', label: 'Texto quando o produto está indisponível', type: 'textarea', rows: 3, required: true, max: 300 },
      { key: 'perks', label: 'Quadros abaixo do botão', type: 'list', min: 0, max: 3, itemLabel: 'Quadro', addLabel: 'Adicionar quadro', columns: 3, item: [
        { key: 'icon', label: 'Ícone', type: 'icon' },
        { key: 'title', label: 'Título', type: 'text', required: true, max: 30 },
        { key: 'text', label: 'Texto', type: 'text', max: 40 },
      ] },
    ],
  },
  {
    key: 'entrar', label: 'Entrar', contentKey: 'login', defaults: loginDefaults, previewUrl: '/entrar',
    intro: 'Lado esquerdo da tela de entrar e criar conta.',
    schema: [
      { key: 'eyebrow', label: 'Texto pequeno', type: 'text', max: 40 },
      { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 60, hint: TITLE_HINT },
    ],
  },
  {
    key: 'faixa', label: 'Faixa do topo', contentKey: 'announcement', defaults: announcementDefaults, previewUrl: '/',
    intro: 'Faixa de avisos acima do menu (passa de lado, sem parar).', info: 'Aparece em todas as páginas. Para quem prefere menos movimento no aparelho, ela fica parada.',
    schema: [
      { key: 'items', label: 'Avisos', type: 'list', min: 1, max: 5, itemLabel: 'Aviso', addLabel: 'Adicionar aviso', columns: 3,
        hint: '{parcelas} = número de parcelas das Configurações.', item: [
          { key: 'icon', label: 'Ícone', type: 'icon' },
          { key: 'text', label: 'Texto', type: 'text', required: true, max: 60 },
          { key: 'link', label: 'Link (opcional)', type: 'link', allowNone: true },
        ] },
    ],
  },
]

export default function PageTexts() {
  const [params, setParams] = useSearchParams()
  const confirm = useConfirm()
  const [dirty, setDirty] = useState(false)
  const current = tabs.find(t => t.key === params.get('aba')) || tabs[0]

  const open = async tab => {
    if (tab.key === current.key) return
    if (dirty && !(await confirm({ title: 'Trocar de aba sem salvar?', text: 'As alterações desta aba ainda não foram salvas e serão perdidas.', confirmLabel: 'Trocar sem salvar', cancelLabel: 'Continuar editando', danger: true }))) return
    setDirty(false)
    setParams({ aba: tab.key })
  }

  return (
    <>
      <nav className="adm-tabs" aria-label="Páginas">
        {tabs.map(tab => (
          <button key={tab.key} type="button" className={tab.key === current.key ? 'active' : ''} aria-current={tab.key === current.key ? 'page' : undefined} onClick={() => open(tab)}>{tab.label}</button>
        ))}
      </nav>
      <ContentEditor key={current.key} contentKey={current.contentKey} defaults={current.defaults} schema={current.schema}
        intro={current.intro} info={current.info} previewUrl={current.previewUrl} saveLabel="Salvar textos" onDirtyChange={setDirty} />
    </>
  )
}
