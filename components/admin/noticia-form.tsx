"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./rich-text-editor";

type Noticia = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string;
  published: boolean;
  cover_image_url: string | null;
};

export function NoticiaForm({
  action,
  noticia,
}: {
  action: (formData: FormData) => void;
  noticia?: Noticia;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      {noticia && <input type="hidden" name="id" value={noticia.id} />}

      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required defaultValue={noticia?.title} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Resumen corto</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={noticia?.excerpt ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Categoría</Label>
          <Select name="category" defaultValue={noticia?.category ?? "noticia"}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="noticia">Noticia</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="aviso">Aviso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cover">Imagen de portada {noticia?.cover_image_url && "(dejar vacío para conservar)"}</Label>
          <Input id="cover" name="cover" type="file" accept="image/*" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Contenido</Label>
        <RichTextEditor name="body" defaultValue={noticia?.body ?? ""} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="published" name="published" defaultChecked={noticia?.published} />
        <Label htmlFor="published" className="font-normal">Publicar en el sitio</Label>
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
}
