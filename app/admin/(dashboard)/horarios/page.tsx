import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { createHorario, deleteHorario, toggleHorarioActive } from "./actions";
import { nombreDia, type HorarioMisa } from "@/lib/data/horarios";

export default async function HorariosAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("horarios_misa")
    .select("*")
    .order("type")
    .order("sort_order");

  const rows = (data ?? []) as HorarioMisa[];
  const recurrentes = rows.filter((r) => r.type === "recurring");
  const especiales = rows.filter((r) => r.type === "special");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Horarios de misa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Horario semanal recurrente y fechas especiales.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Horario semanal</h2>
        <div className="divide-y rounded-lg border bg-card">
          {recurrentes.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Sin horarios recurrentes.</p>
          )}
          {recurrentes.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">
                  {nombreDia(h.day_of_week ?? 0)} · {h.time.slice(0, 5)} · {h.location}
                </p>
                {h.notes && <p className="text-xs text-muted-foreground">{h.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleHorarioActive}>
                  <input type="hidden" name="id" value={h.id} />
                  <input type="hidden" name="active" value={String(h.active)} />
                  <Button type="submit" variant="outline" size="sm">
                    {h.active ? "Activo" : "Inactivo"}
                  </Button>
                </form>
                <form action={deleteHorario}>
                  <input type="hidden" name="id" value={h.id} />
                  <ConfirmDeleteButton />
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={createHorario} className="mt-4 grid gap-3 rounded-lg border border-dashed p-4 sm:grid-cols-4">
          <input type="hidden" name="type" value="recurring" />
          <div>
            <Label className="text-xs">Día</Label>
            <Select name="day_of_week" required>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Día" /></SelectTrigger>
              <SelectContent>
                {["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d, i) => (
                  <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Hora</Label>
            <Input type="time" name="time" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Lugar</Label>
            <Input name="location" required className="mt-1" placeholder="Templo Parroquial" />
          </div>
          <div>
            <Label className="text-xs">Notas</Label>
            <Input name="notes" className="mt-1" />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" size="sm">Agregar horario</Button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Fechas especiales</h2>
        <div className="divide-y rounded-lg border bg-card">
          {especiales.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Sin fechas especiales.</p>
          )}
          {especiales.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">
                  {h.specific_date} · {h.time.slice(0, 5)} · {h.location}
                </p>
                {h.notes && <p className="text-xs text-muted-foreground">{h.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleHorarioActive}>
                  <input type="hidden" name="id" value={h.id} />
                  <input type="hidden" name="active" value={String(h.active)} />
                  <Button type="submit" variant="outline" size="sm">
                    {h.active ? "Activo" : "Inactivo"}
                  </Button>
                </form>
                <form action={deleteHorario}>
                  <input type="hidden" name="id" value={h.id} />
                  <ConfirmDeleteButton />
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={createHorario} className="mt-4 grid gap-3 rounded-lg border border-dashed p-4 sm:grid-cols-4">
          <input type="hidden" name="type" value="special" />
          <div>
            <Label className="text-xs">Fecha</Label>
            <Input type="date" name="specific_date" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Hora</Label>
            <Input type="time" name="time" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Lugar</Label>
            <Input name="location" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Notas</Label>
            <Input name="notes" className="mt-1" />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" size="sm">Agregar fecha especial</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
