# Artes com Fé

Loja de arte sacra da Artes com Fé, feita com React + Vite e conectada ao Supabase.
As vendas são fechadas pelo WhatsApp (sacola → mensagem pronta → atendimento).
Base técnica herdada do projeto Maré (mesma lógica de sacola, favoritos, login, avaliações e newsletter).

## Desenvolvimento

```bash
npm install
npm run dev
```

As chaves do Supabase ficam em `.env` (`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`) — veja `.env.example`.
Sem as chaves, o site funciona normalmente com o catálogo local de `src/products.js`
(login, avaliações, favoritos na conta e newsletter ficam desativados).
**Nunca** coloque a chave `secret`/`service_role` no `.env` do site.

## Produção (Hostinger)

```bash
npm run build
```

Publique o conteúdo de `dist/`. O `.htaccess` em `public/` já faz as rotas (/produtos, /produto/...) funcionarem.

## Supabase (projeto novo, só da Artes com Fé)

1. Crie um projeto no Supabase e copie URL + chave *publishable* para o `.env`.
2. Rode as migrations de `supabase/migrations/` na ordem (SQL Editor ou `supabase db push`).
3. Em `private.admin_emails` ficam os e-mails que viram administradores ao se cadastrar
   (migration `..._admin_automatico.sql` — ajuste o e-mail se precisar).

| O que | Onde editar (painel do Supabase → Table Editor) |
|---|---|
| Imagens, preços, esgotado, destaques | `products` (`available=false` = esgotado; `old_price` = promoção; `is_new` = vitrine Novidades; `active=false` = some do site) |
| Acabamento, material e medidas | `products.finish`, `products.material`, `products.dimensions` |
| Fotos | `product_images` (caminho em `/public/img/...` ou URL do bucket `produtos`) |
| WhatsApp, Instagram, parcelas | `store_settings` (WhatsApp com DDI+DDD, só dígitos: `5511999998888`) |
| Aprovar avaliações | `reviews` → mude `status` para `aprovada` |
| E-mails da newsletter | `newsletter_subscribers` |

Categorias (`products.type`): `maria` (Nossa Senhora), `santo`, `jesus`, `familia` (Sagrada Família).

## Imagens

- Fotos originais: `../Assets/Produtos/#NN/` → convertidas para `public/img/produtos/NN-01.webp` (1000px) e `NN-01-480.webp` (cards).
- Banners (`public/img/banners/`) foram montados a partir das fotos dos produtos, como provisórios.
  Para trocar, coloque a arte nova com o mesmo nome (versão grande + versão `-1200`/`-800`).
- Logotipo: `public/img/logo/` (emblema e logo completo em traço marrom e claro, perfil colorido).

## Pendências antes de publicar

- [ ] Confirmar preços, medidas e material de cada imagem (`src/products.js` / tabela `products`).
- [ ] Número do WhatsApp e Instagram oficiais (`store_settings` ou `src/store.js`).
- [ ] Revisar o texto da página Sobre nós.
- [ ] Banners definitivos (opcional).
