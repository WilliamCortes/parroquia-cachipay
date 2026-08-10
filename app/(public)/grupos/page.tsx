import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Users } from "lucide-react";
import { getGruposActivos } from "@/lib/data/grupos";

export const metadata: Metadata = {
  title: "Grupos parroquiales",
  description: "Grupos, ministerios y pastorales de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

export default async function GruposPage() {
  const grupos = await getGruposActivos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Grupos parroquiales</h1>
      <p className="mt-3 text-muted-foreground">
        Ministerios y pastorales que animan la vida de nuestra comunidad.
      </p>

      {grupos.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <Users className="mx-auto size-8 opacity-60" />
          <p className="mt-3">
            Estamos organizando la información de nuestros grupos parroquiales. Muy pronto encontrarás
            aquí el listado completo con horarios de reunión y contacto.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {grupos.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-lg border bg-card">
              {g.image_url && (
                <div className="relative aspect-video">
                  <Image src={g.image_url} alt={g.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-serif text-lg font-semibold">{g.name}</h2>
                {g.description && <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>}
                {g.meeting_info && (
                  <p className="mt-2 text-sm"><strong>Reuniones:</strong> {g.meeting_info}</p>
                )}
                {g.contact_phone && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="size-3.5" /> {g.contact_name ?? "Contacto"}: {g.contact_phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
