"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const PATH_BY_PAGE: Record<string, string> = {
  inicio: "/",
  historia: "/historia",
  sacramentos: "/sacramentos",
  contacto: "/contacto",
};

export async function updateContenido(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const page = String(formData.get("page"));
  const section = String(formData.get("section"));
  const key = String(formData.get("key"));
  const value = String(formData.get("value") ?? "");

  const { error } = await supabase
    .from("contenido")
    .upsert({ page, section, key, value }, { onConflict: "page,section,key" });
  if (error) throw error;

  revalidatePath(PATH_BY_PAGE[page] ?? "/");
  revalidatePath("/admin/contenido");
}
