"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-espresso-foreground hover:bg-white/10 hover:text-oro-pale"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-t border-oro/20 bg-espresso shadow-lg">
          <ul className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-espresso-foreground/85 hover:bg-white/5 hover:text-oro-pale"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/donaciones"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-oro px-3 py-2 text-center text-sm font-semibold text-espresso"
              >
                Donaciones
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
