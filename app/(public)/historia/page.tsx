import type { Metadata } from "next";
import Image from "next/image";
import { getContenido } from "@/lib/data/contenido";
import { getImagenesPorSeccion } from "@/lib/data/imagenes";

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Nuestra historia</h1>

      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={heroSrc}
          alt="Comunidad de la Parroquia Nuestra Señora del Carmen de Cachipay"
          fill
          className="object-cover"
        />
      </div>

      <div className="prose prose-neutral mt-8 max-w-none text-base leading-relaxed">
        <p>{historia["bio.texto"]}</p>
        {historia["parroco.texto"] && <p className="mt-4">{historia["parroco.texto"]}</p>}
      </div>
    </div>
  );
}
