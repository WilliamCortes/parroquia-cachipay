import { createClient } from "@/lib/supabase/server";

export type Grupo = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meeting_info: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  image_url: string | null;
};

export async function getGruposActivos(): Promise<Grupo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("grupos_parroquiales")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return (data ?? []) as Grupo[];
}
