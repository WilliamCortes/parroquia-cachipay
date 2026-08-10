"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/app/admin/actions/media";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return supabase;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateGrupos() {
  revalidatePath("/grupos");
  revalidatePath("/admin/grupos");
}

async function buildPayload(formData: FormData) {
  const name = String(formData.get("name"));
  const payload: Record<string, unknown> = {
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "") || null,
    meeting_info: String(formData.get("meeting_info") ?? "") || null,
    contact_name: String(formData.get("contact_name") ?? "") || null,
    contact_phone: String(formData.get("contact_phone") ?? "") || null,
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const { url } = await uploadImage(formData, "grupos");
    payload.image_url = url;
  }

  return payload;
}

export async function createGrupo(formData: FormData) {
  const supabase = await requireUser();
  const payload = await buildPayload(formData);
  const { error } = await supabase.from("grupos_parroquiales").insert(payload);
  if (error) throw error;
  revalidateGrupos();
  redirect("/admin/grupos");
}

export async function updateGrupo(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const payload = await buildPayload(formData);
  const { error } = await supabase.from("grupos_parroquiales").update(payload).eq("id", id);
  if (error) throw error;
  revalidateGrupos();
  redirect("/admin/grupos");
}

export async function deleteGrupo(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("grupos_parroquiales").delete().eq("id", id);
  if (error) throw error;
  revalidateGrupos();
}

export async function toggleGrupoActive(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  const { error } = await supabase.from("grupos_parroquiales").update({ active: !active }).eq("id", id);
  if (error) throw error;
  revalidateGrupos();
}
