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

const installments = (price, times = 2) =>
  `${times}x de R$ ${(price / times).toFixed(2).replace('.', ',')}`

const installmentFields = product => {
  const times = product.installmentsTimes || store.installments || 1
  if (times <= 1) return { installments: null, installmentsNote: null }
  const value = product.installmentValue || product.price / times
  return { installments: `${times}x de R$ ${value.toFixed(2).replace('.', ',')}`, installmentsNote: product.installmentNote || 'sem juros' }
}

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
    photos: photos('09', 4),
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
  {
    id: '13',
    type: 'santo',
    name: 'São José com o Menino Jesus (Bronze)',
    finish: 'Bronze',
    swatch: BRONZE,
    price: 159.9,
    description: `O guardião da Sagrada Família. 🤎

São José segurando o Menino Jesus no colo, em acabamento bronze envelhecido que valoriza as dobras do manto e a ternura do abraço.

Uma imagem de proteção e cuidado, perfeita para o oratório da família.

São José, protegei o nosso lar. 🙏`,
    photos: photos('13', 3),
  },
  {
    id: '14',
    type: 'maria',
    name: 'Nossa Senhora das Dores (Pérolas)',
    finish: 'Azul e dourado',
    swatch: AZUL,
    price: 229.9,
    isNew: true,
    description: `A Mãe que acolhe cada dor do nosso coração. 💙

Nossa Senhora das Dores com manto azul cintilante bordado à mão com pérolas e strass, resplendor dourado e o coração transpassado pelas espadas.

Uma peça delicada e cheia de detalhes, que transforma o oratório num lugar de consolo e oração.

Mãe dolorosa, rogai por nós. ✨`,
    photos: photos('14', 4),
  },
  {
    id: '15',
    type: 'maria',
    name: 'Nossa Senhora de Guadalupe (Resplendor Dourado)',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 199.9,
    description: `A Mãe das Américas, envolta em luz. 🌹

Nossa Senhora de Guadalupe com vestido vermelho, manto verde e um resplendor dourado cravejado de strass, sobre nuvens com anjinhos.

Uma imagem vibrante, que enche a casa de alegria e proteção.

"Não estou eu aqui, que sou tua Mãe?" 💛`,
    photos: photos('15', 2),
  },
  {
    id: '16',
    type: 'maria',
    name: 'Nossa Senhora das Graças (Pérolas)',
    finish: 'Azul e dourado',
    swatch: AZUL,
    price: 219.9,
    description: `Graças derramadas sobre quem as pede com fé. 💗

Nossa Senhora com véu bordado em pérolas, manto azul cintilante e vestido em tom lilás, com o terço caindo entre as mãos e base trabalhada em dourado.

Uma peça romântica e delicada, linda no quarto, na sala ou no oratório.

Ó Maria concebida sem pecado, rogai por nós que recorremos a vós. 🙏`,
    photos: photos('16', 3),
  },
  {
    id: '17',
    type: 'jesus',
    name: 'Jesus em Oração',
    finish: 'Dourado',
    swatch: DOURADO,
    price: 179.9,
    description: `Um convite a parar e entregar tudo a Deus. ✝️

Jesus sentado em oração, de olhos fechados e mãos repousadas, com túnica dourada e manto vermelho.

Uma imagem serena, que traz paz para o ambiente e lembra a importância do silêncio e da oração.

"Vinde a mim, todos vós que estais cansados." 🙏`,
    photos: photos('17', 2),
  },
  {
    id: '18',
    type: 'maria',
    name: 'Nossa Senhora em Oração (Estilizada)',
    finish: 'Azul e dourado',
    swatch: AZUL,
    price: 149.9,
    description: `Elegância e fé em linhas suaves. 💙

Nossa Senhora em oração, em formato alongado e moderno, com manto azul-petróleo cintilante, detalhes dourados e base em cobre.

Uma peça diferente, que combina com ambientes contemporâneos sem perder a devoção.

Maria, Mãe de Deus, rogai por nós. ✨`,
    photos: photos('18', 3),
  },
  {
    id: '19',
    type: 'santo',
    name: 'São José com Lírio (Dourado)',
    finish: 'Dourado',
    swatch: DOURADO,
    price: 169.9,
    description: `O homem justo, puro como o lírio. 🤍

São José com o lírio nas mãos, símbolo da sua pureza, em acabamento dourado e tons terrosos que realçam o manto.

Uma imagem de fé e confiança, para pedir proteção ao trabalho e à família.

São José, rogai por nós. 🙏`,
    photos: photos('19', 2),
  },
  {
    id: '20',
    type: 'santo',
    name: 'São José Acalentando o Menino Jesus',
    finish: 'Rosé e dourado',
    swatch: 'linear-gradient(135deg,#f1cdb8 55%,#c9a24a 55%)',
    price: 189.9,
    description: `O colo de pai que acalma o coração. 🤎

São José sentado, acalentando o Menino Jesus nos braços, em acabamento rosé perolado com detalhes dourados.

Uma cena cheia de ternura, linda para quartos de bebê, para presentear novos pais ou para o oratório.

São José, guardai as nossas famílias. ✨`,
    photos: photos('20', 3),
  },
  {
    id: '21',
    type: 'maria',
    name: 'Nossa Senhora de Lourdes',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 169.9,
    description: `A Imaculada Conceição que apareceu em Lourdes. 🤍

Nossa Senhora de Lourdes com manto perolado, faixa azul, mãos postas e rosas aos pés, com contornos dourados.

Uma imagem suave e luminosa, sinal de cura, esperança e confiança.

Nossa Senhora de Lourdes, rogai por nós. 🙏`,
    photos: photos('21', 4),
  },
  {
    id: '22',
    type: 'jesus',
    name: 'Sagrado Coração de Jesus (Azul e Dourado)',
    finish: 'Azul e dourado',
    swatch: AZUL,
    price: 179.9,
    isNew: true,
    description: `Um coração que arde de amor por nós. ❤️

Sagrado Coração de Jesus com manto azul, túnica dourada e o coração em destaque, sobre base dourada.

Uma imagem tradicional, para consagrar a casa e a família ao amor de Cristo.

Sagrado Coração de Jesus, eu confio em vós. 🙏`,
    photos: photos('22', 4),
  },
  {
    id: '23',
    type: 'santo',
    name: 'São José com o Menino Jesus (Colorido)',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 199.9,
    description: `Pai, protetor e exemplo de fé. 🧡

São José segurando o Menino Jesus e o lírio, com manto em tons de cobre e ouro, túnica verde e base dourada, pintado à mão.

Uma imagem rica em cores, que vira o centro do oratório.

São José, protetor da Sagrada Família, rogai por nós. ✨`,
    photos: photos('23', 3),
  },
  {
    id: '24',
    type: 'familia',
    line: 'quadros',
    name: 'Quadro Sagrada Família em Relevo (Cobre)',
    finish: 'Cobre',
    swatch: COBRE,
    price: 149.9,
    description: `A Sagrada Família em destaque na sua casa. 🤎

Quadro oval com a Sagrada Família em relevo prateado, moldura trabalhada em cobre e cavalete para apoiar na mesa ou no oratório.

Um presente lindo para casamentos, bodas e casa nova.

Jesus, Maria e José, minha família vossa é. 🙏`,
    photos: photos('24', 2),
  },
  {
    id: '25',
    type: 'santo',
    name: 'São José Dormindo (Colorido)',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 159.9,
    description: `Deixe seus pedidos com quem sonha com Deus. 💤

São José Dormindo, a imagem querida em que colocamos bilhetinhos com os nossos pedidos, pintada à mão com manto vermelho e verde e auréola dourada.

Uma devoção cheia de confiança: São José descansa, mas não deixa de cuidar.

São José, cuidai dos meus pedidos. 🙏`,
    photos: photos('25', 2),
  },
  {
    id: '26',
    type: 'santo',
    name: 'São José Dormindo (Perolado)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 159.9,
    description: `A paz de quem confia em Deus. 🤍

São José Dormindo em acabamento perolado com detalhes dourados — a imagem dos pedidos guardados debaixo do travesseiro do santo.

Delicada e elegante, combina com qualquer ambiente.

São José, cuidai dos meus pedidos. 🙏`,
    photos: photos('26', 3),
  },
  {
    id: '27',
    type: 'jesus',
    name: 'Sagrado Coração de Jesus Abençoando',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 189.9,
    description: `A bênção de Cristo sobre o seu lar. ❤️

Sagrado Coração de Jesus com a mão erguida em bênção, manto vermelho cintilante, túnica dourada e base em tons de azul.

Uma imagem cheia de vida, para abençoar a casa e todos que nela moram.

Sagrado Coração de Jesus, abençoai a nossa família. 🙏`,
    photos: photos('27', 1),
  },
  {
    id: '28',
    type: 'jesus',
    line: 'quadros',
    name: 'Placa Sagrado Coração de Jesus (Cobre)',
    finish: 'Cobre',
    swatch: COBRE,
    price: 69.9,
    description: `Um pedacinho de fé que cabe na palma da mão. ✝️

Pequena placa do Sagrado Coração de Jesus em relevo, com acabamento cobre envelhecido e moldura trabalhada.

Ideal para a mesa de trabalho, a estante ou para presentear.

Sagrado Coração de Jesus, eu confio em vós. 🙏`,
    photos: photos('28', 1),
  },
  {
    id: '29',
    type: 'familia',
    line: 'quadros',
    name: 'Quadro Sagrada Família em Relevo (Envelhecido)',
    finish: 'Ouro velho',
    swatch: OURO_VELHO,
    price: 149.9,
    description: `Jesus, Maria e José, sempre presentes. 🤍

Quadro da Sagrada Família em relevo, com acabamento envelhecido em prata e dourado e moldura em formato de flor.

Um presente cheio de significado para casais e famílias.

Sagrada Família, protegei as nossas famílias. ✨`,
    photos: photos('29', 1),
  },
  {
    id: '30',
    type: 'jesus',
    name: 'Crucifixo de Parede',
    finish: 'Colorida',
    swatch: COLORIDA,
    price: 99.9,
    description: `O maior sinal de amor. ✝️

Crucifixo de parede com cruz em tom de madeira e detalhes dourados, e o Cristo pintado à mão.

Para abençoar a entrada da casa, o quarto ou o oratório.

Nós vos adoramos, Senhor Jesus Cristo, e vos bendizemos. 🙏`,
    photos: photos('30', 1),
  },
  {
    id: '31',
    type: 'maria',
    name: 'Nossa Senhora de Fátima Bordada (Pérolas)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 259.9,
    isNew: true,
    description: `Um manto inteiro de pérolas para a Mãe. 🤍

Nossa Senhora de Fátima com o manto todo bordado à mão em pérolas, coroa dourada e base em dourado trabalhado.

Uma peça artesanal e exclusiva, feita para ser o centro do oratório.

Rezai o terço todos os dias. ✨`,
    photos: photos('31', 2),
  },
  {
    id: '32',
    type: 'maria',
    name: 'Nossa Senhora de Fátima Bordada (Pérolas e Renda)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 259.9,
    description: `Delicadeza em cada ponto do bordado. 🤍

Nossa Senhora de Fátima com manto bordado em pérolas e renda branca, coroa dourada e base trabalhada em dourado.

Feita à mão, peça por peça — linda para presentear ou para o seu oratório.

O meu Imaculado Coração triunfará. ✨`,
    photos: photos('32', 2),
  },
  {
    id: '33',
    type: 'maria',
    name: 'Nossa Senhora de Fátima Bordada (Renda Floral)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 259.9,
    description: `Flores bordadas para a Rainha do Céu. 🌸

Nossa Senhora de Fátima com manto em renda floral branca e pérolas, coroa dourada e base em dourado trabalhado.

Uma peça artesanal, romântica e cheia de detalhes.

Nossa Senhora de Fátima, rogai por nós. 🙏`,
    photos: photos('33', 2),
  },
  {
    id: '34',
    type: 'maria',
    name: 'Nossa Senhora de Fátima Bordada (Dourado)',
    finish: 'Marfim e dourado',
    swatch: MARFIM,
    price: 269.9,
    description: `Pérolas e fios de ouro para a Mãe de Deus. 💛

Nossa Senhora de Fátima com manto bordado em pérolas e arabescos dourados, coroa dourada e base trabalhada.

Uma peça artesanal sofisticada, para quem quer uma imagem única.

Rezai o terço todos os dias. ✨`,
    photos: photos('34', 2),
  },
  {
    id: '35',
    type: 'maria',
    name: 'Nossa Senhora de Fátima Bordada (Flores Lilás)',
    finish: 'Branco perolado',
    swatch: PEROLA,
    price: 259.9,
    description: `Um jardim de flores no manto de Maria. 💜

Nossa Senhora de Fátima com manto de pérolas e flores bordadas em lilás, coroa dourada e base trabalhada em dourado.

Delicada e diferente, um presente cheio de carinho.

Nossa Senhora de Fátima, rogai por nós. 🙏`,
    photos: photos('35', 2),
  },
  {
    id: '36',
    type: 'maria',
    name: 'Nossa Senhora de Fátima (Branco e Dourado)',
    finish: 'Marfim e dourado',
    swatch: MARFIM,
    price: 219.9,
    isNew: true,
    description: `Pureza e luz para o seu oratório. 🤍

Nossa Senhora de Fátima em branco com detalhes dourados no manto, terço entre as mãos, coroa e base em dourado trabalhado.

Uma imagem clássica e elegante, que ilumina qualquer ambiente.

O meu Imaculado Coração triunfará. ✨`,
    photos: photos('36', 1),
  },
]

const slugify = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// ---------- Categorias usadas no menu, nos chips e nos filtros ----------
export const typeLabels = { maria: 'Nossa Senhora', santo: 'Santos', jesus: 'Jesus Cristo', familia: 'Sagrada Família' }
export const typeKeys = { maria: 'nossa-senhora', santo: 'santos', jesus: 'jesus-cristo', familia: 'sagrada-familia' }
export const lineLabels = { imagens: 'Imagens sacras', tercos: 'Terços', quadros: 'Quadros', presentes: 'Presentes' }

// ---------- Categorias (painel → Categorias; tabela public.categories) ----------
// Padrão = o mesmo que está no banco; o site usa este até o Supabase responder (ou se ele cair).
// kind 'tipo' = devoção (menu, chips e filtro); kind 'colecao' = linha da loja (Imagens sacras, Quadros…).
const DEFAULT_CATEGORIES = [
  { slug: 'imagens-sacras', name: 'Imagens sacras', kind: 'colecao', sort_order: 10 },
  { slug: 'quadros', name: 'Quadros e placas', kind: 'colecao', sort_order: 20, banner_image: '/img/banners/presentes-de-fe.webp', banner_eyebrow: 'Quadros e placas', banner_title: 'A fé em destaque\nna sua parede.', banner_text: 'Quadros e placas em relevo para abençoar a casa, o escritório ou presentear.' },
  { slug: 'tercos', name: 'Terços', kind: 'colecao', sort_order: 30 },
  { slug: 'presentes', name: 'Presentes', kind: 'colecao', sort_order: 40 },
  { slug: 'nossa-senhora', name: 'Nossa Senhora', kind: 'tipo', sort_order: 50, home_card: true, home_card_order: 1, home_image: '/img/produtos/06-02-480.webp', banner_image: '/img/banners/colecao-nossa-senhora.webp', banner_eyebrow: 'Coleção Nossa Senhora', banner_title: 'Maria, Mãe\ne Rainha do lar.', banner_text: 'Diversas representações de Nossa Senhora para a sua devoção — Aparecida, Fátima, Guadalupe e muito mais.' },
  { slug: 'santos', name: 'Santos', kind: 'tipo', sort_order: 60, home_card: true, home_card_order: 2, home_image: '/img/produtos/03-02-480.webp', banner_image: '/img/banners/santos.webp', banner_eyebrow: 'Santos', banner_title: 'Amigos de Deus,\nexemplos de fé.', banner_text: 'Imagens dos santos que intercedem por nós, com acabamentos ricos em detalhes.' },
  { slug: 'jesus-cristo', name: 'Jesus Cristo', kind: 'tipo', sort_order: 70, home_card: true, home_card_order: 4, home_image: '/img/produtos/07-02-480.webp', banner_image: '/img/banners/jesus-cristo.webp', banner_eyebrow: 'Jesus Cristo', banner_title: 'O Caminho,\na Verdade e a Vida.', banner_text: 'Imagens para meditar a vida e a Paixão de Cristo e renovar a fé todos os dias.' },
  { slug: 'sagrada-familia', name: 'Sagrada Família', kind: 'tipo', sort_order: 80, home_card: true, home_card_order: 3, home_image: '/img/produtos/08-02-480.webp', banner_image: '/img/banners/sagrada-familia.webp', banner_eyebrow: 'Sagrada Família', banner_title: 'Jesus, Maria\ne José.', banner_text: 'A família de Nazaré para abençoar o seu lar — linda o ano inteiro e especial no Natal.' },
].map(c => ({ active: true, home_card: false, home_card_order: 0, ...c }))

export const categories = [...DEFAULT_CATEGORIES]
export const categoryBySlug = slug => categories.find(c => c.slug === slug)

// Catálogo local (sem banco): categorias a partir do tipo e da linha antigos.
const LINE_SLUG = { imagens: 'imagens-sacras', quadros: 'quadros', tercos: 'tercos', presentes: 'presentes' }
const localSlugs = product => [LINE_SLUG[product.line || 'imagens'], typeKeys[product.type]].filter(Boolean)

// Completa os campos calculados (slug, preços formatados, miniaturas…).
// Serve tanto para o catálogo local acima quanto para o que vem do Supabase (src/data.js).
const enrich = product => ({
  line: 'imagens',
  ...product,
  category: product.category || typeLabels[product.type],
  categorySlugs: product.categorySlugs || localSlugs(product),
  slug: product.slug || slugify(product.name),
  oldPriceLabel: product.oldPrice ? formatPrice(product.oldPrice) : null,
  available: product.available !== false,
  thumbs: product.thumbs || product.photos.map(thumbOf),
  photoStyle: product.photoAlign === 'bottom' ? { objectPosition: 'center bottom' } : undefined,
  priceLabel: formatPrice(product.price),
  // Parcelamento: o do produto (painel → editor) ou o padrão da loja (Configurações). 1x = só à vista.
  ...installmentFields(product),
})

// disponíveis primeiro, esgotadas no fim (mantendo a ordem do catálogo)
const availableFirst = list => list.sort((a, b) => Number(b.available) - Number(a.available))

// Lista viva: setProducts() troca o conteúdo sem trocar o array, então todo o site enxerga a versão nova.
export const products = availableFirst(catalog.map(enrich))

export function setProducts(list) {
  if (!list?.length) return
  products.splice(0, products.length, ...availableFirst(list.map(enrich)))
}

// Botões de categoria do catálogo: Todos + devoções + linhas (menos "Imagens sacras", que é quase tudo)
// + Novidades. Ordem = a do painel → Categorias. A lista é viva: muda quando as categorias chegam do banco.
export const collections = []
const buildCollections = () => {
  const sorted = categories.filter(c => c.active).sort((a, b) => a.sort_order - b.sort_order)
  const pick = kind => sorted.filter(c => c.kind === kind && c.slug !== 'imagens-sacras')
  collections.splice(0, collections.length,
    { key: 'todos', label: 'Todos os produtos', test: () => true },
    ...[...pick('tipo'), ...pick('colecao')].map(c => ({ key: c.slug, label: c.name, category: c, test: p => p.categorySlugs.includes(c.slug) })),
    { key: 'novidades', label: 'Novidades', test: p => p.isNew },
  )
}
buildCollections()

export function setCategories(list) {
  if (!list?.length) return
  categories.splice(0, categories.length, ...list)
  buildCollections()
}

// Card flutuante (painel → Flutuantes): até 5 produtos, na ordem escolhida; esgotados ficam de fora.
export const spotlightProducts = () => store.spotlight?.enabled
  ? (store.spotlight.ids || []).map(id => products.find(p => p.uuid === id || p.id === id)).filter(p => p?.available).slice(0, 5)
  : []

// Endereços antigos (produto renomeado no painel) continuam abrindo o produto.
export const findProduct = slug => products.find(product => product.slug === slug) || products.find(product => product.oldSlugs?.includes(slug))
