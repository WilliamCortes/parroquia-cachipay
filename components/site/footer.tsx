import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getContenido } from "@/lib/data/contenido";
import { NAV_LINKS } from "./nav-links";
import { CarmelMark } from "./carmel-mark";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.507 17.523 2 12 2S2 6.507 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465a4.9 4.9 0 011.771 1.153 4.9 4.9 0 011.153 1.771c.248.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122s-.01 3.056-.06 4.122c-.05 1.065-.217 1.79-.465 2.428a4.9 4.9 0 01-1.153 1.771 4.9 4.9 0 01-1.771 1.153c-.637.248-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06s-3.056-.01-4.122-.06c-1.065-.05-1.79-.217-2.428-.465a4.9 4.9 0 01-1.771-1.153 4.9 4.9 0 01-1.153-1.771c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12s.01-3.056.06-4.122c.05-1.065.217-1.79.465-2.428a4.9 4.9 0 011.153-1.771A4.9 4.9 0 015.449 2.525c.637-.248 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.25-8.463a1.163 1.163 0 100-2.325 1.163 1.163 0 000 2.325z" />
    </svg>
  );
}

export async function Footer() {
  const contacto = await getContenido("contacto");

  return (
    <footer className="mt-24 border-t border-oro/25 bg-espresso text-espresso-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <CarmelMark className="size-8 text-oro" />
            <p className="mt-3 font-serif text-lg font-semibold">
              Ntra. Señora del Carmen
            </p>
            <p className="mt-1 text-sm text-espresso-foreground/60">
              {contacto["info.diocesis"] ?? "Diócesis de Girardot"} · Cachipay, Cundinamarca
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-oro-pale">Navegación</p>
            <ul className="mt-4 space-y-2.5 text-sm text-espresso-foreground/70">
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-oro-pale">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-oro-pale">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-sm text-espresso-foreground/70">
              {contacto["info.telefono"] && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-oro" />
                  <a href={`tel:${contacto["info.telefono"].replace(/\s+/g, "")}`} className="hover:text-oro-pale">
                    {contacto["info.telefono"]}
                  </a>
                </li>
              )}
              {contacto["info.correo"] && (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-oro" />
                  <a href={`mailto:${contacto["info.correo"]}`} className="hover:text-oro-pale break-all">
                    {contacto["info.correo"]}
                  </a>
                </li>
              )}
              {contacto["info.ubicacion"] && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-oro" />
                  <span>{contacto["info.ubicacion"]}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-oro-pale">Síguenos</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.facebook.com/p/Parroquia-Nuestra-Se%C3%B1ora-del-Carmen-de-Cachipay-100089425882395/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-oro/30 text-oro-pale hover:bg-white/5"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/parroquiadecachipay/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-oro/30 text-oro-pale hover:bg-white/5"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-oro/15 pt-6 text-xs text-espresso-foreground/50">
          © {new Date().getFullYear()} Parroquia Nuestra Señora del Carmen de Cachipay.
        </div>
      </div>
    </footer>
  );
}
