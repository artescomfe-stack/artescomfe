import { store } from './store.js'

// Catálogo inicial da Artes com Fé — usado quando o Supabase está fora do ar e como base do seed do banco.
// A fonte oficial é a tabela public.products no Supabase (edite por lá).
// As fotos ficam em /public/img/produtos/ (geradas a partir de Assets/Produtos/#{id}):
//   {id}-{nº}.webp      → 1000px, usada na página do produto
//   {id}-{nº}-480.webp  → 480px, usada nos cards
// ATENÇÃO: preços, medidas e material abaixo são provisórios — confirmar com a loja antes de publicar.
// Peça esgotada: adicione `available: false` — ela continua no site com selo "Esgotado" e não pode ser comprada.
// Promoção: adicione `oldPrice: 199.9` (preço antigo) — a peça aparece riscada e entra na página Promoções.
// Novidade: `isNew: true` coloca a peça na vitrine "Novidades da Loja" da página inicial.
// type: maria (Nossa Senhora) | santo | jesus | familia (Sagrada Família)
// line: imagens | tercos | quadros | presentes  (linhas da loja; hoje só imagens sacras)
// finish = acabamento (filtro do catálogo); swatch = cor/gradiente da bolinha do filtro.
// photoAlign: 'bottom' → as fotos são enquadradas pela margem inferior (não cortam a base da imagem).

const photos = (id, count) =>
  Array.from({ length: count }, (_, i) => `/img/produtos/${id}-${String(i + 1).padStart(2, '0')}.webp`)

const thumbOf = photo => photo.replace(/\.webp$/, '-480.webp')

const installments = (price, times = 6) =>
  `${times}x de R$ ${(price / times).toFixed(2).replace('.', ',')}`

const formatPrice = price => `R$ ${price.toFixed(2).replace('.', ',')}`

const BRONZE = 'linear-gradient(135deg,#6b4a2b,#a57a4c)'
const OURO_VELHO = 'linear-gradient(135deg,#5c4422,#b08d4f)'
const COBRE = 'linear-gradient(135deg,#7a3f22,#c27a4b)'
const DOURADO = 'linear-gradient(135deg,#a8842f,#e6c56a)'
const PEROLA = 'linear-gradient(135deg,#f7f2ea,#d9c9a8)'
const MARFIM = 'linear-gradient(135deg,#efe6d2 55%,#c9a24a 55%)'
const AZUL = 'linear-gradient(135deg,#a9c6dd 55%,#c9a24a 55%)'
const COLORIDA = 'conic-gradient(#b32c35 0 33%,#2f6b4f 0 66%,#d8b14a 0)'

const catalog = [
  {
    id: '01',
    type: 'santo',
    name: 'São Padre Pio',
    finish: 'Bronze',
    swatch: BRONZE,
    price: 159.9,
    description: `Fé, oração e confiança em Deus. 🙏

São Padre Pio de Pietrelcina, com o hábito capuchinho e a mão erguida em bênção. O acabamento em bronze envelhecido realça cada dobra do hábito e o terço preso à cintura.

Uma presença serena para o seu oratório, que lembra todos os dias: "Reze, espere e não se preocupe."

Leve para casa a sua e deixe a fé morar em cada detalhe. ✨`,
    photos: photos('01', 3),
  },
  {
    id: '02',
    type: 'maria',
    name: 'Nossa Senhora Aparecida',
    finish: 'Ouro velho',
    swatch: OURO_VELHO,
    price: 169.9,
    isNew: true,
    description: `A Padroeira do Brasil, com toda a beleza que ela merece. 💛

Imagem de Nossa Senhora Aparecida com manto ricamente trabalhado em relevo, coroa e acabamento ouro velho. As mãos postas e o semblante sereno trazem paz para qualquer ambiente.

Perfeita para o oratório, para a sala ou para presentear quem é devoto da Mãe Aparecida.

Que ela cubra o seu lar com o seu manto. 🙏`,
    photos: photos('02', 3),
  },
  {
    id: '03',
    type: 'santo',
    name: 'São Miguel Arcanjo',
    finish: 'Cobre',
    swatch: COBRE,
    price: 169.9,
    isNew: true,
    description: `O príncipe da milícia celeste, defensor nas batalhas. ⚔️

São Miguel Arcanjo com espada erguida e asas abertas, em acabamento cobre envelhecido que valoriza os detalhes da armadura e do manto.

Uma imagem forte e cheia de movimento, para quem busca proteção e coragem na caminhada da fé.

São Miguel Arcanjo, defendei-nos no combate. 🙏`,
    photos: photos('03', 2),
  },
  {
    id: '04',
    type: 'maria',
    name: 'Nossa Senhora de Fátima (Pérolas)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 179.9,
    isNew: true,
    description: `Delicadeza e devoção em cada pérola. 🤍

Nossa Senhora de Fátima em branco perolado, com manto bordado de pérolas e strass, detalhes dourados e o terço entre as mãos. Uma peça que ilumina o ambiente.

Linda no oratório, na cabeceira ou como presente para uma pessoa especial.

Rezai o terço todos os dias. ✨`,
    photos: photos('04', 3),
  },
  {
    id: '05',
    type: 'santo',
    name: 'Santa Teresinha do Menino Jesus',
    finish: 'Marfim e dourado',
    swatch: MARFIM,
    price: 149.9,
    description: `A santa das rosas e do pequeno caminho. 🌹

Santa Teresinha do Menino Jesus segurando o crucifixo e um buquê de rosas vermelhas, com hábito em marfim e acabamento dourado.

Uma imagem doce e cheia de significado, que lembra que o amor está nas pequenas coisas.

"Quero passar o meu céu fazendo o bem sobre a terra." 🙏`,
    photos: photos('05', 2),
  },
  {
    id: '06',
    type: 'maria',
    name: 'Nossa Senhora de Guadalupe',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 159.9,
    description: `A Mãe das Américas, cheia de cor e ternura. 🌹

Nossa Senhora de Guadalupe com o manto verde estrelado, vestido vermelho e o resplendor dourado ao redor, pintada à mão com riqueza de detalhes.

Uma imagem vibrante, que traz alegria e proteção para o seu lar.

"Não estou eu aqui, que sou tua Mãe?" 💛`,
    photos: photos('06', 2),
  },
  {
    id: '07',
    type: 'jesus',
    name: 'Senhor dos Passos',
    finish: 'Cobre',
    swatch: COBRE,
    price: 189.9,
    description: `O amor que carrega a cruz por nós. ✝️

Imagem do Senhor dos Passos, Jesus carregando a cruz a caminho do Calvário, com coroa de espinhos e acabamento cobre que realça a expressão e o movimento da cena.

Uma peça marcante para meditar a Paixão de Cristo e renovar a fé.

Por Sua dolorosa Paixão, tende misericórdia de nós. 🙏`,
    photos: photos('07', 2),
  },
  {
    id: '08',
    type: 'familia',
    name: 'Sagrada Família',
    finish: 'Marfim e dourado',
    swatch: MARFIM,
    price: 189.9,
    isNew: true,
    description: `Jesus, Maria e José, a família que inspira a sua. 🤍

A Sagrada Família em acabamento marfim com detalhes dourados: São José, Nossa Senhora em oração e o Menino Jesus na manjedoura.

Linda o ano inteiro e especial no Natal — um presente perfeito para abençoar um novo lar.

Sagrada Família, protegei as nossas famílias. ✨`,
    photos: photos('08', 2),
  },
  {
    id: '09',
    type: 'santo',
    name: 'São Jorge',
    finish: 'Dourado',
    swatch: DOURADO,
    price: 199.9,
    description: `O santo guerreiro, firme na fé. 🐎

São Jorge montado em seu cavalo, vencendo o dragão, em acabamento dourado que destaca a armadura, a capa e cada detalhe da cena.

Uma imagem imponente para quem pede força, proteção e coragem no dia a dia.

Salve Jorge! 🙏`,
    photos: photos('09', 2),
  },
  {
    id: '10',
    type: 'maria',
    name: 'Nossa Senhora de Fátima (Azul e Dourado)',
    finish: 'Azul e dourado',
    swatch: AZUL,
    price: 189.9,
    description: `Um céu de ternura para o seu oratório. 💙

Nossa Senhora de Fátima com vestido azul-claro, manto dourado cravejado de strass, mãos em oração e base dourada trabalhada sobre as nuvens.

Uma peça de acabamento sofisticado, daquelas que viram o centro do ambiente.

O meu Imaculado Coração triunfará. ✨`,
    photos: photos('10', 3),
  },
  {
    id: '11',
    type: 'familia',
    name: 'Sagrada Família (Cobre)',
    finish: 'Cobre',
    swatch: COBRE,
    price: 179.9,
    description: `O aconchego do lar de Nazaré. 🤎

Sagrada Família em acabamento cobre: Maria e José juntinhos, envolvendo o Menino Jesus com carinho. Uma cena delicada, cheia de afeto.

Ideal para a sala, para o oratório ou para presentear um casal que está começando uma família.

Onde há amor, Deus está. 🙏`,
    photos: photos('11', 2),
  },
  {
    id: '12',
    type: 'maria',
    name: 'Pietà — Nossa Senhora da Piedade',
    finish: 'Dourado',
    swatch: DOURADO,
    price: 219.9,
    description: `O amor de Mãe aos pés da cruz. 💛

A Pietà, Nossa Senhora da Piedade com Jesus nos braços, em acabamento dourado sobre base escura. Uma cena de profunda emoção e beleza.

Uma peça de arte sacra para contemplar, rezar e lembrar que a dor também é caminho de redenção.

Mãe dolorosa, rogai por nós. 🙏`,
    photos: photos('12', 2),
  },
]

const slugify = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// ---------- Categorias usadas no menu, nos chips e nos filtros ----------
export const typeLabels = { maria: 'Nossa Senhora', santo: 'Santos', jesus: 'Jesus Cristo', familia: 'Sagrada Família' }
export const typeKeys = { maria: 'nossa-senhora', santo: 'santos', jesus: 'jesus-cristo', familia: 'sagrada-familia' }
export const lineLabels = { imagens: 'Imagens sacras', tercos: 'Terços', quadros: 'Quadros', presentes: 'Presentes' }

// Completa os campos calculados (slug, preços formatados, miniaturas…).
// Serve tanto para o catálogo local acima quanto para o que vem do Supabase (src/data.js).
const enrich = product => ({
  line: 'imagens',
  ...product,
  category: product.category || typeLabels[product.type],
  slug: product.slug || slugify(product.name),
  oldPriceLabel: product.oldPrice ? formatPrice(product.oldPrice) : null,
  available: product.available !== false,
  thumbs: product.thumbs || product.photos.map(thumbOf),
  photoStyle: product.photoAlign === 'bottom' ? { objectPosition: 'center bottom' } : undefined,
  priceLabel: formatPrice(product.price),
  installments: installments(product.price, store.installments),
})

// disponíveis primeiro, esgotadas no fim (mantendo a ordem do catálogo)
const availableFirst = list => list.sort((a, b) => Number(b.available) - Number(a.available))

// Lista viva: setProducts() troca o conteúdo sem trocar o array, então todo o site enxerga a versão nova.
export const products = availableFirst(catalog.map(enrich))

export function setProducts(list) {
  if (!list?.length) return
  products.splice(0, products.length, ...availableFirst(list.map(enrich)))
}

export const collections = [
  { key: 'todos', label: 'Todas as imagens', test: () => true },
  { key: 'nossa-senhora', label: 'Nossa Senhora', test: p => p.type === 'maria' },
  { key: 'santos', label: 'Santos', test: p => p.type === 'santo' },
  { key: 'jesus-cristo', label: 'Jesus Cristo', test: p => p.type === 'jesus' },
  { key: 'sagrada-familia', label: 'Sagrada Família', test: p => p.type === 'familia' },
  { key: 'novidades', label: 'Novidades', test: p => p.isNew },
]

export const findProduct = slug => products.find(product => product.slug === slug)
