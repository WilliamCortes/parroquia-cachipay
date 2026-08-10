import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateContenido } from "./actions";

const PAGE_LABELS: Record<string, string> = {
  inicio: "Inicio",
  historia: "Historia",
  sacramentos: "Sacramentos",
  contacto: "Contacto",
};

export default async function ContenidoAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contenido")
    .select("*")
    .order("page")
    .order("section")
    .order("key");

  const rows = data ?? [];
  const byPage = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    (acc[row.page] ??= []).push(row);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Contenido</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Textos editables de las páginas públicas del sitio.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(byPage).map(([page, items]) => (
          <div key={page}>
            <h2 className="mb-3 text-lg font-semibold">{PAGE_LABELS[page] ?? page}</h2>
            <div className="space-y-3">
              {items.map((row) => (
                <form
                  key={row.id}
                  action={updateContenido}
                  className="rounded-lg border bg-card p-4"
                >
                  <input type="hidden" name="page" value={row.page} />
                  <input type="hidden" name="section" value={row.section} />
                  <input type="hidden" name="key" value={row.key} />
                  <Label className="text-xs text-muted-foreground">
                    {row.section} · {row.key}
                  </Label>
                  <Textarea
                    name="value"
                    defaultValue={row.value}
                    className="mt-1.5"
                    rows={row.value.length > 200 ? 4 : 2}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" size="sm">
                      Guardar
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-dashed p-5">
        <h2 className="text-sm font-semibold">Agregar nuevo texto</h2>
        <form action={updateContenido} className="mt-3 grid gap-3 sm:grid-cols-4">
          <div>
            <Label className="text-xs">Página</Label>
            <Input name="page" placeholder="inicio" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Sección</Label>
            <Input name="section" placeholder="hero" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Clave</Label>
            <Input name="key" placeholder="titulo" required className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Valor</Label>
            <Input name="value" required className="mt-1" />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" size="sm">
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
