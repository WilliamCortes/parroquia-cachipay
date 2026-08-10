import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GrupoForm } from "@/components/admin/grupo-form";
import { updateGrupo } from "../../actions";

export default async function EditarGrupoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: grupo } = await supabase
    .from("grupos_parroquiales")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!grupo) notFound();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Editar grupo</h1>
      <GrupoForm action={updateGrupo} grupo={grupo} />
    </div>
  );
}
