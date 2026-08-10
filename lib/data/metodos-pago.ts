import { createClient } from "@/lib/supabase/server";

export type MetodosPago = {
  wompi_enabled: boolean;
  paypal_enabled: boolean;
  breb_enabled: boolean;
  breb_qr_image_url: string | null;
  breb_alias: string | null;
  breb_bank_name: string | null;
};

export async function getMetodosPago(): Promise<MetodosPago> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("metodos_pago")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    (data as MetodosPago) ?? {
      wompi_enabled: false,
      paypal_enabled: false,
      breb_enabled: false,
      breb_qr_image_url: null,
      breb_alias: null,
      breb_bank_name: null,
    }
  );
}
