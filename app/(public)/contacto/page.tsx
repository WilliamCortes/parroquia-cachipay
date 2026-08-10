import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getContenido } from "@/lib/data/contenido";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto de la Parroquia Nuestra Señora del Carmen de Cachipay.",
};

export const revalidate = 3600;

export default async function ContactoPage() {
  const contacto = await getContenido("contacto");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Contacto</h1>
      <p className="mt-3 text-muted-foreground">
        Escríbenos o comunícate directamente con la parroquia.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {contacto["info.telefono"] && (
          <a
            href={`tel:${contacto["info.telefono"].replace(/\s+/g, "")}`}
            className="flex items-center gap-3 rounded-lg border bg-card p-5 hover:shadow-md"
          >
            <Phone className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">{contacto["info.telefono"]}</p>
            </div>
          </a>
        )}
        {contacto["info.correo"] && (
          <a
            href={`mailto:${contacto["info.correo"]}`}
            className="flex items-center gap-3 rounded-lg border bg-card p-5 hover:shadow-md"
          >
            <Mail className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Correo</p>
              <p className="text-sm text-muted-foreground break-all">{contacto["info.correo"]}</p>
            </div>
          </a>
        )}
        {contacto["info.ubicacion"] && (
          <div className="flex items-center gap-3 rounded-lg border bg-card p-5 sm:col-span-2">
            <MapPin className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Ubicación</p>
              <p className="text-sm text-muted-foreground">{contacto["info.ubicacion"]}</p>
            </div>
          </div>
        )}
      </div>

      {contacto["info.parroco"] && (
        <p className="mt-8 text-sm text-muted-foreground">
          {contacto["info.parroco"]} — {contacto["info.diocesis"]}
        </p>
      )}
    </div>
  );
}
