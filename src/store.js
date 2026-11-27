// Configurações da loja — dados de contato e como as mensagens do WhatsApp são montadas.
// Editadas no painel (/painel-loja → Configurações e Logo e rodapé).
// As vendas são fechadas no WhatsApp: medidas, pagamento e entrega são combinados na conversa.
// Os valores abaixo são o padrão; os oficiais vêm da tabela public.store_settings no Supabase
// (src/data.js copia para cá assim que carrega — edite pelo painel do Supabase).

export const store = {
  name: 'Artes com Fé',
  // Número com DDI + DDD, só dígitos. Ex.: '5511999998888'.
  // Enquanto estiver vazio, o WhatsApp abre pedindo para o cliente escolher o contato.
  whatsapp: '5585999916534',
  instagram: 'https://www.instagram.com/artescomfe_/',
  instagramHandle: '@artescomfe_',
  installments: 2,
  // Painel → Logo e rodapé / Flutuantes (store_settings). Vazio = padrão do site.
  logo: null,
  logoFooter: null,
  social: [],
  footerText: null,
  spotlight: { enabled: false, ids: [] },
}

// Usa api.whatsapp.com direto: o atalho wa.me redireciona e, nesse redirecionamento,
// o WhatsApp corrompe os emojis (viram "�"). Indo direto, a mensagem chega intacta.
export const whatsappLink = text => {
  const params = new URLSearchParams()
  if (store.whatsapp) params.set('phone', store.whatsapp)
  params.set('text', text)
  return `https://api.whatsapp.com/send?${params.toString().replace(/\+/g, '%20')}`
}

const formatPrice = value => `R$ ${value.toFixed(2).replace('.', ',')}`

const SITE = 'artescomfe.com.br'
const productUrl = product => `${SITE}/produto/${product.slug}`
const phoneText = digits => {
  const d = String(digits || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  return d.length >= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : ''
}
const productDetails = product => [
  product.category && `• Categoria: ${product.category}`,
  product.finish && `• Acabamento: ${product.finish}`,
  product.dimensions && `• Medidas: ${product.dimensions}`,
].filter(Boolean)

export const productMessage = product => [
  'Olá, Artes com Fé! 🙏 Vi no site e me encantei por esta imagem:',
  '',
  `*${product.name}*`,
  ...productDetails(product),
  `• Valor: ${product.priceLabel}`,
  `🔗 ${productUrl(product)}`,
  '',
  'Pode me passar as medidas e a disponibilidade? ✨',
].join('\n')

// Mensagem de finalização da sacola (mesmo padrão da Maré).
// buyer = { name, email, phone } de quem está logado (campos vazios não aparecem).
export const bagMessage = (items, buyer = {}) => {
  const now = new Date()
  const when = `${now.toLocaleDateString('pt-BR')}, às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  const blocks = items.map(({ product, quantity }, i) => [
    `*${i + 1}) ${product.name}*`,
    ...productDetails(product),
    `• Quantidade: ${quantity}`,
    `• Valor: ${formatPrice(product.price * quantity)}${quantity > 1 ? ` (${product.priceLabel} cada)` : ''}`,
    `🔗 ${productUrl(product)}`,
  ].join('\n'))
  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  const count = items.reduce((sum, { quantity }) => sum + quantity, 0)
  const times = store.installments || 1
  const buyerLines = [
    buyer.name && `• Nome: ${buyer.name}`,
    buyer.email && `• E-mail: ${buyer.email}`,
    phoneText(buyer.phone) && `• WhatsApp: ${phoneText(buyer.phone)}`,
  ].filter(Boolean)
  return [
    'Olá, Artes com Fé! 🙏 Acabei de montar meu pedido pelo site:',
    '',
    '🛍️ *MEU PEDIDO*',
    `🗓️ ${when}`,
    '',
    blocks.join('\n\n'),
    '',
    '━━━━━━━━━━━━━━',
    `💰 *TOTAL: ${formatPrice(total)}* (${count} ${count === 1 ? 'item' : 'itens'})`,
    times > 1 && total > 0 ? `💳 Em até ${times}x de ${formatPrice(total / times)} sem juros` : null,
    '━━━━━━━━━━━━━━',
    ...(buyerLines.length ? ['', '👤 *MEUS DADOS*', ...buyerLines] : []),
    '',
    'Pode me ajudar com o pagamento e a entrega? ✨',
  ].filter(line => line !== null).join('\n')
}

export const restockMessage = product =>
  `Olá, Artes com Fé! 🙏 Vi que a imagem *${product.name}* está esgotada. Pode me avisar quando ela voltar? ✨`

export const helloMessage = 'Olá, Artes com Fé! 🙏 Vim pelo site e queria tirar uma dúvida.'
