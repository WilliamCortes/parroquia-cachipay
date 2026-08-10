import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateMetodosPago } from "./actions";

export default async function MetodosPagoAdminPage() {
  const supabase = await createClient();
  const { data: metodos } = await supabase
    .from("metodos_pago")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Métodos de pago</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activa o desactiva cada pasarela y configura los datos de Bre-B.
        </p>
      </div>

      <form action={updateMetodosPago} className="max-w-xl space-y-6">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2">
            <Checkbox id="wompi_enabled" name="wompi_enabled" defaultChecked={metodos?.wompi_enabled} />
            <Label htmlFor="wompi_enabled" className="font-normal">
              Activar Wompi (tarjeta, PSE, Nequi)
            </Label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Requiere configurar las llaves de Wompi en las variables de entorno del servidor.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2">
            <Checkbox id="paypal_enabled" name="paypal_enabled" defaultChecked={metodos?.paypal_enabled} />
            <Label htmlFor="paypal_enabled" className="font-normal">
              Activar PayPal
            </Label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Requiere configurar las credenciales de PayPal en las variables de entorno del servidor.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2">
            <Checkbox id="breb_enabled" name="breb_enabled" defaultChecked={metodos?.breb_enabled} />
            <Label htmlFor="breb_enabled" className="font-normal">
              Activar Bre-B (QR / llave estática)
            </Label>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="breb_alias">Llave / alias</Label>
              <Input id="breb_alias" name="breb_alias" defaultValue={metodos?.breb_alias ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="breb_bank_name">Banco</Label>
              <Input id="breb_bank_name" name="breb_bank_name" defaultValue={metodos?.breb_bank_name ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="breb_qr">
                Código QR {metodos?.breb_qr_image_url && "(dejar vacío para conservar el actual)"}
              </Label>
              {metodos?.breb_qr_image_url && (
                <div className="relative mt-2 size-32 overflow-hidden rounded-lg border">
                  <Image src={metodos.breb_qr_image_url} alt="QR Bre-B actual" fill className="object-contain" />
                </div>
              )}
              <Input id="breb_qr" name="breb_qr" type="file" accept="image/*" className="mt-2" />
            </div>
          </div>
        </div>

        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
