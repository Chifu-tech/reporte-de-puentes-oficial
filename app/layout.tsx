import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Asistente from "@/components/Asistente";
import JsonLd from "@/components/JsonLd";
import "./globals.css";
import { sortedCities } from "@/lib/crossings";
import { site, absoluteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} y Garitas EN VIVO — Tiempo de espera hoy México–EU`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  keywords: [
    "reporte de puentes",
    "reporte de garitas",
    "como esta la linea",
    "tiempo de espera garita",
    "reporte de cruces",
    "puentes internacionales",
    "tiempo de cruce",
    "línea en los puentes",
    "cruzar a estados unidos",
    "puentes ciudad juárez",
    "puentes tijuana",
    "puentes reynosa",
    "puentes nuevo laredo",
    "puentes mexicali",
    "puentes nogales",
    "puentes matamoros",
    "cruce peatonal",
    "cámaras de puentes en vivo",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — Tiempo de espera en puentes fronterizos México–EU`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Tiempos de espera en puentes México–EU`,
    description: site.description,
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  ...(site.ads.client ? { other: { "google-adsense-account": site.ads.client } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#171613" },
  ],
};

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#ciudades", label: "Ciudades" },
  { href: "/mejor-hora-para-cruzar", label: "Mejor hora" },
  { href: "/camaras-en-vivo", label: "Cámaras" },
  { href: "/guias", label: "Guías" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": absoluteUrl("/#organization"),
                name: site.name,
                url: site.url,
                logo: absoluteUrl("/icon-512.png"),
                email: site.email,
              },
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: site.name,
                alternateName: [site.brand, "Reporte de Garitas"],
                url: site.url,
                inLanguage: "es-MX",
                description: site.description,
                publisher: { "@id": absoluteUrl("/#organization") },
              },
            ],
          }}
        />
        <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — inicio`}>
              <span className="font-display text-[20px] leading-none tracking-tight text-ink">
                Reporte de <em className="text-sage-ink">Puentes</em>
              </span>
              <span className="rounded-full border border-sage/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sage-ink">
                Oficial
              </span>
              <span className="hidden items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-sage-ink sm:inline-flex">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-verde" aria-hidden />
                En vivo
              </span>
            </Link>
            <nav
              aria-label="Principal"
              className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-medium text-ink-soft"
            >
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="transition-colors hover:text-sage-ink">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t border-line bg-surface">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
            <div>
              <p className="font-display text-[19px] tracking-tight text-ink">
                Reporte de <em className="text-sage-ink">Puentes</em> Oficial
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                Los tiempos de espera en vivo de todos los puentes y garitas entre México y
                Estados Unidos. Sin registro.
              </p>
              <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
                Datos del portal público de U.S. Customs and Border Protection (CBP). Los tiempos
                son estimados y pueden variar. Proyecto independiente, sin afiliación con CBP.
              </p>
            </div>
            <nav aria-label="Puentes y garitas por ciudad" className="text-[13px] text-ink-soft md:col-span-2">
              <p className="mb-2 font-semibold text-ink">Puentes y garitas por ciudad</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                {sortedCities.map((c) => (
                  <li key={c.slug}>
                    <Link className="hover:text-sage-ink" href={`/ciudad/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Footer" className="text-[13px] text-ink-soft">
              <p className="mb-2 font-semibold text-ink">Sitio</p>
              <ul className="space-y-1.5">
                <li><Link className="hover:text-sage-ink" href="/mejor-hora-para-cruzar">Mejor hora para cruzar</Link></li>
                <li><Link className="hover:text-sage-ink" href="/horarios-puentes-internacionales">Horarios de los puentes</Link></li>
                <li><Link className="hover:text-sage-ink" href="/camaras-en-vivo">Cámaras en vivo</Link></li>
                <li><Link className="hover:text-sage-ink" href="/guias">Guías para cruzar</Link></li>
                <li><Link className="hover:text-sage-ink" href="/nosotros">Nosotros</Link></li>
                <li><Link className="hover:text-sage-ink" href="/contacto">Contacto</Link></li>
                <li><Link className="hover:text-sage-ink" href="/privacidad">Privacidad</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-line-soft">
            <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-ink-faint sm:px-6">
              © {new Date().getFullYear()} {site.domain} — Hecho con calma en la frontera.
            </p>
          </div>
        </footer>

        <Asistente />
        {site.ads.client && (
          // <script> nativo (no next/script): AdSense rechaza el atributo data-nscript
          // y así el tag sale en el HTML del servidor para la verificación del sitio.
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.ads.client}`}
          />
        )}
        {site.analytics.gaId && <GoogleAnalytics gaId={site.analytics.gaId} />}
        <Analytics />
      </body>
    </html>
  );
}
