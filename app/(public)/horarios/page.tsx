import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { getHorarios, nombreDia } from "@/lib/data/horarios";

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Horarios de misa</h1>
      <p className="mt-3 text-muted-foreground">
        Horario semanal y celebraciones especiales del Templo Parroquial y las capillas de las veredas.
      </p>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold">Horario semanal</h2>
        <div className="mt-4 divide-y rounded-lg border bg-card">
          {Object.keys(porDia).length === 0 && (
            <p className="p-5 text-sm text-muted-foreground">
              El horario semanal aún no ha sido confirmado. Comunícate con la parroquia para más información.
            </p>
          )}
          {Object.entries(porDia)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([dia, horas]) => (
              <div key={dia} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
                <p className="font-medium">{nombreDia(Number(dia))}</p>
                <div className="space-y-1 sm:text-right">
                  {horas.map((h) => (
                    <div key={h.id} className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                      <Clock className="size-3.5" />
                      <span>{h.time.slice(0, 5)}</span>
                      <span className="text-foreground/70">· {h.location}</span>
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
        <section className="mt-14">
          <h2 className="font-serif text-xl font-semibold">Fechas especiales</h2>
          <div className="mt-4 space-y-3">
            {especiales.map((h) => (
              <div key={h.id} className="rounded-lg border bg-card p-5">
                <p className="text-sm font-medium capitalize text-primary">
                  {h.specific_date && formatFechaLarga(h.specific_date)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {h.time.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {h.location}
                  </span>
                </div>
                {h.notes && <p className="mt-2 text-sm">{h.notes}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
