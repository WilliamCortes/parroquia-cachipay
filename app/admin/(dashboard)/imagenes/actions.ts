"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImageFromStorage } from "@/app/admin/actions/media";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return supabase;
}

function revalidateImagenes(section: string) {
  revalidatePath("/admin/imagenes");
  const publicPaths: Record<string, string> = {
    hero: "/",
    historia: "/historia",
    galeria: "/galeria",
    grupos: "/grupos",
    sacramentos: "/sacramentos",
  };
  if (publicPaths[section]) revalidatePath(publicPaths[section]);
}

export async function createImagen(formData: FormData) {
  const supabase = await requireUser();
  const section = String(formData.get("section"));
  const alt = String(formData.get("alt") ?? "") || null;

  const { path, url } = await uploadImage(formData, section);

  const { error } = await supabase.from("imagenes").insert({
    storage_path: path,
    public_url: url,
    alt,
    section,
    active: true,
  });
  if (error) throw error;
  revalidateImagenes(section);
}

export async function deleteImagen(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const section = String(formData.get("section"));
  const storagePath = String(formData.get("storage_path"));

  const { error } = await supabase.from("imagenes").delete().eq("id", id);
  if (error) throw error;

  await deleteImageFromStorage(storagePath);
  revalidateImagenes(section);
}

export async function toggleImagenActive(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const section = String(formData.get("section"));
  const active = formData.get("active") === "true";

  const { error } = await supabase.from("imagenes").update({ active: !active }).eq("id", id);
  if (error) throw error;
  revalidateImagenes(section);
}
