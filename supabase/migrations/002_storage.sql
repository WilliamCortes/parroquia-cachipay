-- Bucket público para imágenes del sitio (galería, noticias, grupos, Bre-B QR)
insert into storage.buckets (id, name, public)
values ('parroquia-media', 'parroquia-media', true)
on conflict (id) do nothing;

create policy "public_read_media" on storage.objects for select
  using (bucket_id = 'parroquia-media');

create policy "admin_write_media" on storage.objects for insert
  with check (bucket_id = 'parroquia-media' and auth.role() = 'authenticated');

create policy "admin_update_media" on storage.objects for update
  using (bucket_id = 'parroquia-media' and auth.role() = 'authenticated');

create policy "admin_delete_media" on storage.objects for delete
  using (bucket_id = 'parroquia-media' and auth.role() = 'authenticated');
