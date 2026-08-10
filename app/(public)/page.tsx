import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Heart, MapPin } from "lucide-react";
import { getContenido } from "@/lib/data/contenido";
import { getProximosEspeciales } from "@/lib/data/horarios";
import { getNoticiasPublicadas } from "@/lib/data/noticias";
import { getImagenesPorSeccion } from "@/lib/data/imagenes";
import { CarmelMark } from "@/components/site/carmel-mark";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { OrnateFrame } from "@/components/site/ornate-frame";

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
      {/* HERO */}
      <section className="relative overflow-hidden bg-espresso">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt="Templo Parroquial Nuestra Señora del Carmen de Cachipay"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 via-transparent to-transparent" />
        </div>

        <CarmelMark className="pointer-events-none absolute -right-16 -top-16 size-[26rem] text-oro/[0.07]" />

        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-40 sm:px-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-oro" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-oro-pale">
              {inicio["hero.subtitulo"] ?? "Diócesis de Girardot · Cachipay, Cundinamarca"}
            </p>
          </div>
          <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-pergamino sm:text-6xl lg:text-7xl">
            {inicio["hero.titulo"] ?? "Parroquia Nuestra Señora del Carmen de Cachipay"}
          </h1>
          <p className="mt-6 max-w-lg text-pergamino/70">
            Setenta años acompañando a Cachipay y sus veredas en la fe, los sacramentos y la
            devoción a la Virgen del Carmen.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 rounded-full bg-pergamino px-6 py-3.5 text-sm font-semibold text-espresso transition-colors hover:bg-white"
            >
              <CalendarDays className="size-4" />
              Ver horarios de misa
            </Link>
            <Link
              href="/donaciones"
              className="inline-flex items-center gap-2 rounded-full border border-oro/60 px-6 py-3.5 text-sm font-semibold text-oro-pale transition-colors hover:bg-oro/10"
            >
              <Heart className="size-4" />
              Donaciones y diezmos
            </Link>
          </div>
        </div>
      </section>

      {/* EXPLORAR */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionEyebrow>Vida parroquial</SectionEyebrow>
        <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          Una comunidad de fe en las montañas de Cundinamarca
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { href: "/horarios", label: "Horarios de misa", icon: Clock },
            { href: "/historia", label: "Nuestra historia", icon: CarmelMark },
            { href: "/grupos", label: "Grupos parroquiales", icon: MapPin },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group flex flex-col items-center text-center">
              <div className="flex size-32 items-center justify-center rounded-full border border-oro/40 bg-secondary transition-colors group-hover:border-oro group-hover:bg-oro/10">
                <item.icon className="size-10 text-carmelo" />
              </div>
              <p className="mt-5 font-serif text-lg font-semibold text-foreground group-hover:text-carmelo">
                {item.label}
              </p>
              <span className="mt-1 h-px w-6 bg-oro transition-all group-hover:w-10" />
            </Link>
          ))}
        </div>
      </section>

      {/* HORARIOS — sección oscura con marco ornamental */}
      <section className="relative overflow-hidden bg-espresso py-20 text-espresso-foreground">
        <CarmelMark className="pointer-events-none absolute -left-10 bottom-0 size-72 text-oro/[0.06]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <SectionEyebrow tone="dark">Celébralo con nosotros</SectionEyebrow>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Horarios de misa</h2>
          </div>

          <OrnateFrame className="mx-auto mt-10 max-w-2xl">
            {proximos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-3">
                {proximos.map((h) => (
                  <div key={h.id} className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-oro-pale">
                      {h.specific_date && formatFecha(h.specific_date)}
                    </p>
                    <p className="mt-2 font-serif text-2xl font-semibold">{h.time.slice(0, 5)}</p>
                    <p className="mt-1 text-sm text-espresso-foreground/60">{h.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-espresso-foreground/70">
                Consulta el horario semanal completo y las próximas celebraciones especiales.
              </p>
            )}
            <div className="mt-8 text-center">
              <Link
                href="/horarios"
                className="inline-flex items-center gap-2 text-sm font-semibold text-oro-pale hover:underline"
              >
                Ver todos los horarios →
              </Link>
            </div>
          </OrnateFrame>
        </div>
      </section>

      {/* NOTICIAS */}
      {noticias.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionEyebrow>Al día</SectionEyebrow>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Noticias y avisos
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {noticias.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="group rounded-sm border border-border bg-card p-6 transition-colors hover:border-oro/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-carmelo">
                  {n.category}
                </p>
                <h3 className="mt-3 font-serif text-xl font-semibold text-foreground group-hover:text-carmelo">
                  {n.title}
                </h3>
                {n.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA DONACIONES */}
      <section className="relative overflow-hidden bg-carmelo py-24 text-pergamino">
        <CarmelMark className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 text-pergamino/[0.06]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Heart className="mx-auto size-7 text-oro-pale" />
          <h2 className="mt-5 font-serif text-3xl font-semibold sm:text-4xl">
            {inicio["cta.donaciones_texto"] ??
              "Con tu diezmo y ofrenda ayudas a sostener la vida y las obras de nuestra parroquia."}
          </h2>
          <Link
            href="/donaciones"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-oro px-7 py-3.5 text-sm font-semibold text-espresso transition-opacity hover:opacity-90"
          >
            Conocer formas de donar
          </Link>
        </div>
      </section>
    </>
  );
}
