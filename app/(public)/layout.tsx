import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFAB } from "@/components/site/whatsapp-fab";
import { getContenido } from "@/lib/data/contenido";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const SITE_TITLE = "Parroquia Nuestra Señora del Carmen de Cachipay";
const SITE_DESCRIPTION =
  "Sitio oficial de la Parroquia Nuestra Señora del Carmen de Cachipay, Diócesis de Girardot — horarios de misa, noticias, grupos parroquiales, sacramentos y donaciones.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const contacto = await getContenido("contacto");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: SITE_TITLE,
    url: appUrl,
    telephone: contacto["info.telefono"],
    email: contacto["info.correo"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cachipay",
      addressRegion: "Cundinamarca",
      addressCountry: "CO",
    },
    sameAs: [
      "https://www.facebook.com/p/Parroquia-Nuestra-Se%C3%B1ora-del-Carmen-de-Cachipay-100089425882395/",
      "https://www.instagram.com/parroquiadecachipay/",
    ],
  };

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFAB
          phone="573143127939"
          message="Hola, quisiera más información sobre la Parroquia Nuestra Señora del Carmen de Cachipay"
        />
      </body>
    </html>
  );
}
