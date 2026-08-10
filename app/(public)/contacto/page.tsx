import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getContenido } from "@/lib/data/contenido";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

export default async function ContactoPage() {
  const contacto = await getContenido("contacto");

  return (
    <>
      <PageHero
        eyebrow="Escríbenos"
        title="Contacto"
        description="Comunícate directamente con la parroquia."
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {contacto["info.telefono"] && (
            <a
              href={`tel:${contacto["info.telefono"].replace(/\s+/g, "")}`}
              className="flex items-center gap-4 rounded-sm border border-border bg-card p-6 transition-colors hover:border-oro/50"
            >
              <Phone className="size-5 text-oro" />
              <div>
                <p className="text-sm font-medium text-foreground">Teléfono</p>
                <p className="text-sm text-muted-foreground">{contacto["info.telefono"]}</p>
              </div>
            </a>
          )}
          {contacto["info.correo"] && (
            <a
              href={`mailto:${contacto["info.correo"]}`}
              className="flex items-center gap-4 rounded-sm border border-border bg-card p-6 transition-colors hover:border-oro/50"
            >
              <Mail className="size-5 text-oro" />
              <div>
                <p className="text-sm font-medium text-foreground">Correo</p>
                <p className="text-sm text-muted-foreground break-all">{contacto["info.correo"]}</p>
              </div>
            </a>
          )}
          {contacto["info.ubicacion"] && (
            <div className="flex items-center gap-4 rounded-sm border border-border bg-card p-6 sm:col-span-2">
              <MapPin className="size-5 text-oro" />
              <div>
                <p className="text-sm font-medium text-foreground">Ubicación</p>
                <p className="text-sm text-muted-foreground">{contacto["info.ubicacion"]}</p>
              </div>
            </div>
          )}
        </div>

        {contacto["info.parroco"] && (
          <p className="mt-10 font-serif text-lg text-carmelo">
            {contacto["info.parroco"]} — {contacto["info.diocesis"]}
          </p>
        )}
      </div>
    </>
  );
}
