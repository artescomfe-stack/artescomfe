// Gera os modelos de e-mail de conta da Artes com Fé (Supabase Auth).
// Mesmo esqueleto dos e-mails da Maré, com as cores, o logo e o tom da Artes com Fé.
// Uso: node supabase/email-templates/gerar.mjs  → cria os .html nesta pasta.
// Depois, os .html são aplicados no Supabase (Auth → Email Templates) por aplicar.mjs.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = 'https://artescomfe.com.br'
const INSTAGRAM = 'https://www.instagram.com/artescomfe_/'
const C = {
  page: '#fbf7f0', card: '#ffffff', header: '#f3eadc', ink: '#3b2616', text: '#6b5644',
  soft: '#8a7564', button: '#4a2c17', gold: '#c9a24a', line: '#e2d2bb', note: '#f7f0e5',
}
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const SANS = 'Arial, Helvetica, sans-serif'

const button = (url, label) => `
  <!-- Botão (bulletproof) -->
  <tr>
    <td align="center" class="stack-padding" style="padding:0 40px 32px 40px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" bgcolor="${C.button}" style="border-radius:10px; background-color:${C.button};">
            <a href="${url}" target="_blank" style="display:inline-block; padding:15px 36px; font-family:${SANS}; font-size:14px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#ffffff; text-decoration:none; border-radius:10px;">${label}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
// Sem link em texto embaixo do botão (mesmo padrão da Maré): os e-mails mostram só botões.

const code = token => `
  <!-- Código -->
  <tr>
    <td align="center" class="stack-padding" style="padding:0 40px 32px 40px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" bgcolor="${C.note}" style="background-color:${C.note}; border:1px solid ${C.line}; border-radius:12px; padding:18px 36px; font-family:${SANS}; font-size:30px; font-weight:700; letter-spacing:8px; color:${C.ink};">${token}</td>
        </tr>
      </table>
    </td>
  </tr>`

const note = html => `
  <tr>
    <td class="stack-padding" style="padding:0 40px 32px 40px; font-family:${SANS};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="${C.note}" style="background-color:${C.note}; border-left:3px solid ${C.gold}; border-radius:10px; padding:14px 18px; font-size:13px; line-height:1.6; color:${C.text};">${html}</td>
        </tr>
      </table>
    </td>
  </tr>`

const layout = ({ title, preheader, heading, body, extra = '', footnote }) => `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${title} — Artes com Fé</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  @media only screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .stack-padding { padding-left: 24px !important; padding-right: 24px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:${C.page}; -webkit-text-size-adjust:100%; text-size-adjust:100%;">
<span style="display:none; font-size:1px; color:${C.page}; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
  ${preheader}
</span>
<center style="width:100%; background-color:${C.page}; padding:24px 0;">
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" align="center"><tr><td>
<![endif]-->
<table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" align="center" style="width:100%; max-width:600px; margin:0 auto; background-color:${C.card}; border:1px solid ${C.line}; border-radius:16px; overflow:hidden;">
  <!-- Cabeçalho -->
  <tr>
    <td align="center" bgcolor="${C.header}" style="background-color:${C.header}; padding:28px 24px; border-bottom:2px solid ${C.gold};">
      <a href="${SITE}" target="_blank" style="text-decoration:none;">
        <img src="${SITE}/img/logo/logo-email.png" width="96" alt="Artes com Fé — Arte sacra" style="display:block; border:0; outline:none; text-decoration:none; height:auto; max-width:96px; margin:0 auto;">
      </a>
    </td>
  </tr>

  <!-- Corpo -->
  <tr>
    <td class="stack-padding" style="padding:40px 40px 24px 40px; font-family:${SANS};">
      <h1 style="margin:0 0 16px 0; font-family:${SERIF}; font-size:28px; line-height:1.25; color:${C.ink}; font-weight:700;">${heading}</h1>
      ${body}
    </td>
  </tr>
${extra}
  <!-- Aviso de segurança -->
  <tr>
    <td class="stack-padding" style="padding:0 40px 32px 40px; font-family:${SANS};">
      <p style="margin:0; font-size:13px; line-height:1.6; color:${C.soft};">${footnote}</p>
    </td>
  </tr>

  <!-- Divisor -->
  <tr>
    <td style="padding:0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="border-top:1px solid ${C.line}; font-size:0; line-height:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- Rodapé -->
  <tr>
    <td align="center" style="padding:24px 40px 32px 40px; font-family:${SANS}; background-color:${C.card};">
      <p style="margin:0 0 6px 0; font-size:12px; line-height:1.6; color:${C.text};">
        Artes com Fé — Arte sacra · artescomfe.com.br
      </p>
      <p style="margin:0; font-size:12px; line-height:1.6; color:#b3a291;">
        E-mail automático, não responda.
      </p>
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
</center>
</body>
</html>
`

const p = html => `<p style="margin:0 0 16px 0; font-size:15px; line-height:1.7; color:${C.text};">${html}</p>`
const NAO_FOI_VOCE = 'Se não foi você, pode ignorar este e-mail com tranquilidade: nada muda na sua conta.'
const ALERTA = 'Se não foi você, <strong>redefina sua senha agora</strong> pelo botão abaixo (opção "Esqueci minha senha").'

// Assuntos (mailer_subjects_<chave>) usados por aplicar.mjs.
export const subjects = {
  confirmation: 'Confirme seu e-mail — Artes com Fé',
  invite: 'Convite para administrar a Artes com Fé',
  magic_link: 'Seu link de acesso — Artes com Fé',
  recovery: 'Redefinir sua senha — Artes com Fé',
  email_change: 'Confirme seu novo e-mail — Artes com Fé',
  reauthentication: 'Seu código de verificação — Artes com Fé',
  password_changed_notification: 'Sua senha foi alterada — Artes com Fé',
  email_changed_notification: 'O e-mail da sua conta mudou — Artes com Fé',
}

// chave = nome do modelo no Supabase (mailer_templates_<chave>_content)
export const templates = {
  confirmation: layout({
    title: 'Confirme seu e-mail',
    preheader: 'Falta só um clique para ativar sua conta na Artes com Fé.',
    heading: 'Que bom ter você conosco!',
    body: p('Sua conta na Artes com Fé foi criada. Para ativá-la, confirme seu e-mail clicando no botão abaixo.') +
      p('Com a conta ativa, você guarda suas imagens favoritas e avalia as peças que levou para casa.'),
    extra: button('{{ .ConfirmationURL }}', 'Confirmar meu e-mail'),
    footnote: 'Se você não criou uma conta na Artes com Fé, pode ignorar este e-mail.',
  }),
  invite: layout({
    title: 'Convite',
    preheader: 'Você foi convidado(a) para administrar a loja Artes com Fé. Crie sua senha para entrar.',
    heading: 'Você foi convidado(a) para a equipe da Artes com Fé.',
    body: p('Você recebeu um convite para ser <strong>administrador(a) da loja</strong> Artes com Fé, com acesso a produtos, preços, avaliações e configurações.') +
      p('Para ativar seu acesso, clique no botão abaixo e crie sua senha.'),
    // Vai para /entrar, que valida o convite (token_hash) e pede a nova senha.
    extra: button('{{ .SiteURL }}/entrar?token_hash={{ .TokenHash }}&amp;type=invite', 'Aceitar convite'),
    footnote: 'Se você não esperava este convite, pode ignorar este e-mail. Sem aceitar, nenhum acesso é liberado.',
  }),
  magic_link: layout({
    title: 'Seu link de acesso',
    preheader: 'Use este link para entrar na sua conta da Artes com Fé.',
    heading: 'Seu link de acesso chegou.',
    body: p('Clique no botão abaixo para entrar na sua conta da Artes com Fé. O link vale por pouco tempo e só pode ser usado uma vez.'),
    extra: button('{{ .ConfirmationURL }}', 'Entrar na minha conta'),
    footnote: NAO_FOI_VOCE,
  }),
  recovery: layout({
    title: 'Redefinir senha',
    preheader: 'Recebemos um pedido para redefinir a senha da sua conta na Artes com Fé.',
    heading: 'Vamos criar uma nova senha?',
    body: p('Recebemos um pedido para redefinir a senha da sua conta na Artes com Fé. Clique no botão abaixo e escolha uma nova senha.') +
      p('O link vale por pouco tempo e só pode ser usado uma vez.'),
    extra: button('{{ .ConfirmationURL }}', 'Criar nova senha'),
    footnote: 'Se você não pediu para trocar a senha, pode ignorar este e-mail: sua senha atual continua valendo.',
  }),
  email_change: layout({
    title: 'Confirme a troca de e-mail',
    preheader: 'Confirme a troca do e-mail da sua conta na Artes com Fé.',
    heading: 'Confirme seu novo e-mail.',
    body: p('Recebemos um pedido para trocar o e-mail da sua conta na Artes com Fé de <strong>{{ .Email }}</strong> para <strong>{{ .NewEmail }}</strong>.') +
      p('Para concluir a troca, clique no botão abaixo.'),
    extra: button('{{ .ConfirmationURL }}', 'Confirmar troca de e-mail'),
    footnote: 'Se você não pediu essa troca, ignore este e-mail: o e-mail da sua conta continua o mesmo.',
  }),
  reauthentication: layout({
    title: 'Código de verificação',
    preheader: 'Seu código de verificação da Artes com Fé: {{ .Token }}',
    heading: 'Seu código de verificação',
    body: p('Para confirmar que é você, digite o código abaixo no site da Artes com Fé.'),
    extra: code('{{ .Token }}'),
    footnote: 'Não compartilhe este código com ninguém. ' + NAO_FOI_VOCE,
  }),
  password_changed_notification: layout({
    title: 'Senha alterada',
    preheader: 'A senha da sua conta na Artes com Fé foi alterada.',
    heading: 'Sua senha foi alterada.',
    body: p('Este é um aviso de segurança: a senha da conta <strong>{{ .Email }}</strong> na Artes com Fé acabou de ser alterada.') +
      p('Se foi você, está tudo certo e não precisa fazer nada.'),
    extra: note(ALERTA) + button(`${SITE}/entrar`, 'Proteger minha conta'),
    footnote: 'Avisamos sempre que algo importante muda na sua conta.',
  }),
  email_changed_notification: layout({
    title: 'E-mail alterado',
    preheader: 'O e-mail da sua conta na Artes com Fé foi alterado.',
    heading: 'O e-mail da sua conta mudou.',
    body: p('Este é um aviso de segurança: o e-mail da sua conta na Artes com Fé foi alterado de <strong>{{ .OldEmail }}</strong> para <strong>{{ .Email }}</strong>.') +
      p('Se foi você, está tudo certo e não precisa fazer nada.'),
    extra: note('Se não foi você, fale com a gente pelo Instagram para recuperarmos sua conta.') + button(INSTAGRAM, 'Falar com a Artes com Fé'),
    footnote: 'Avisamos sempre que algo importante muda na sua conta.',
  }),
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [name, html] of Object.entries(templates)) writeFileSync(join(here, `${name}.html`), html)
  console.log('Modelos gerados:', Object.keys(templates).join(', '))
}
