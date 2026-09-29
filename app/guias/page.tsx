import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { guias } from "@/lib/guias";
import { site, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guías para cruzar la frontera: SENTRI, Ready Lane, I-94 y más",
  description:
    "Guías claras para cruzar de México a Estados Unidos: qué es la SENTRI y cómo sacarla, qué documentos sirven en Ready Lane, cómo tramitar el permiso I-94, qué puedes pasar por la garita y cómo cruzar caminando.",
  alternates: { canonical: "/guias" },
};

export default function GuiasIndex() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Guías para cruzar la frontera México–Estados Unidos",
          url: absoluteUrl("/guias"),
          inLanguage: "es-MX",
          isPartOf: { "@id": absoluteUrl("/#website") },
          hasPart: guias.map((g) => ({ "@type": "Article", headline: g.title, url: absoluteUrl(`/guias/${g.slug}`) })),
        }}
      />
      <header className="mb-8">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          Guías para cruzar la frontera
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Lo que necesitas saber para cruzar más rápido y sin sorpresas, explicado claro y revisado contra fuentes
          oficiales. Y antes de salir, revisa{" "}
          <Link href="/" className="font-medium text-sage-ink hover:underline">
            cómo está la línea en vivo
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-3">
        {guias.map((g) => (
          <Link
            key={g.slug}
            href={`/guias/${g.slug}`}
            className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:border-sage/40 hover:shadow-[0_2px_12px_rgba(47,107,94,0.08)]"
          >
            <h2 className="text-[16px] font-semibold text-ink group-hover:text-sage-ink">{g.title}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{g.description}</p>
          </Link>
        ))}
        <Link
          href="/horarios-puentes-internacionales"
          className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:border-sage/40 hover:shadow-[0_2px_12px_rgba(47,107,94,0.08)]"
        >
          <h2 className="text-[16px] font-semibold text-ink group-hover:text-sage-ink">
            Horarios de los puentes internacionales y garitas
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
            A qué hora abre y cierra cada cruce hoy, con el horario oficial de CBP.
          </p>
        </Link>
      </div>

      <p className="mt-8 text-[12px] text-ink-faint">
        {site.name} es un proyecto independiente, sin afiliación con CBP ni con autoridades de México.
      </p>
    </div>
  );
}
