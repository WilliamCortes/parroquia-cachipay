import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNoticiaPorSlug, getNoticiasPublicadas } from "@/lib/data/noticias";

export const revalidate = 3600;

export async function generateStaticParams() {
  const noticias = await getNoticiasPublicadas();
  return noticias.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaPorSlug(slug);
  if (!noticia) return {};

  return {
    title: noticia.title,
    description: noticia.excerpt ?? undefined,
    openGraph: noticia.cover_image_url
      ? { images: [{ url: noticia.cover_image_url }] }
      : undefined,
  };
}

function formatFecha(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await getNoticiaPorSlug(slug);
  if (!noticia) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
        {noticia.category}
      </span>
      <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">{noticia.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{formatFecha(noticia.published_at)}</p>

      {noticia.cover_image_url && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image src={noticia.cover_image_url} alt={noticia.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-neutral mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: noticia.body }}
      />
    </article>
  );
}
