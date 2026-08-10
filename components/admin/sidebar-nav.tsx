"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  Clock,
  Users,
  DollarSign,
  Wallet,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/admin/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Panel", exact: true },
  { href: "/admin/contenido", icon: Settings, label: "Contenido" },
  { href: "/admin/noticias", icon: FileText, label: "Noticias" },
  { href: "/admin/imagenes", icon: ImageIcon, label: "Imágenes" },
  { href: "/admin/horarios", icon: Clock, label: "Horarios" },
  { href: "/admin/grupos", icon: Users, label: "Grupos" },
  { href: "/admin/donaciones", icon: DollarSign, label: "Donaciones" },
  { href: "/admin/metodos-pago", icon: Wallet, label: "Métodos de pago" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col border-r bg-card">
      <div className="border-b px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            NSC
          </span>
          <div>
            <p className="text-sm font-semibold">Ntra. Sra. del Carmen</p>
            <p className="text-xs text-muted-foreground">Panel admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
        >
          Ver sitio público
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
