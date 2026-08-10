import type { Metadata } from "next";
import { CreditCard, QrCode } from "lucide-react";
import Image from "next/image";
import { getMetodosPago } from "@/lib/data/metodos-pago";
import { getContenido } from "@/lib/data/contenido";
import { WompiButton } from "@/components/payments/wompi-button";
import { PaypalButton } from "@/components/payments/paypal-button";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Donaciones y diezmos",
  description: "Formas de apoyar a la Parroquia Nuestra Señora del Carmen de Cachipay con tu diezmo, ofrenda o donación.",
};

export const revalidate = 3600;

export default async function DonacionesPage() {
  const [metodos, inicio] = await Promise.all([getMetodosPago(), getContenido("inicio")]);
  const ningunoActivo = !metodos.wompi_enabled && !metodos.paypal_enabled && !metodos.breb_enabled;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <>
      <PageHero
        eyebrow="Sostén la misión"
        title="Donaciones y diezmos"
        description={
          inicio["cta.donaciones_texto"] ??
          "Con tu diezmo y ofrenda ayudas a sostener la vida y las obras de nuestra parroquia."
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        {ningunoActivo && (
          <div className="rounded-sm border border-dashed border-oro/40 p-10 text-center text-muted-foreground">
            <p>
              Estamos habilitando los medios de pago en línea. Mientras tanto, comunícate con la
              parroquia para conocer cómo hacer tu donación.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {metodos.wompi_enabled && (
            <div className="rounded-sm border border-border bg-card p-7">
              <CreditCard className="size-6 text-oro" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">Tarjeta, PSE o Nequi</h2>
              <p className="mt-1 text-sm text-muted-foreground">Paga en línea desde Colombia con Wompi.</p>
              <div className="mt-5">
                <WompiButton />
              </div>
            </div>
          )}

          {metodos.paypal_enabled && paypalClientId && (
            <div className="rounded-sm border border-border bg-card p-7">
              <CreditCard className="size-6 text-oro" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">PayPal</h2>
              <p className="mt-1 text-sm text-muted-foreground">Donaciones internacionales con PayPal.</p>
              <div className="mt-5">
                <PaypalButton clientId={paypalClientId} />
              </div>
            </div>
          )}

          {metodos.breb_enabled && metodos.breb_qr_image_url && (
            <div className="rounded-sm border border-border bg-card p-7 sm:col-span-2">
              <QrCode className="size-6 text-oro" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">Bre-B</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Escanea el código o usa la llave{" "}
                {metodos.breb_alias && <strong className="text-foreground">{metodos.breb_alias}</strong>} desde tu app bancaria.
              </p>
              <div className="relative mt-5 aspect-square w-48 overflow-hidden rounded-sm border border-border">
                <Image src={metodos.breb_qr_image_url} alt="Código QR Bre-B" fill className="object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
