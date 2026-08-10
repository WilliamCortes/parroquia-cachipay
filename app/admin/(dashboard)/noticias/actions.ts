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

function revalidateNoticias(slug?: string) {
  revalidatePath("/noticias");
  revalidatePath("/");
  revalidatePath("/admin/noticias");
  if (slug) revalidatePath(`/noticias/${slug}`);
}

async function buildPayload(formData: FormData) {
  const title = String(formData.get("title"));
  const published = formData.get("published") === "on";

  const payload: Record<string, unknown> = {
    title,
    excerpt: String(formData.get("excerpt") ?? "") || null,
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? "noticia"),
    published,
    published_at: published ? new Date().toISOString() : null,
  };

  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    const coverFormData = new FormData();
    coverFormData.set("file", file);
    const { url } = await uploadImage(coverFormData, "noticias");
    payload.cover_image_url = url;
  }

  return { title, payload };
}

export async function createNoticia(formData: FormData) {
  const supabase = await requireUser();
  const { title, payload } = await buildPayload(formData);
  const slug = slugify(title);

  const { error } = await supabase.from("eventos_noticias").insert({ ...payload, slug });
  if (error) throw error;

  revalidateNoticias(slug);
  redirect("/admin/noticias");
}

export async function updateNoticia(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { payload } = await buildPayload(formData);

  const { data: existing } = await supabase
    .from("eventos_noticias")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  // Conserva la fecha de publicación original si ya estaba publicada
  if (existing?.published_at && payload.published) {
    payload.published_at = existing.published_at;
  }

  const { error } = await supabase.from("eventos_noticias").update(payload).eq("id", id);
  if (error) throw error;

  revalidateNoticias(existing?.slug);
  redirect("/admin/noticias");
}

export async function deleteNoticia(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  const { error } = await supabase.from("eventos_noticias").delete().eq("id", id);
  if (error) throw error;
  revalidateNoticias(slug);
}
