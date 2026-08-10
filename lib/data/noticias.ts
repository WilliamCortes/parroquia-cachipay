import { createStaticClient } from "@/lib/supabase/static";

export type Noticia = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  category: "noticia" | "evento" | "aviso";
  published: boolean;
  published_at: string | null;
};

export async function getNoticiasPublicadas(limit?: number): Promise<Noticia[]> {
  const supabase = createStaticClient();
  let query = supabase
    .from("eventos_noticias")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as Noticia[];
}

export async function getNoticiaPorSlug(slug: string): Promise<Noticia | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("eventos_noticias")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return (data as Noticia) ?? null;
}
