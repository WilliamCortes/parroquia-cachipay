import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoticiaForm } from "@/components/admin/noticia-form";
import { updateNoticia } from "../../actions";

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: noticia } = await supabase
    .from("eventos_noticias")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!noticia) notFound();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Editar noticia</h1>
      <NoticiaForm action={updateNoticia} noticia={noticia} />
    </div>
  );
}
