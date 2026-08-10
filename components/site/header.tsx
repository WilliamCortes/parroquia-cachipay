import Link from "next/link";
import { NAV_LINKS } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-serif">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            NSC
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block whitespace-nowrap text-sm font-semibold">
              Ntra. Sra. del Carmen
            </span>
            <span className="hidden whitespace-nowrap text-xs text-muted-foreground lg:block">
              Cachipay · Diócesis de Girardot
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            href="/donaciones"
            className="whitespace-nowrap rounded-md bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition-opacity hover:opacity-90"
          >
            Donaciones
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
