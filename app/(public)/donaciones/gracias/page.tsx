import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="mx-auto size-12 text-primary" />
      <h1 className="mt-4 font-serif text-3xl font-semibold">¡Gracias por tu donación!</h1>
      <p className="mt-3 text-muted-foreground">
        Tu aporte ayuda a sostener la vida y las obras de la Parroquia Nuestra Señora del Carmen
        de Cachipay. Recibirás la confirmación una vez el pago sea procesado.
      </p>
      {id && <p className="mt-2 text-xs text-muted-foreground">Referencia: {id}</p>}
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
