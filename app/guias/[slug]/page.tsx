import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { crossings, crossingsBySlug, cityOf } from "@/lib/crossings";
import { fetchLiveCrossings, type CrossingLive, type LaneData } from "@/lib/cbp";
import { guias, guiasBySlug, type Block } from "@/lib/guias";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guiasBySlug.get(slug);
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { title: g.metaTitle, description: g.description, url: `/guias/${g.slug}`, type: "article" },
  };
}

/** Texto con enlaces estilo markdown: "ver [SENTRI](/guias/sentri)". */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <span key={i}>{p}</span>;
        const [, label, href] = m;
        return href.startsWith("/") ? (
          <Link key={i} href={href} className="font-medium text-sage-ink hover:underline">
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-sage-ink hover:underline">
            {label}
          </a>
        );
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string") {
    return (
      <p className="text-[15px] leading-relaxed text-ink-soft">
        <Rich text={block} />
      </p>
    );
  }
  if ("list" in block) {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={`space-y-2 text-[15px] leading-relaxed text-ink-soft ${block.ordered ? "list-decimal pl-5" : ""}`}>
        {block.list.map((item) => (
          <li key={item} className={block.ordered ? "pl-1" : "flex gap-2.5"}>
            {!block.ordered && <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />}
            <span>
              <Rich text={item} />
            </span>
          </li>
        ))}
      </Tag>
    );
  }
  if ("table" in block) {
    return (
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-[13.5px]">
          <thead className="bg-bone text-ink">
            <tr>
              {block.table.head.map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft text-ink-soft">
            {block.table.rows.map((row) => (
              <tr key={row.join("|")}>
                {row.map((cell, i) => (
                  <td key={i} className="px-3 py-2 align-top">
                    <Rich text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <aside className="rounded-xl border border-sage/30 bg-sage-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
      <Rich text={block.note} />
    </aside>
  );
}

function laneExists(l: LaneData | undefined): boolean {
  if (!l) return false;
  const s = l.status.toLowerCase();
  return l.delayMinutes !== null || (s !== "" && s !== "n/a");
}

/** Lista viva de cruces con carril SENTRI o Ready Lane, según CBP. */
function LaneDirectory({ lane, live }: { lane: "sentri" | "ready"; live: Map<string, CrossingLive> }) {
  const list = crossings.filter((c) => !c.pedestrianOnly && laneExists(live.get(c.slug)?.lanes[lane]));
  if (list.length === 0) return null;
  return (
    <ul className="grid gap-x-6 gap-y-1.5 text-[14px] text-ink-soft sm:grid-cols-2">
      {list.map((c) => (
        <li key={c.slug}>
          <Link href={`/puente/${c.slug}`} className="font-medium text-sage-ink hover:underline">
            {c.name}
          </Link>{" "}
          <span className="text-ink-faint">· {cityOf(c).name}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guiasBySlug.get(slug);
  if (!g) notFound();

  let live: Map<string, CrossingLive> = new Map();
  if (g.laneDirectory) {
    try {
      live = await fetchLiveCrossings();
    } catch {
      // sin directorio si CBP no responde
    }
  }
  const related = g.related.map((s) => crossingsBySlug.get(s)).filter((c) => c !== undefined);
  const updated = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${g.updated}T12:00:00Z`)
  );

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          inLanguage: "es-MX",
          dateModified: g.updated,
          datePublished: g.published,
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@id": absoluteUrl("/#organization") },
          mainEntityOfPage: absoluteUrl(`/guias/${g.slug}`),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            { "@type": "ListItem", position: 2, name: "Guías", item: absoluteUrl("/guias") },
            { "@type": "ListItem", position: 3, name: g.title, item: absoluteUrl(`/guias/${g.slug}`) },
          ],
        }}
      />
      {g.faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: g.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") },
            })),
          }}
        />
      )}

      <nav aria-label="Miga de pan" className="mb-4 text-[12.5px] text-ink-faint">
        <Link href="/" className="hover:text-sage-ink">Inicio</Link>
        <span className="mx-1.5">/</span>
        <Link href="/guias" className="hover:text-sage-ink">Guías</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{g.short}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.08] tracking-tight text-ink">{g.title}</h1>
        <p className="mt-2 text-[12px] text-ink-faint">
          Actualizado el <time dateTime={g.updated}>{updated}</time> · Revisado contra fuentes oficiales
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
          <Rich text={g.intro} />
        </p>
      </header>

      <div className="space-y-10">
        {g.sections.map((sec, i) => (
          <section key={sec.h2}>
            <h2 className="text-[21px] font-semibold tracking-tight text-ink">{sec.h2}</h2>
            <div className="mt-3 space-y-4">
              {sec.blocks.map((b, j) => (
                <BlockView key={j} block={b} />
              ))}
              {sec.laneDirectory && <LaneDirectory lane={sec.laneDirectory} live={live} />}
            </div>
            {i === 1 && <AdSlot slot="8899001122" className="mt-10" />}
          </section>
        ))}
      </div>

      {g.faqs.length > 0 && (
        <section className="mt-12 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Preguntas frecuentes</h2>
          <div className="mt-3 space-y-4">
            {g.faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-line-soft bg-bone px-4 py-3">
                <summary className="cursor-pointer list-none text-[14px] font-semibold text-ink marker:hidden">
                  <span className="mr-1.5 inline-block text-sage-ink transition-transform group-open:rotate-90">›</span>
                  {f.q}
                </summary>
                <p className="mt-2 pl-4 text-[13.5px] leading-relaxed text-ink-soft">
                  <Rich text={f.a} />
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Revisa la línea antes de salir</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c!.slug}
                href={`/puente/${c!.slug}`}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-sage/40 hover:text-sage-ink"
              >
                {c!.name}
                <span className="block text-[11.5px] font-normal text-ink-faint">{cityOf(c!).name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 border-t border-line-soft pt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-faint">Fuentes oficiales</h2>
        <ul className="mt-2 space-y-1 text-[13px]">
          {g.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sage-ink hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
          Esta guía es informativa y no sustituye la información oficial de CBP, el Departamento de Estado o la
          Agencia Nacional de Aduanas de México. Requisitos y costos pueden cambiar; confírmalos en las fuentes
          antes de hacer un trámite.
        </p>
        <p className="mt-4 text-[13px]">
          <Link href="/guias" className="font-medium text-sage-ink hover:underline">
            ← Todas las guías para cruzar
          </Link>
        </p>
      </section>
    </article>
  );
}
