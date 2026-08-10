"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "parroquia-media";

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const slug = base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return ext ? `${slug}.${ext}` : slug;
}

/** Sube una imagen a Storage. Requiere sesión admin activa; usa el cliente
 * service-role solo para el propio upload (bypassa RLS de Storage). */
export async function uploadImage(
  formData: FormData,
  section: string
): Promise<{ path: string; url: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Archivo inválido");
  }

  const path = `${section}/${randomUUID()}-${slugifyFilename(file.name)}`;
  const admin = createAdminClient();

  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteImageFromStorage(path: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([path]);
}
