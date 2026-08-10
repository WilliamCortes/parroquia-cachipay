import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/admin/sidebar-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Segunda verificación server-side: el proxy ya redirige, pero cada
  // Server Component debe validar la sesión por su cuenta (no confiar solo en el proxy).
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}
