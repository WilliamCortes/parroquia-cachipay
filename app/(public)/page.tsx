import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Church, Heart } from "lucide-react";
import { getContenido } from "@/lib/data/contenido";
import { getProximosEspeciales, nombreDia } from "@/lib/data/horarios";
import { getNoticiasPublicadas } from "@/lib/data/noticias";
import { getImagenesPorSeccion } from "@/lib/data/imagenes";

function formatFecha(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function InicioPage() {
  const [inicio, proximos, noticias, heroImagenes] = await Promise.all([
    getContenido("inicio"),
    getProximosEspeciales(3),
    getNoticiasPublicadas(3),
    getImagenesPorSeccion("hero"),
  ]);
  const heroSrc = heroImagenes[0]?.public_url ?? "/images/hero.jpg";

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt="Parroquia Nuestra Señora del Carmen de Cachipay"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6">
          <p className="font-serif text-sm uppercase tracking-widest text-gold">
            {inicio["hero.subtitulo"] ?? "Diócesis de Girardot"}
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold text-white sm:text-5xl">
            {inicio["hero.titulo"] ?? "Parroquia Nuestra Señora del Carmen de Cachipay"}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-white/90"
            >
              <CalendarDays className="size-4" />
              Ver horarios de misa
            </Link>
            <Link
              href="/donaciones"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground hover:opacity-90"
            >
              <Heart className="size-4" />
              Donaciones y diezmos
            </Link>
          </div>
        </div>
      </section>

      {proximos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-center gap-2">
            <Church className="size-5 text-primary" />
            <h2 className="font-serif text-2xl font-semibold">Próximas celebraciones</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {proximos.map((h) => (
              <div key={h.id} className="rounded-lg border bg-card p-5">
                <p className="text-sm font-medium capitalize text-primary">
                  {h.specific_date && formatFecha(h.specific_date)}
                </p>
                <p className="mt-1 text-lg font-semibold">{h.time.slice(0, 5)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{h.location}</p>
                {h.notes && <p className="mt-2 text-xs text-muted-foreground">{h.notes}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/horarios" className="text-sm font-medium text-primary hover:underline">
              Ver todos los horarios →
            </Link>
          </div>
        </section>
      )}

      {noticias.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 font-serif text-2xl font-semibold">Últimas noticias</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {noticias.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {n.category}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-semibold group-hover:underline">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border bg-card p-8 text-center sm:p-12">
          <Heart className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-serif text-2xl font-semibold">
            {inicio["cta.donaciones_texto"] ??
              "Con tu diezmo y ofrenda ayudas a sostener la vida y las obras de nuestra parroquia."}
          </h2>
          <Link
            href="/donaciones"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Conocer formas de donar
          </Link>
        </div>
      </section>
    </>
  );
}
