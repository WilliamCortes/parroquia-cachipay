import { createStaticClient } from "@/lib/supabase/static";

export type HorarioMisa = {
  id: string;
  type: "recurring" | "special";
  day_of_week: number | null;
  specific_date: string | null;
  time: string;
  location: string;
  notes: string | null;
  sort_order: number;
  active: boolean;
};

const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function nombreDia(dayOfWeek: number) {
  return DIAS[dayOfWeek] ?? "";
}

export async function getHorarios(): Promise<{
  recurrentes: HorarioMisa[];
  especiales: HorarioMisa[];
}> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("horarios_misa")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  const rows = (data ?? []) as HorarioMisa[];
  return {
    recurrentes: rows.filter((r) => r.type === "recurring"),
    especiales: rows.filter((r) => r.type === "special"),
  };
}

/** Fechas especiales próximas (hoy en adelante), para mostrar en Inicio. */
export async function getProximosEspeciales(limit = 3): Promise<HorarioMisa[]> {
  const supabase = createStaticClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("horarios_misa")
    .select("*")
    .eq("active", true)
    .eq("type", "special")
    .gte("specific_date", today)
    .order("specific_date", { ascending: true })
    .order("sort_order", { ascending: true })
    .limit(limit);

  return (data ?? []) as HorarioMisa[];
}

export type ProximaMisa = HorarioMisa & { diasFaltantes: number };

/**
 * Calcula la próxima misa del horario semanal recurrente a partir de la
 * hora actual (America/Bogota), para mostrar en Inicio cuando no hay
 * fechas especiales próximas.
 */
export async function getProximaMisaRecurrente(): Promise<ProximaMisa | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("horarios_misa")
    .select("*")
    .eq("active", true)
    .eq("type", "recurring")
    .order("sort_order", { ascending: true });

  const rows = (data ?? []) as HorarioMisa[];
  if (rows.length === 0) return null;

  const ahora = new Date();
  const hoyDia = ahora.getDay();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  let mejor: ProximaMisa | null = null;
  for (const h of rows) {
    if (h.day_of_week === null) continue;
    const [hh, mm] = h.time.split(":").map(Number);
    const minutosMisa = hh * 60 + mm;

    let diasFaltantes = (h.day_of_week - hoyDia + 7) % 7;
    if (diasFaltantes === 0 && minutosMisa <= minutosAhora) diasFaltantes = 7;

    if (!mejor || diasFaltantes < mejor.diasFaltantes) {
      mejor = { ...h, diasFaltantes };
    }
  }

  return mejor;
}
