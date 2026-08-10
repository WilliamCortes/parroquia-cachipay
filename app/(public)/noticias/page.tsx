import type { Metadata } from "next";
import Link from "next/link";
import { getNoticiasPublicadas } from "@/lib/data/noticias";

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Noticias y avisos</h1>

      <div className="mt-10 space-y-6">
        {noticias.length === 0 && (
          <p className="text-muted-foreground">Aún no hay noticias publicadas.</p>
        )}
        {noticias.map((n) => (
          <Link
            key={n.id}
            href={`/noticias/${n.slug}`}
            className="block rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium uppercase tracking-wide text-secondary-foreground">
                {n.category}
              </span>
              <span>{formatFecha(n.published_at)}</span>
            </div>
            <h2 className="mt-3 font-serif text-xl font-semibold">{n.title}</h2>
            {n.excerpt && <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
