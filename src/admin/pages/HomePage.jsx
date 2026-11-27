import React from 'react'
import ContentEditor from '../components/ContentEditor.jsx'
import { homeDefaults } from '../../pages/Home.jsx'

// Página inicial: banners do topo (rotativo), benefícios, títulos das vitrines, os dois banners
// do meio e o quadro "Por que comprar com a gente?". Salvo em site_content 'home'.
// Os atalhos redondos de categoria são editados em Categorias (foto e "mostrar na página inicial").

const ENTER = 'Enter = quebra de linha.'
const HERO = { aspect: 3 / 1, outputs: [{ width: 2400, height: 800, quality: 0.84 }, { width: 1200, height: 400, quality: 0.8 }], suffixes: ['', '1200'] }
const BANNER = { aspect: 1600 / 760, outputs: [{ width: 1600, height: 760, quality: 0.84 }, { width: 800, height: 380, quality: 0.8 }], suffixes: ['', '800'] }

const schema = [
  { type: 'heading', label: 'Banners do topo', text: 'Passam sozinhos a cada 7 segundos. Com mais de um, aparecem as setas e as bolinhas.' },
  { key: 'heroSlides', label: 'Banners', type: 'list', min: 1, max: 5, itemLabel: 'Banner', addLabel: 'Adicionar banner', item: [
    { key: 'image', label: 'Foto', type: 'image', required: true, image: HERO, hint: 'Bem largo (3 × 1). Texto à esquerda.' },
    { key: 'alt', label: 'Descrição da foto (para leitores de tela)', type: 'text', max: 140 },
    { key: 'eyebrow', label: 'Texto pequeno (acima do título)', type: 'text', max: 60 },
    { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 60, hint: ENTER },
    { key: 'text', label: 'Texto', type: 'textarea', rows: 3, max: 220 },
    { key: 'button', label: 'Texto do botão', type: 'text', max: 30, hint: 'Vazio = sem botão.' },
    { key: 'link', label: 'Para onde o botão leva', type: 'link' },
    { key: 'features', label: 'Cartões "Peça em destaque" (códigos dos produtos)', type: 'text', max: 20, placeholder: '08, 11',
      hint: 'Até 2 códigos de produto (ex.: 08, 11). Vazio = sem cartões.' },
  ] },
  { key: 'heroBenefits', label: 'Benefícios (abaixo do botão)', type: 'list', min: 0, max: 4, itemLabel: 'Benefício', addLabel: 'Adicionar benefício', columns: 3, item: [
    { key: 'icon', label: 'Ícone', type: 'icon' },
    { key: 'text', label: 'Texto', type: 'textarea', rows: 2, required: true, max: 40, hint: ENTER },
  ] },
  { key: 'featureLabel', label: 'Etiqueta dos cartões de destaque', type: 'text', max: 30 },
  { type: 'heading', label: 'Atalhos de categoria', text: 'As bolinhas abaixo do banner. As categorias, as fotos e a ordem ficam em Categorias.' },
  { key: 'categoriesAll', label: 'Nome do atalho "Todas"', type: 'text', required: true, max: 20 },
  { key: 'categoriesNew', label: 'Nome do atalho "Novidades"', type: 'text', max: 20, hint: 'Vazio = o atalho some.' },
  { type: 'heading', label: 'Vitrines', text: '"Mais vendidos" segue a ordem da lista de Produtos. "Novidades" mostra os produtos marcados como Novidade.' },
  { key: 'bestTitle', label: 'Título da primeira vitrine', type: 'text', required: true, max: 40 },
  { key: 'newsTitle', label: 'Título da vitrine de novidades', type: 'text', required: true, max: 40 },
  { type: 'heading', label: 'Banners do meio', text: 'Os dois cards grandes entre as vitrines.' },
  { key: 'banners', label: 'Cards', type: 'list', min: 2, max: 2, itemLabel: 'Card', columns: 2, item: [
    { key: 'image', label: 'Foto', type: 'image', required: true, image: BANNER, hint: 'Paisagem. Texto à esquerda.' },
    { key: 'title', label: 'Título', type: 'textarea', rows: 2, required: true, max: 50, hint: ENTER },
    { key: 'text', label: 'Texto', type: 'textarea', rows: 2, max: 140 },
    { key: 'button', label: 'Texto do botão', type: 'text', max: 30 },
    { key: 'link', label: 'Para onde o card leva', type: 'link' },
  ] },
  { type: 'heading', label: 'Por que comprar com a gente?', text: 'Quadro no fim da página. Use {parcelas} para o número de parcelas das Configurações.' },
  { key: 'reasonsTitle', label: 'Título', type: 'text', max: 50 },
  { key: 'reasons', label: 'Motivos', type: 'list', min: 0, max: 6, itemLabel: 'Motivo', addLabel: 'Adicionar motivo', columns: 3, item: [
    { key: 'icon', label: 'Ícone', type: 'icon' },
    { key: 'title', label: 'Título', type: 'text', required: true, max: 40 },
    { key: 'text', label: 'Texto', type: 'text', max: 50 },
  ] },
]

export default function HomePage() {
  return <ContentEditor contentKey="home" defaults={homeDefaults} schema={schema} previewUrl="/" folder="banners" saveLabel="Salvar página inicial"
    intro="Textos e imagens da página inicial." info="Os produtos das vitrines vêm de Produtos (ordem e selo Novidade)." />
}
