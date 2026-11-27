import React from 'react'
import ContentEditor from '../components/ContentEditor.jsx'
import { menuDefaults } from '../../Layout.jsx'

// Menu do site: nomes dos itens do menu do topo (os endereços não mudam). Salvo em site_content 'menu'.
const schema = [
  { type: 'heading', label: 'Itens do menu do topo', text: 'Muda o nome que aparece no menu (no computador e no celular). A Coleção aparece no menu quando ligada em Coleção.' },
  { key: 'inicio', label: 'Início (página inicial)', type: 'text', required: true, max: 24 },
  { key: 'produtos', label: 'Produtos (catálogo completo)', type: 'text', required: true, max: 24 },
  { key: 'menuCat1', label: 'Nossa Senhora (/produtos?categoria=nossa-senhora)', type: 'text', required: true, max: 24 },
  { key: 'menuCat2', label: 'Santos (/produtos?categoria=santos)', type: 'text', required: true, max: 24 },
  { key: 'promocoes', label: 'Ofertas (/promocoes)', type: 'text', required: true, max: 24 },
  { key: 'showPromos', label: 'Mostrar "Ofertas" no menu?', type: 'select', options: [{ value: 'false', label: 'Não (só no rodapé)' }, { value: 'true', label: 'Sim' }] },
  { key: 'sobre', label: 'Sobre nós', type: 'text', required: true, max: 24 },
]

export default function MenuNames() {
  return <ContentEditor contentKey="menu" defaults={{ ...menuDefaults, showPromos: 'false' }} schema={schema} previewUrl="/" saveLabel="Salvar menu"
    intro="Nomes das páginas no menu do topo do site." />
}
