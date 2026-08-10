import Image from "next/image";
import { Upload } from "lucide-react";
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
import { createImagen, deleteImagen, toggleImagenActive } from "./actions";

const SECTIONS = [
  { value: "hero", label: "Portada (Inicio)" },
  { value: "historia", label: "Historia" },
  { value: "galeria", label: "Galería" },
  { value: "grupos", label: "Grupos" },
  { value: "sacramentos", label: "Sacramentos" },
  { value: "breb", label: "Bre-B (QR)" },
  { value: "general", label: "General" },
];

export default async function ImagenesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("imagenes").select("*").order("sort_order");
  if (section) query = query.eq("section", section);
  const { data } = await query;
  const imagenes = data ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Imágenes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona las imágenes usadas en el sitio público.
        </p>
      </div>

      <form action={createImagen} className="mb-8 grid gap-3 rounded-lg border border-dashed p-5 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Sección</Label>
          <Select name="section" required defaultValue="galeria">
            <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SECTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Texto alternativo</Label>
          <Input name="alt" className="mt-1" placeholder="Descripción de la imagen" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Archivo</Label>
          <Input name="file" type="file" accept="image/*" required className="mt-1" />
        </div>
        <div className="sm:col-span-4">
          <Button type="submit" size="sm">
            <Upload className="size-4" /> Subir imagen
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {imagenes.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">Sin imágenes todavía.</p>
        )}
        {imagenes.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-square bg-secondary">
              <Image src={img.public_url} alt={img.alt ?? ""} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium">{img.alt || "(sin descripción)"}</p>
              <p className="text-xs capitalize text-muted-foreground">{img.section}</p>
              <div className="mt-2 flex items-center justify-between">
                <form action={toggleImagenActive}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="section" value={img.section} />
                  <input type="hidden" name="active" value={String(img.active)} />
                  <Button type="submit" variant="outline" size="sm">
                    {img.active ? "Activa" : "Inactiva"}
                  </Button>
                </form>
                <form action={deleteImagen}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="section" value={img.section} />
                  <input type="hidden" name="storage_path" value={img.storage_path} />
                  <ConfirmDeleteButton />
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
