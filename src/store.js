// Configurações da loja — dados de contato e como as mensagens do WhatsApp são montadas.
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

export const productMessage = product =>
  `Olá, Artes com Fé! 🙏 Vi no site e me encantei por esta imagem:\n\n` +
  `*${product.name}* — ${product.priceLabel}\n\n` +
  `Pode me passar as medidas e a disponibilidade? ✨`

// Mensagem de finalização da sacola.
export const bagMessage = items => {
  const lines = items.map(({ product, quantity }) =>
    `${quantity > 1 ? `${quantity}x ` : ''}*${product.name}* — ${formatPrice(product.price * quantity)}`)
  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  return `Olá, Artes com Fé! ✨\nMontei meu pedido no site:\n\n` +
    `--------\n${lines.join('\n')}\nTotal: *${formatPrice(total)}*\n\n` +
    `🙏 Pode me ajudar com a finalização e a entrega?`
}

export const restockMessage = product =>
  `Olá, Artes com Fé! 🙏 Vi que a imagem *${product.name}* está esgotada. Pode me avisar quando ela voltar? ✨`

export const helloMessage = 'Olá, Artes com Fé! 🙏 Vim pelo site e queria tirar uma dúvida.'
