import Link from "next/link";
import { NAV_LINKS } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { CarmelMark } from "./carmel-mark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-espresso text-espresso-foreground shadow-[0_1px_0_0_rgba(179,135,47,0.4)]">
      <div className="relative mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <CarmelMark className="size-9 shrink-0 text-oro" />
          <span className="hidden leading-tight sm:block">
            <span className="block whitespace-nowrap font-serif text-lg font-semibold tracking-wide text-espresso-foreground">
              Ntra. Sra. del Carmen
            </span>
            <span className="hidden whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] text-oro-pale/80 lg:block">
              Cachipay · Diócesis de Girardot
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-espresso-foreground/80 transition-colors hover:bg-white/5 hover:text-oro-pale"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            href="/donaciones"
            className="whitespace-nowrap rounded-full bg-oro px-5 py-2 text-sm font-semibold text-espresso transition-opacity hover:opacity-90"
          >
            Donaciones
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
