"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return supabase;
}

function revalidateHorarios() {
  revalidatePath("/horarios");
  revalidatePath("/");
  revalidatePath("/admin/horarios");
}

export async function createHorario(formData: FormData) {
  const supabase = await requireUser();
  const type = String(formData.get("type"));
  const time = String(formData.get("time"));
  const location = String(formData.get("location"));
  const notes = String(formData.get("notes") ?? "") || null;

  const payload: Record<string, unknown> = { type, time, location, notes, active: true };
  if (type === "recurring") {
    payload.day_of_week = Number(formData.get("day_of_week"));
  } else {
    payload.specific_date = String(formData.get("specific_date"));
  }

  const { error } = await supabase.from("horarios_misa").insert(payload);
  if (error) throw error;
  revalidateHorarios();
}

export async function deleteHorario(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("horarios_misa").delete().eq("id", id);
  if (error) throw error;
  revalidateHorarios();
}

export async function toggleHorarioActive(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  const { error } = await supabase.from("horarios_misa").update({ active: !active }).eq("id", id);
  if (error) throw error;
  revalidateHorarios();
}
