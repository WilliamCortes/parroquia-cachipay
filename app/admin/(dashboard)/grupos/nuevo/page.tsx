import { GrupoForm } from "@/components/admin/grupo-form";
import { createGrupo } from "../actions";

export default function NuevoGrupoPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Nuevo grupo</h1>
      <GrupoForm action={createGrupo} />
    </div>
  );
}
