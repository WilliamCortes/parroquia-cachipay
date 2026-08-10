import { NoticiaForm } from "@/components/admin/noticia-form";
import { createNoticia } from "../actions";

export default function NuevaNoticiaPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Nueva noticia</h1>
      <NoticiaForm action={createNoticia} />
    </div>
  );
}
