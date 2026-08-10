import { createStaticClient } from "@/lib/supabase/static";

export type ContenidoRow = {
  page: string;
  section: string;
  key: string;
  value: string;
};

/** Devuelve el contenido editable de una página como un mapa `section.key -> value`. */
export async function getContenido(page: string): Promise<Record<string, string>> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("contenido")
    .select("section, key, value")
    .eq("page", page);

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[`${row.section}.${row.key}`] = row.value;
  }
  return map;
}
