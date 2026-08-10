import type { Metadata } from "next";
import { getContenido } from "@/lib/data/contenido";

export const metadata: Metadata = {
  title: "Sacramentos",
  description: "Información sobre bautizo, primera comunión, confirmación, matrimonio y demás sacramentos.",
};

export const revalidate = 3600;

const SACRAMENTOS = [
  { key: "bautizo", label: "Bautizo" },
  { key: "primera_comunion", label: "Primera comunión" },
  { key: "confirmacion", label: "Confirmación" },
  { key: "matrimonio", label: "Matrimonio" },
  { key: "confesion", label: "Confesión" },
  { key: "uncion", label: "Unción de los enfermos" },
];

export default async function SacramentosPage() {
  const contenido = await getContenido("sacramentos");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Sacramentos</h1>
      {contenido["intro.texto"] && (
        <p className="mt-4 text-muted-foreground">{contenido["intro.texto"]}</p>
      )}

      <div className="mt-10 divide-y rounded-lg border bg-card">
        {SACRAMENTOS.map((s) => {
          const texto = contenido[`${s.key}.texto`];
          return (
            <div key={s.key} className="p-6">
              <h2 className="font-serif text-lg font-semibold">{s.label}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {texto ?? "Información próximamente. Comunícate con la parroquia para conocer los requisitos."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
