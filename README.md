# Parroquia Nuestra Señora del Carmen de Cachipay

Portal web y panel administrativo de la Parroquia Nuestra Señora del Carmen de Cachipay (Diócesis de Girardot).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- Tailwind CSS v4 + shadcn/ui (Base UI)
- Tiptap (editor de contenido enriquecido)
- Wompi (Colombia) + PayPal (internacional) + Bre-B (QR estático) para donaciones

## Desarrollo local

```bash
npm install
npm run dev
```

Copia `.env.local.example` (o revisa las variables listadas abajo) y complétalas antes de correr el proyecto.

## Estructura

- `app/(public)/` — sitio público (inicio, horarios, historia, galería, noticias, grupos, sacramentos, donaciones, contacto)
- `app/admin/` — panel administrativo (protegido por Supabase Auth vía `proxy.ts`)
- `app/api/` — rutas de pago (Wompi/PayPal) y webhooks
- `lib/data/` — funciones de lectura de datos públicos desde Supabase
- `lib/supabase/` — clientes de Supabase (browser, server, admin/service-role)
- `supabase/migrations/` — esquema SQL (aplicar en orden)
- `scripts/seed-images.mjs` — sube imágenes iniciales al bucket `parroquia-media`

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # secreta, solo servidor

NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_EVENTS_KEY=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

## Usuarios admin

No hay registro público. Los usuarios del panel (`/admin`) se crean manualmente desde el dashboard de Supabase (Authentication → Users) o vía la API de administración.

## Deploy

Proyecto pensado para desplegar en [Vercel](https://vercel.com), con las variables de entorno configuradas por ambiente (sandbox primero para Wompi/PayPal, llaves reales solo en producción una vez confirmadas).
