import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteNoticia } from "./actions";

export default async function NoticiasAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos_noticias")
    .select("*")
    .order("created_at", { ascending: false });

  const noticias = data ?? [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Noticias</h1>
          <p className="mt-1 text-sm text-muted-foreground">Noticias, avisos y eventos.</p>
        </div>
        <Button render={<Link href="/admin/noticias/nuevo" />}>
          <Plus className="size-4" /> Nueva noticia
        </Button>
      </div>

      <div className="divide-y rounded-lg border bg-card">
        {noticias.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">Aún no hay noticias.</p>
        )}
        {noticias.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                <Badge variant={n.published ? "default" : "secondary"}>
                  {n.published ? "Publicada" : "Borrador"}
                </Badge>
              </div>
              <p className="text-xs capitalize text-muted-foreground">{n.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                render={<Link href={`/admin/noticias/${n.id}/editar`} />}
                variant="ghost"
                size="icon"
              >
                <Pencil className="size-4" />
              </Button>
              <form action={deleteNoticia}>
                <input type="hidden" name="id" value={n.id} />
                <input type="hidden" name="slug" value={n.slug} />
                <ConfirmDeleteButton />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
