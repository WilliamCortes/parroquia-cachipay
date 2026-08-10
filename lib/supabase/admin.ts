import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con service-role key: ignora RLS por completo. Solo para uso
// server-side en Server Actions, Route Handlers y webhooks — nunca exponer
// al cliente ni importar desde un componente "use client".
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
