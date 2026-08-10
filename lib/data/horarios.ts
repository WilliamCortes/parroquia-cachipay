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
