"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/app/admin/actions/media";

export async function updateMetodosPago(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const payload: Record<string, unknown> = {
    id: 1,
    wompi_enabled: formData.get("wompi_enabled") === "on",
    paypal_enabled: formData.get("paypal_enabled") === "on",
    breb_enabled: formData.get("breb_enabled") === "on",
    breb_alias: String(formData.get("breb_alias") ?? "") || null,
    breb_bank_name: String(formData.get("breb_bank_name") ?? "") || null,
  };

  const file = formData.get("breb_qr");
  if (file instanceof File && file.size > 0) {
    const qrFormData = new FormData();
    qrFormData.set("file", file);
    const { url } = await uploadImage(qrFormData, "breb");
    payload.breb_qr_image_url = url;
  }

  const { error } = await supabase.from("metodos_pago").upsert(payload, { onConflict: "id" });
  if (error) throw error;

  revalidatePath("/donaciones");
  revalidatePath("/admin/metodos-pago");
}
