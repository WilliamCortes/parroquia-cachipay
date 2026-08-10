import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Users } from "lucide-react";
import { getGruposActivos } from "@/lib/data/grupos";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Grupos parroquiales",
  description: "Grupos, ministerios y pastorales de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

export default async function GruposPage() {
  const grupos = await getGruposActivos();

  return (
    <>
      <PageHero
        eyebrow="Comunidad"
        title="Grupos parroquiales"
        description="Ministerios y pastorales que animan la vida de nuestra comunidad."
      />

      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        {grupos.length === 0 ? (
          <div className="rounded-sm border border-dashed border-oro/40 p-12 text-center text-muted-foreground">
            <Users className="mx-auto size-8 text-carmelo/60" />
            <p className="mt-4">
              Estamos organizando la información de nuestros grupos parroquiales. Muy pronto encontrarás
              aquí el listado completo con horarios de reunión y contacto.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {grupos.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-sm border border-border bg-card">
                {g.image_url && (
                  <div className="relative aspect-video">
                    <Image src={g.image_url} alt={g.name} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">{g.name}</h2>
                  {g.description && <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>}
                  {g.meeting_info && (
                    <p className="mt-3 text-sm text-foreground/80"><strong className="text-carmelo">Reuniones:</strong> {g.meeting_info}</p>
                  )}
                  {g.contact_phone && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="size-3.5 text-oro" /> {g.contact_name ?? "Contacto"}: {g.contact_phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
