import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteGrupo, toggleGrupoActive } from "./actions";

export default async function GruposAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("grupos_parroquiales")
    .select("*")
    .order("sort_order");

  const grupos = data ?? [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grupos parroquiales</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ministerios y pastorales.</p>
        </div>
        <Button render={<Link href="/admin/grupos/nuevo" />}>
          <Plus className="size-4" /> Nuevo grupo
        </Button>
      </div>

      <div className="divide-y rounded-lg border bg-card">
        {grupos.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">Aún no hay grupos registrados.</p>
        )}
        {grupos.map((g) => (
          <div key={g.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              {g.image_url && (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={g.image_url} alt={g.name} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{g.name}</p>
                {g.meeting_info && <p className="text-xs text-muted-foreground">{g.meeting_info}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form action={toggleGrupoActive}>
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="active" value={String(g.active)} />
                <Button type="submit" variant="outline" size="sm">
                  {g.active ? "Activo" : "Inactivo"}
                </Button>
              </form>
              <Button
                render={<Link href={`/admin/grupos/${g.id}/editar`} />}
                variant="ghost"
                size="icon"
              >
                <Pencil className="size-4" />
              </Button>
              <form action={deleteGrupo}>
                <input type="hidden" name="id" value={g.id} />
                <ConfirmDeleteButton />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
