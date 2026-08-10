import Link from "next/link";
import { ArrowUpRight, DollarSign, FileText, Image as ImageIcon, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: noticiasCount }, { count: imagenesCount }, { count: gruposCount }, { data: donaciones }] =
    await Promise.all([
      supabase.from("eventos_noticias").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("imagenes").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("grupos_parroquiales").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("donaciones").select("amount, status").eq("status", "completed"),
    ]);

  const totalDonaciones = (donaciones ?? []).reduce((sum, d) => sum + Number(d.amount), 0);

  const stats = [
    {
      label: "Noticias publicadas",
      value: String(noticiasCount ?? 0),
      icon: FileText,
      href: "/admin/noticias",
    },
    {
      label: "Imágenes activas",
      value: String(imagenesCount ?? 0),
      icon: ImageIcon,
      href: "/admin/imagenes",
    },
    {
      label: "Grupos activos",
      value: String(gruposCount ?? 0),
      icon: Users,
      href: "/admin/grupos",
    },
    {
      label: "Donaciones completadas",
      value: totalDonaciones.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),
      icon: DollarSign,
      href: "/admin/donaciones",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administración del sitio de la Parroquia Nuestra Señora del Carmen de Cachipay
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
            </div>
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
