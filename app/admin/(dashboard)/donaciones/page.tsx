import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

const ESTADO_LABEL: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completada",
  failed: "Fallida",
  refunded: "Reembolsada",
};

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  completed: "default",
  failed: "destructive",
  refunded: "secondary",
};

export default async function DonacionesAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donaciones")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const donaciones = data ?? [];
  const totalCompletado = donaciones
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Donaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registro de donaciones recibidas por Wompi y PayPal. Las donaciones por Bre-B no se
          registran automáticamente aquí.
        </p>
      </div>

      <div className="mb-6 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Total completado</p>
        <p className="text-2xl font-bold">
          {totalCompletado.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Donante</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Pasarela</th>
              <th className="px-4 py-3">Propósito</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donaciones.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Aún no hay donaciones registradas.
                </td>
              </tr>
            )}
            {donaciones.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(d.created_at).toLocaleDateString("es-CO")}
                </td>
                <td className="px-4 py-3">{d.donor_name || d.donor_email || "Anónimo"}</td>
                <td className="px-4 py-3">
                  {Number(d.amount).toLocaleString("es-CO", { style: "currency", currency: d.currency })}
                </td>
                <td className="px-4 py-3 capitalize">{d.gateway}</td>
                <td className="px-4 py-3 capitalize">{d.purpose}</td>
                <td className="px-4 py-3">
                  <Badge variant={ESTADO_VARIANT[d.status] ?? "secondary"}>
                    {ESTADO_LABEL[d.status] ?? d.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
