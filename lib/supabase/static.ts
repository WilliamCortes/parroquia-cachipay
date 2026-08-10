import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente sin cookies para contextos que corren en build time (p. ej.
 * generateStaticParams), donde next/headers no está disponible. Usa la
 * anon key — solo lectura pública, respeta RLS igual que el cliente normal.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
