import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { BASE } from '../sections.js'

// Guia do painel, escrito para a dona da loja (sem termos técnicos).

const go = (path, label) => <Link to={`${BASE}${path}`} className="adm-help-link">{label} <ArrowRight /></Link>

const topics = [
  {
    title: 'Primeiros passos',
    body: <>
      <p>Tudo o que você salva aqui aparece no site <b>na hora</b>. Se uma cliente já estiver com o site aberto, ela vê a novidade ao atualizar a página.</p>
      <ul>
        <li><b>Menu da esquerda:</b> leva a cada parte da loja. O botão ao lado do logo recolhe o menu, que vira uma faixa só com os ícones.</li>
        <li><b>Seu nome (canto de cima, à direita):</b> abre atalhos, <b>Alterar senha</b> e <b>Sair</b>.</li>
        <li><b>Ver loja:</b> abre o site em outra aba, para conferir como ficou.</li>
        <li>Nas telas com <b>Salvar</b>, nada muda no site antes de você clicar. Se tentar sair sem salvar, o painel avisa. <b>Desfazer</b> volta ao que estava salvo.</li>
        <li>Campos com <b>*</b> não podem ficar vazios. Nos outros, se você apagar o texto, aquele pedaço some do site.</li>
      </ul>
    </>,
  },
  {
    title: 'Cadastrar e editar produtos',
    body: <>
      <ol>
        <li>Abra <b>Produtos</b> e clique em <b>Novo produto</b> (ou no lápis de um produto para editar).</li>
        <li>Preencha nome, descrição e preço. <b>Preço antigo</b> maior que o preço coloca a peça em <b>Ofertas</b>.</li>
        <li>Escolha a <b>linha</b> (Imagens sacras, Quadros…) e a <b>devoção</b> (Nossa Senhora, Santos…): é por elas que a peça aparece no menu e nos filtros.</li>
        <li>Informe <b>acabamento</b>, material e medidas, e envie as <b>fotos</b> (a primeira é a capa).</li>
        <li><b>Novidade</b> coloca a peça na vitrine "Novidades" da página inicial.</li>
      </ol>
      <ul>
        <li><b>No site / Oculto</b>: esconde a peça sem apagar. <b>À venda / Indisponível</b>: mostra o selo "Indisponível".</li>
        <li>Arraste pela alça para mudar a ordem em que as peças aparecem no site.</li>
      </ul>
      {go('/produtos', 'Ir para Produtos')}
    </>,
  },
  {
    title: 'Categorias e atalhos da página inicial',
    body: <>
      <p><b>Devoções</b> (Nossa Senhora, Santos…) aparecem nos botões do catálogo, no filtro e nos atalhos redondos da página inicial. <b>Linhas</b> (Imagens sacras, Quadros…) dizem o tipo de produto.</p>
      <ul>
        <li>As setas mudam a ordem dos botões de categoria no catálogo.</li>
        <li>Ao editar uma categoria você troca a <b>foto e os textos do topo</b> da página dela e liga o <b>atalho redondo</b> na página inicial.</li>
        <li>Para esconder uma categoria sem apagar, desligue <b>Ativa</b>.</li>
      </ul>
      {go('/categorias', 'Ir para Categorias')}
    </>,
  },
  {
    title: 'Flutuantes',
    body: <>
      <p>Um card pequeno no canto do site que mostra até <b>5 produtos</b>, trocando sozinho. Esgotados e ocultos saem do card sozinhos.</p>
      {go('/flutuantes', 'Ir para Flutuantes')}
    </>,
  },
  {
    title: 'Página inicial, Coleção, Menu e Textos',
    body: <>
      <ul>
        <li><b>Página inicial:</b> banners do topo (com os cartões "Peça em destaque"), benefícios, títulos das vitrines, os dois banners do meio e o quadro "Por que comprar com a gente?".</li>
        <li><b>Coleção:</b> uma página especial (artescomfe.com.br/colecao) para Natal, Páscoa, Dia das Mães… Escolha nome, textos, foto e os produtos; ligue "Aparece no menu" quando quiser divulgar.</li>
        <li><b>Menu do site:</b> nomes dos itens do menu do topo.</li>
        <li><b>Textos das páginas:</b> Sobre nós, Como comprar, topo do Catálogo, Ofertas e a <b>faixa do topo</b> (que passa de lado).</li>
        <li><b>Logo e rodapé:</b> selo do topo, logo do rodapé, redes sociais, colunas de links, atendimento e a faixa da comunidade (newsletter).</li>
      </ul>
      {go('/pagina-inicial', 'Ir para Página inicial')}
    </>,
  },
  {
    title: 'Clientes, avaliações e newsletter',
    body: <>
      <ul>
        <li><b>Clientes</b>: contas criadas no site, com WhatsApp e favoritos. Dá para chamar no WhatsApp ou baixar a lista.</li>
        <li><b>Avaliações</b>: só aparecem no site depois que você aprovar.</li>
        <li><b>Newsletter</b>: e-mails cadastrados no rodapé do site.</li>
      </ul>
      {go('/clientes', 'Ir para Clientes')}
    </>,
  },
  {
    title: 'Configurações e administradores',
    body: <>
      <ul>
        <li>WhatsApp da loja, Instagram e número de parcelas sem juros.</li>
        <li>Na parte <b>Administração</b> você vê todas as contas e pode dar ou tirar o acesso ao painel.</li>
        <li>Para convidar alguém novo como admin, use o convite do Supabase (Authentication → Users → Invite user): a pessoa recebe o e-mail e já entra como admin.</li>
      </ul>
      {go('/configuracoes', 'Ir para Configurações')}
    </>,
  },
  {
    title: 'Dicas de fotos',
    body: <ul>
      <li>Fotos de produto ficam <b>em pé</b> (4 × 5), com a peça centralizada. Use boa luz e fundo limpo; o painel deixa as fotos leves sozinho.</li>
      <li>Pode enviar fotos do celular normalmente (até 25 MB). Para o logo, prefira PNG com fundo transparente.</li>
      <li>Ao trocar uma foto, a antiga é apagada sozinha do armazenamento.</li>
    </ul>,
  },
  {
    title: 'Se algo der errado',
    body: <ul>
      <li><b>"Sua sessão expirou"</b>: saia e entre de novo no painel.</li>
      <li><b>"Sem conexão"</b>: confira a internet e clique em salvar de novo. Nada é perdido enquanto a tela estiver aberta.</li>
      <li>Esqueceu a senha? Na tela de entrada do painel use <b>Esqueci minha senha</b>.</li>
      <li>O site não mudou? Atualize a página do site (F5 no computador; puxe para baixo no celular).</li>
    </ul>,
  },
]

export default function Help() {
  return (
    <>
      <div className="adm-help">
        {topics.map((t, i) => (
          <details key={t.title} className="adm-card" open={i === 0}>
            <summary><span>{t.title}</span><ChevronDown /></summary>
            <div className="adm-help-body">{t.body}</div>
          </details>
        ))}
      </div>
    </>
  )
}
