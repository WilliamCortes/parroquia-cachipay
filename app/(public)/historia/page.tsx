import type { Metadata } from "next";
import Image from "next/image";
import { getContenido } from "@/lib/data/contenido";
import { getImagenesPorSeccion } from "@/lib/data/imagenes";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Historia",
  description: "Historia de la Parroquia Nuestra Señora del Carmen de Cachipay, Diócesis de Girardot.",
};

export const revalidate = 3600;

export default async function HistoriaPage() {
  const [historia, imagenes] = await Promise.all([
    getContenido("historia"),
    getImagenesPorSeccion("hero"),
  ]);
  const heroSrc = imagenes[0]?.public_url ?? "/images/hero.jpg";

  return (
    <>
      <PageHero eyebrow="Setenta años de fe" title="Nuestra historia" />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm">
          <Image
            src={heroSrc}
            alt="Comunidad de la Parroquia Nuestra Señora del Carmen de Cachipay"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-10 border-l-2 border-oro/40 pl-6">
          <p className="font-serif text-xl leading-relaxed text-foreground sm:text-2xl">
            {historia["bio.texto"]}
          </p>
        </div>
        {historia["parroco.texto"] && (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {historia["parroco.texto"]}
          </p>
        )}
      </div>
    </>
  );
}
