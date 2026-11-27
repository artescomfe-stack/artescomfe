// Aplica no Supabase Auth: modelos de e-mail + assuntos, envio pelo Resend (SMTP),
// URL do site e URLs de retorno permitidas.
// Uso (as chaves vêm do ambiente, nunca do código):
//   SUPABASE_ACCESS_TOKEN=sbp_...  RESEND_SMTP_KEY=re_...  node supabase/email-templates/aplicar.mjs
// RESEND_SMTP_KEY é opcional: sem ela, só modelos/assuntos/URLs são atualizados.
import { subjects, templates } from './gerar.mjs'

const REF = 'gdiehxeroupeqytvvoyj'
const SITE = 'https://artescomfe.com.br'
const token = process.env.SUPABASE_ACCESS_TOKEN
if (!token) { console.error('Falta SUPABASE_ACCESS_TOKEN.'); process.exit(1) }

const body = {
  site_url: SITE,
  uri_allow_list: [`${SITE}/**`, 'https://www.artescomfe.com.br/**', 'http://localhost:5173/**'].join(','),
  external_email_enabled: true,
  mailer_autoconfirm: false,               // cadastro pelo site exige confirmar o e-mail
  mailer_secure_email_change_enabled: true,
  mailer_notifications_password_changed_enabled: true,
  mailer_notifications_email_changed_enabled: true,
}
for (const [name, html] of Object.entries(templates)) {
  const isNotification = name.endsWith('_notification')
  const key = isNotification ? name.replace('_notification', '') : name
  if (isNotification) {
    body[`mailer_subjects_${key}_notification`] = subjects[name]
    body[`mailer_templates_${key}_notification_content`] = html
  } else {
    body[`mailer_subjects_${name}`] = subjects[name]
    body[`mailer_templates_${name}_content`] = html
  }
}

if (process.env.RESEND_SMTP_KEY) Object.assign(body, {
  smtp_host: 'smtp.resend.com',
  smtp_port: '465',
  smtp_user: 'resend',
  smtp_pass: process.env.RESEND_SMTP_KEY,
  smtp_admin_email: 'nao-responda@artescomfe.com.br',
  smtp_sender_name: 'Artes com Fé',
  rate_limit_email_sent: 60,
})

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
if (!res.ok) { console.error('Erro', res.status, await res.text()); process.exit(1) }
const cfg = await res.json()
console.log('Aplicado.', {
  site_url: cfg.site_url,
  smtp: cfg.smtp_host ? `${cfg.smtp_sender_name} <${cfg.smtp_admin_email}> via ${cfg.smtp_host}` : 'padrão do Supabase',
  confirmar_email: !cfg.mailer_autoconfirm,
  modelos: Object.keys(templates).length,
})
