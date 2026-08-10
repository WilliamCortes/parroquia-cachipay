import type { Metadata } from "next";
import { getContenido } from "@/lib/data/contenido";
import { PageHero } from "@/components/site/page-hero";

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
    <>
      <PageHero
        eyebrow="Vida sacramental"
        title="Sacramentos"
        description={contenido["intro.texto"]}
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="divide-y divide-border">
          {SACRAMENTOS.map((s) => {
            const texto = contenido[`${s.key}.texto`];
            return (
              <div key={s.key} className="py-7 first:pt-0">
                <h2 className="font-serif text-xl font-semibold text-carmelo">{s.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {texto ?? "Información próximamente. Comunícate con la parroquia para conocer los requisitos."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
