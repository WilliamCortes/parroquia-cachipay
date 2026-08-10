import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { getHorarios, nombreDia } from "@/lib/data/horarios";
import { PageHero } from "@/components/site/page-hero";
import { SectionEyebrow } from "@/components/site/section-eyebrow";

export const metadata: Metadata = {
  title: "Horarios de misa",
  description: "Horario semanal de eucaristías y fechas especiales de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

function formatFechaLarga(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function HorariosPage() {
  const { recurrentes, especiales } = await getHorarios();

  const porDia = recurrentes.reduce<Record<number, typeof recurrentes>>((acc, h) => {
    const d = h.day_of_week ?? 0;
    (acc[d] ??= []).push(h);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Celébralo con nosotros"
        title="Horarios de misa"
        description="Horario semanal y celebraciones especiales del Templo Parroquial y las capillas de las veredas."
      />

      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <section>
          <SectionEyebrow>Cada semana</SectionEyebrow>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Horario semanal</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-sm border border-border bg-card">
            {Object.keys(porDia).length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">
                El horario semanal aún no ha sido confirmado. Comunícate con la parroquia para más información.
              </p>
            )}
            {Object.entries(porDia)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([dia, horas]) => (
                <div key={dia} className="flex flex-col gap-2 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <p className="font-serif text-lg font-semibold text-carmelo">{nombreDia(Number(dia))}</p>
                  <div className="space-y-1.5 sm:text-right">
                    {horas.map((h) => (
                      <div key={h.id} className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                        <Clock className="size-3.5 text-oro" />
                        <span className="font-medium text-foreground">{h.time.slice(0, 5)}</span>
                        <span>· {h.location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {recurrentes.some((h) => h.notes?.toLowerCase().includes("verificar")) && (
            <p className="mt-3 text-xs text-muted-foreground">
              * Horario preliminar, sujeto a confirmación por parte de la parroquia.
            </p>
          )}
        </section>

        {especiales.length > 0 && (
          <section className="mt-16">
            <SectionEyebrow>Fiesta patronal y celebraciones</SectionEyebrow>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Fechas especiales</h2>
            <div className="mt-6 space-y-3">
              {especiales.map((h) => (
                <div key={h.id} className="rounded-sm border border-border bg-card p-6">
                  <p className="font-serif text-base font-semibold capitalize text-carmelo">
                    {h.specific_date && formatFechaLarga(h.specific_date)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-oro" /> {h.time.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-oro" /> {h.location}
                    </span>
                  </div>
                  {h.notes && <p className="mt-2 text-sm text-foreground/80">{h.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
