-- Foto de perfil (página Minha conta), mesmo padrão da Maré.
-- O site envia um WebP (ou JPG no Safari) de ~10–20 KB; cada pessoa tem um único arquivo
-- avatares/<id>/avatar.webp|jpg (a nova substitui a antiga).
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles drop constraint if exists profiles_avatar_url_check;
alter table public.profiles add constraint profiles_avatar_url_check
  check (avatar_url is null or (avatar_url ~ '^https://' and length(avatar_url) <= 500));
grant update (avatar_url) on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 262144, array['image/webp', 'image/jpeg'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Storage avatares: dono lê a sua pasta" on storage.objects for select to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Storage avatares: dono envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatares' and name in ((select auth.uid())::text || '/avatar.webp', (select auth.uid())::text || '/avatar.jpg'));
create policy "Storage avatares: dono atualiza" on storage.objects for update to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatares' and name in ((select auth.uid())::text || '/avatar.webp', (select auth.uid())::text || '/avatar.jpg'));
create policy "Storage avatares: dono exclui" on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = (select auth.uid())::text);
