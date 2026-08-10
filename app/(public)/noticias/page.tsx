import type { Metadata } from "next";
import Link from "next/link";
import { getNoticiasPublicadas } from "@/lib/data/noticias";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias, avisos y eventos de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

function formatFecha(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function NoticiasPage() {
  const noticias = await getNoticiasPublicadas();

  return (
    <>
      <PageHero eyebrow="Al día" title="Noticias y avisos" />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="divide-y divide-border">
          {noticias.length === 0 && (
            <p className="text-muted-foreground">Aún no hay noticias publicadas.</p>
          )}
          {noticias.map((n) => (
            <Link key={n.id} href={`/noticias/${n.slug}`} className="group block py-7 first:pt-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold uppercase tracking-wide text-carmelo">
                  {n.category}
                </span>
                <span className="text-muted-foreground">{formatFecha(n.published_at)}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground group-hover:text-carmelo">
                {n.title}
              </h2>
              {n.excerpt && <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
