-- Administrador só por convite (mesmo padrão da Maré).
-- Quem se cadastra pelo site entra sempre como cliente.
-- Quem é convidado no painel do Supabase (Authentication → Users → Invite user) vira admin.
-- O Supabase cria a conta do convite (INSERT) e só depois preenche invited_at (UPDATE);
-- só a chave secreta do projeto faz isso, então ninguém forja o convite pelo site.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    left(nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'nome')), ''), 120),
    case when new.invited_at is not null then 'admin'::public.user_role else 'cliente'::public.user_role end
  );
  return new;
end $$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.handle_user_invited()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set role = 'admin'::public.user_role where id = new.id;
  return new;
end $$;
revoke all on function public.handle_user_invited() from public, anon, authenticated;

create trigger on_auth_user_invited
  after update of invited_at on auth.users
  for each row
  when (old.invited_at is null and new.invited_at is not null)
  execute function public.handle_user_invited();

comment on table private.admin_emails is 'Sem uso desde 2026-11-27: admin agora é só quem entra por convite.';
