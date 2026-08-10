"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Grupo = {
  id: string;
  name: string;
  description: string | null;
  meeting_info: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  image_url: string | null;
};

export function GrupoForm({
  action,
  grupo,
}: {
  action: (formData: FormData) => void;
  grupo?: Grupo;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      {grupo && <input type="hidden" name="id" value={grupo.id} />}

      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required defaultValue={grupo?.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={grupo?.description ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="meeting_info">Horario de reuniones</Label>
        <Input
          id="meeting_info"
          name="meeting_info"
          placeholder="Sábados 4:00 p.m., Salón parroquial"
          defaultValue={grupo?.meeting_info ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact_name">Contacto</Label>
          <Input id="contact_name" name="contact_name" defaultValue={grupo?.contact_name ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Teléfono</Label>
          <Input id="contact_phone" name="contact_phone" defaultValue={grupo?.contact_phone ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file">Imagen {grupo?.image_url && "(dejar vacío para conservar la actual)"}</Label>
        <Input id="file" name="file" type="file" accept="image/*" />
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
}
