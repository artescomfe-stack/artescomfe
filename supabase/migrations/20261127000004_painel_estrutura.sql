-- =====================================================================
-- Painel da loja (/painel-loja) — estrutura, no mesmo padrão da Maré.
-- O site continua lendo products.type/line; o painel grava os dois e também product_categories.
-- =====================================================================

-- 1) Categorias: 'colecao' = linha da loja (Imagens sacras, Quadros…); 'tipo' = devoção (Nossa Senhora, Santos…)
create table public.categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name             text not null check (char_length(name) between 2 and 60),
  kind             text not null default 'tipo' check (kind in ('colecao', 'tipo')),
  sort_order       integer not null default 0,
  active           boolean not null default true,
  home_card        boolean not null default false,
  home_card_order  integer not null default 0,
  home_title       text,
  home_image       text,
  home_tone        text not null default 'light' check (home_tone in ('light', 'dark')),
  banner_eyebrow   text,
  banner_title     text,
  banner_text      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create index categories_sort_idx on public.categories (sort_order);
alter table public.categories enable row level security;
create policy "Categorias: leitura pública das ativas" on public.categories for select to anon, authenticated using (active or (select private.is_admin()));
create policy "Categorias: admin cria" on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy "Categorias: admin edita" on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Categorias: admin exclui" on public.categories for delete to authenticated using ((select private.is_admin()));
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

create table public.product_categories (
  product_id   uuid not null references public.products (id) on delete cascade,
  category_id  uuid not null references public.categories (id) on delete cascade,
  primary key (product_id, category_id)
);
create index product_categories_category_idx on public.product_categories (category_id);
alter table public.product_categories enable row level security;
create policy "Produto-categoria: leitura pública" on public.product_categories for select to anon, authenticated using (true);
create policy "Produto-categoria: admin cria" on public.product_categories for insert to authenticated with check ((select private.is_admin()));
create policy "Produto-categoria: admin exclui" on public.product_categories for delete to authenticated using ((select private.is_admin()));
grant select on public.product_categories to anon, authenticated;
grant insert, delete on public.product_categories to authenticated;

insert into public.categories (slug, name, kind, sort_order) values
  ('imagens-sacras',  'Imagens sacras',  'colecao', 10),
  ('quadros',         'Quadros e placas','colecao', 20),
  ('tercos',          'Terços',          'colecao', 30),
  ('presentes',       'Presentes',       'colecao', 40),
  ('nossa-senhora',   'Nossa Senhora',   'tipo',    50),
  ('santos',          'Santos',          'tipo',    60),
  ('jesus-cristo',    'Jesus Cristo',    'tipo',    70),
  ('sagrada-familia', 'Sagrada Família', 'tipo',    80);

insert into public.product_categories (product_id, category_id)
select p.id, c.id from public.products p join public.categories c on c.slug = case p.line
  when 'imagens' then 'imagens-sacras' when 'quadros' then 'quadros' when 'tercos' then 'tercos' when 'presentes' then 'presentes' end
on conflict do nothing;
insert into public.product_categories (product_id, category_id)
select p.id, c.id from public.products p join public.categories c on c.slug = case p.type
  when 'maria' then 'nossa-senhora' when 'santo' then 'santos' when 'jesus' then 'jesus-cristo' when 'familia' then 'sagrada-familia' end
on conflict do nothing;

-- 2) Produtos: detalhes extras, endereços antigos e parcelamento por produto
alter table public.products
  add column details jsonb not null default '[]'::jsonb check (jsonb_typeof(details) = 'array'),
  add column old_slugs text[] not null default '{}',
  add column installments_times smallint check (installments_times between 1 and 24),
  add column installment_value numeric(10,2) check (installment_value > 0),
  add column installment_note text check (length(installment_note) <= 40);
create index products_old_slugs_idx on public.products using gin (old_slugs);

alter table public.product_images drop constraint product_images_product_id_position_key;
alter table public.product_images add constraint product_images_product_id_position_key unique (product_id, position) deferrable initially deferred;

-- 3) Configurações: logo, redes, rodapé e destaques (usados na etapa 2 do painel)
alter table public.store_settings
  add column logo_url text,
  add column logo_footer_url text,
  add column social jsonb not null default '[]'::jsonb check (jsonb_typeof(social) = 'array'),
  add column footer_text text,
  add column spotlight_enabled boolean not null default true,
  add column spotlight_ids uuid[] not null default '{}',
  add constraint store_settings_spotlight_max check (cardinality(spotlight_ids) <= 5);
update public.store_settings set social = jsonb_build_array(jsonb_build_object('network', 'instagram', 'url', instagram_url, 'label', instagram_handle)) where social = '[]'::jsonb;

-- 4) Conteúdo editável do site (textos e imagens por seção)
create table public.site_content (
  key         text primary key check (key ~ '^[a-z0-9_]+$'),
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
create trigger site_content_updated_at before update on public.site_content for each row execute function public.set_updated_at();
alter table public.site_content enable row level security;
create policy "Conteúdo: leitura pública" on public.site_content for select to anon, authenticated using (true);
create policy "Conteúdo: admin cria" on public.site_content for insert to authenticated with check ((select private.is_admin()));
create policy "Conteúdo: admin edita" on public.site_content for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Conteúdo: admin exclui" on public.site_content for delete to authenticated using ((select private.is_admin()));
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

-- 5) Storage: bucket "site" e leitura de admin (necessária para apagar arquivos pela API)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('site', 'site', true, 5242880, array['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/svg+xml'])
on conflict (id) do nothing;
create policy "Storage site: admin envia" on storage.objects for insert to authenticated with check (bucket_id = 'site' and (select private.is_admin()));
create policy "Storage site: admin atualiza" on storage.objects for update to authenticated using (bucket_id = 'site' and (select private.is_admin()));
create policy "Storage site: admin exclui" on storage.objects for delete to authenticated using (bucket_id = 'site' and (select private.is_admin()));
create policy "Storage produtos: admin lê" on storage.objects for select to authenticated using (bucket_id = 'produtos' and (select private.is_admin()));
create policy "Storage site: admin lê" on storage.objects for select to authenticated using (bucket_id = 'site' and (select private.is_admin()));

revoke truncate, trigger, references on all tables in schema public from anon, authenticated;
alter default privileges for role postgres in schema public revoke truncate, trigger, references on tables from anon, authenticated;

-- 6) Clientes e administradores (o e-mail fica em auth.users; só admin consulta)
create or replace function public.admin_list_clientes()
returns table (id uuid, full_name text, email text, phone text, avatar_url text, created_at timestamptz, last_sign_in_at timestamptz, favorites integer)
language plpgsql stable security definer set search_path to '' as $$
begin
  if not private.is_admin() then raise exception 'Acesso restrito à administração da loja.' using errcode = '42501'; end if;
  return query
    select p.id, p.full_name, u.email::text, p.phone, p.avatar_url, u.created_at, u.last_sign_in_at,
           (select count(*)::integer from public.favorites f where f.user_id = p.id)
      from public.profiles p join auth.users u on u.id = p.id
     where p.role = 'cliente' order by u.created_at desc;
end $$;
revoke execute on function public.admin_list_clientes() from public, anon;
grant execute on function public.admin_list_clientes() to authenticated;

create or replace function public.admin_list_users()
returns table (id uuid, full_name text, email text, role public.user_role, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path to '' as $$
begin
  if not private.is_admin() then raise exception 'Acesso restrito à administração da loja.' using errcode = '42501'; end if;
  return query
    select p.id, p.full_name, u.email::text, p.role, u.last_sign_in_at
      from public.profiles p join auth.users u on u.id = p.id
     order by (p.role = 'admin') desc, lower(coalesce(nullif(p.full_name, ''), u.email::text));
end $$;
revoke execute on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_set_role(p_user uuid, p_role public.user_role)
returns void language plpgsql volatile security definer set search_path to '' as $$
begin
  if not private.is_admin() then raise exception 'Acesso restrito à administração da loja.' using errcode = '42501'; end if;
  if p_user = (select auth.uid()) and p_role <> 'admin' then raise exception 'Você não pode tirar o seu próprio acesso de admin.' using errcode = '42501'; end if;
  if p_role <> 'admin' and (select count(*) from public.profiles where role = 'admin' and id <> p_user) = 0 then
    raise exception 'A loja precisa ter pelo menos um admin.' using errcode = '42501'; end if;
  update public.profiles set role = p_role where id = p_user;
  if not found then raise exception 'Conta não encontrada.' using errcode = 'P0002'; end if;
end $$;
revoke execute on function public.admin_set_role(uuid, public.user_role) from public, anon;
grant execute on function public.admin_set_role(uuid, public.user_role) to authenticated;

-- 7) Contador de acessos próprio (sem cookies; só o painel lê, já somado)
create table public.site_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor    uuid not null,
  path       text not null,
  product_id uuid references public.products(id) on delete set null,
  is_entry   boolean not null default false,
  source     text,
  device     text
);
create index site_events_created_idx on public.site_events (created_at);
create index site_events_visitor_idx on public.site_events (visitor, created_at);
create index site_events_product_idx on public.site_events (product_id, created_at) where product_id is not null;
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;

create or replace function public.track_event(p_visitor uuid, p_path text, p_entry boolean default false, p_ref text default null, p_device text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_path text := left(coalesce(p_path, '/'), 300);
  v_slug text; v_product uuid; v_source text; v_last timestamptz; v_new_visit boolean;
begin
  if p_visitor is null or v_path not like '/%' or v_path like '/painel-loja%' then return; end if;
  if private.is_admin() then return; end if;
  if exists (select 1 from site_events where visitor = p_visitor and path = v_path and created_at > now() - interval '3 hours') then return; end if;
  select max(created_at) into v_last from site_events where visitor = p_visitor;
  v_new_visit := v_last is null or v_last < now() - interval '3 hours';
  if v_path like '/produto/%' then
    v_slug := split_part(substr(v_path, 10), '/', 1);
    select id into v_product from products where slug = v_slug or v_slug = any(old_slugs) limit 1;
  end if;
  if v_new_visit then
    v_source := case
      when p_ref is null or btrim(p_ref) = '' then 'Direto'
      when p_ref ~* 'instagram' then 'Instagram'
      when p_ref ~* 'whatsapp|wa\.me' then 'WhatsApp'
      when p_ref ~* 'facebook|fb\.|fban|fbav' then 'Facebook'
      when p_ref ~* 'tiktok' then 'TikTok'
      when p_ref ~* 'google' then 'Google'
      when p_ref ~* 'bing|yahoo|duckduckgo|ecosia' then 'Outras buscas'
      else 'Outros sites' end;
  end if;
  insert into site_events (visitor, path, product_id, is_entry, source, device)
  values (p_visitor, v_path, v_product, v_new_visit, v_source, case when p_device in ('celular', 'computador') then p_device end);
end; $$;
revoke all on function public.track_event(uuid, text, boolean, text, text) from public;
grant execute on function public.track_event(uuid, text, boolean, text, text) to anon, authenticated;

create or replace function public.site_stats(p_days int default 7)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  tz constant text := 'America/Sao_Paulo';
  days int := greatest(1, least(coalesce(p_days, 7), 90));
  since timestamptz := (date_trunc('day', now() at time zone tz) - make_interval(days => days - 1)) at time zone tz;
  prev_since timestamptz := since - make_interval(days => days);
  result jsonb;
begin
  if not private.is_admin() then raise exception 'sem permissão' using errcode = '42501'; end if;
  with cur as (select * from site_events where created_at >= since),
       prev as (select * from site_events where created_at >= prev_since and created_at < since),
       buckets as (
         select b from generate_series(
           case when days = 1 then date_trunc('day', now() at time zone tz) else (since at time zone tz) end,
           case when days = 1 then date_trunc('hour', now() at time zone tz) else date_trunc('day', now() at time zone tz) end,
           case when days = 1 then interval '1 hour' else interval '1 day' end) b)
  select jsonb_build_object(
    'visitors',      (select count(distinct visitor) from cur),
    'visits',        (select count(*) from cur where is_entry),
    'pageviews',     (select count(*) from cur),
    'productViews',  (select count(*) from cur where product_id is not null),
    'prevVisitors',  (select count(distinct visitor) from prev),
    'prevPageviews', (select count(*) from prev),
    'series', (select coalesce(jsonb_agg(jsonb_build_object('t', b, 'visitors', coalesce(s.v, 0), 'pageviews', coalesce(s.p, 0)) order by b), '[]')
               from buckets left join (
                 select date_trunc(case when days = 1 then 'hour' else 'day' end, created_at at time zone tz) t, count(distinct visitor) v, count(*) p
                 from cur group by 1) s on s.t = b),
    'products', (select coalesce(jsonb_agg(x order by x.views desc), '[]') from (
                   select product_id id, count(*) views, count(distinct visitor) visitors from cur where product_id is not null group by product_id order by count(*) desc limit 10) x),
    'sources',  (select coalesce(jsonb_agg(x order by x.visits desc), '[]') from (
                   select source name, count(*) visits from cur where is_entry and source is not null group by source) x),
    'devices',  (select coalesce(jsonb_agg(x order by x.visitors desc), '[]') from (
                   select device name, count(distinct visitor) visitors from cur where device is not null group by device) x),
    'pages',    (select coalesce(jsonb_agg(x order by x.views desc), '[]') from (
                   select path, count(*) views from cur where product_id is null group by path order by count(*) desc limit 6) x)
  ) into result;
  return result;
end; $$;
revoke all on function public.site_stats(int) from public;
grant execute on function public.site_stats(int) to authenticated;
