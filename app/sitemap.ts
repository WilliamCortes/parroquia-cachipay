import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const STATIC_PATHS = [
  "",
  "/horarios",
  "/historia",
  "/galeria",
  "/noticias",
  "/grupos",
  "/sacramentos",
  "/donaciones",
  "/contacto",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const supabase = await createClient();
  const { data: noticias } = await supabase
    .from("eventos_noticias")
    .select("slug, updated_at")
    .eq("published", true);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const noticiaEntries: MetadataRoute.Sitemap = (noticias ?? []).map((n) => ({
    url: `${baseUrl}/noticias/${n.slug}`,
    lastModified: n.updated_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...noticiaEntries];
}
