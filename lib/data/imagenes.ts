import { createStaticClient } from "@/lib/supabase/static";

export type Imagen = {
  id: string;
  storage_path: string;
  public_url: string;
  alt: string | null;
  section: string | null;
  sort_order: number;
};

export async function getImagenesPorSeccion(section: string): Promise<Imagen[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("imagenes")
    .select("*")
    .eq("section", section)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return (data ?? []) as Imagen[];
}
