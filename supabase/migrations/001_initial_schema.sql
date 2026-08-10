-- Parroquia Nuestra Señora del Carmen de Cachipay — Migración inicial

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- CONTENIDO — texto editable de páginas (page/section/key -> value)
-- ============================================================
create table if not exists contenido (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  key text not null,
  value text not null,
  updated_at timestamptz default now(),
  unique (page, section, key)
);

-- ============================================================
-- EVENTOS_NOTICIAS — noticias / avisos / eventos
-- ============================================================
create table if not exists eventos_noticias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null,
  cover_image_url text,
  category text not null default 'noticia'
    check (category in ('noticia', 'evento', 'aviso')),
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- IMAGENES — imágenes gestionadas del sitio
-- ============================================================
create table if not exists imagenes (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  alt text,
  section text check (section in ('hero', 'historia', 'galeria', 'grupos', 'sacramentos', 'breb', 'general')),
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- HORARIOS_MISA — horario semanal recurrente + fechas especiales
-- ============================================================
create table if not exists horarios_misa (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'recurring' check (type in ('recurring', 'special')),
  day_of_week smallint check (day_of_week between 0 and 6), -- 0=Domingo
  specific_date date,
  time time not null,
  location text not null,
  notes text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint horarios_misa_type_fields check (
    (type = 'recurring' and day_of_week is not null and specific_date is null) or
    (type = 'special' and specific_date is not null)
  )
);

-- ============================================================
-- GRUPOS_PARROQUIALES — grupos / ministerios
-- ============================================================
create table if not exists grupos_parroquiales (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  meeting_info text,
  contact_name text,
  contact_phone text,
  image_url text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- DONACIONES — registro de donaciones/diezmos
-- ============================================================
create table if not exists donaciones (
  id uuid primary key default gen_random_uuid(),
  donor_name text,
  donor_email text,
  amount numeric(12, 2) not null,
  currency text not null default 'COP' check (currency in ('COP', 'USD')),
  gateway text not null check (gateway in ('wompi', 'paypal', 'breb-manual')),
  gateway_reference text unique,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  purpose text not null default 'general'
    check (purpose in ('diezmo', 'ofrenda', 'construccion_capilla_tocarema', 'general')),
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- METODOS_PAGO — configuración única (toggles + datos estáticos Bre-B)
-- ============================================================
create table if not exists metodos_pago (
  id smallint primary key default 1 check (id = 1),
  wompi_enabled boolean not null default false,
  paypal_enabled boolean not null default false,
  breb_enabled boolean not null default false,
  breb_qr_image_url text,
  breb_alias text,
  breb_bank_name text,
  updated_at timestamptz default now()
);
insert into metodos_pago (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table contenido enable row level security;
create policy "public_read_contenido" on contenido for select to public using (true);
create policy "admin_manage_contenido" on contenido for all using (auth.role() = 'authenticated');

alter table eventos_noticias enable row level security;
create policy "public_read_published_noticias" on eventos_noticias for select using (published = true);
create policy "admin_manage_noticias" on eventos_noticias for all using (auth.role() = 'authenticated');

alter table imagenes enable row level security;
create policy "public_read_active_imagenes" on imagenes for select using (active = true);
create policy "admin_manage_imagenes" on imagenes for all using (auth.role() = 'authenticated');

alter table horarios_misa enable row level security;
create policy "public_read_active_horarios" on horarios_misa for select using (active = true);
create policy "admin_manage_horarios" on horarios_misa for all using (auth.role() = 'authenticated');

alter table grupos_parroquiales enable row level security;
create policy "public_read_active_grupos" on grupos_parroquiales for select using (active = true);
create policy "admin_manage_grupos" on grupos_parroquiales for all using (auth.role() = 'authenticated');

alter table donaciones enable row level security;
create policy "admin_only_donaciones" on donaciones for all using (auth.role() = 'authenticated');
-- Sin política de insert público: las filas se crean server-side (service role)
-- desde las rutas de inicio de pago (Wompi/PayPal), que ignoran RLS.

alter table metodos_pago enable row level security;
create policy "public_read_metodos_pago" on metodos_pago for select to public using (true);
create policy "admin_update_metodos_pago" on metodos_pago for update using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGERS updated_at
-- ============================================================
create or replace function update_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_contenido_updated before update on contenido for each row execute function update_updated_at();
create trigger tr_noticias_updated before update on eventos_noticias for each row execute function update_updated_at();
create trigger tr_horarios_updated before update on horarios_misa for each row execute function update_updated_at();
create trigger tr_grupos_updated before update on grupos_parroquiales for each row execute function update_updated_at();
create trigger tr_donaciones_updated before update on donaciones for each row execute function update_updated_at();
create trigger tr_metodos_pago_updated before update on metodos_pago for each row execute function update_updated_at();
