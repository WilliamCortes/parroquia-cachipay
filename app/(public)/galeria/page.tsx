import type { Metadata } from "next";
import Image from "next/image";
import { getImagenesPorSeccion } from "@/lib/data/imagenes";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Galería",
  description: "Galería de fotos de la vida parroquial, celebraciones y comunidad de Cachipay.",
};

export const revalidate = 3600;

const FALLBACK_IMAGES = [
  { src: "/images/galeria-1.webp", alt: "Celebración vereda Tocarema" },
  { src: "/images/galeria-2.webp", alt: "Celebración vereda El Ocaso" },
  { src: "/images/galeria-3.webp", alt: "Fiesta patronal Virgen del Carmen" },
  { src: "/images/galeria-4.webp", alt: "Gran Bingo Familiar" },
  { src: "/images/galeria-5.jpg", alt: "Comunidad parroquial" },
  { src: "/images/galeria-6.jpg", alt: "Comunidad parroquial" },
  { src: "/images/galeria-7.jpg", alt: "Comunidad parroquial" },
  { src: "/images/galeria-8.jpg", alt: "Comunidad parroquial" },
  { src: "/images/galeria-9.jpg", alt: "Comunidad parroquial" },
];

export default async function GaleriaPage() {
  const imagenes = await getImagenesPorSeccion("galeria");
  const items =
    imagenes.length > 0
      ? imagenes.map((i) => ({ src: i.public_url, alt: i.alt ?? "Foto de la parroquia" }))
      : FALLBACK_IMAGES;

  return (
    <>
      <PageHero
        eyebrow="Nuestra comunidad"
        title="Galería"
        description="Momentos de la vida parroquial, celebraciones y comunidad de Cachipay y sus veredas."
      />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {items.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-secondary ring-1 ring-border">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
