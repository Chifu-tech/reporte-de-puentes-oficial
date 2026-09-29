import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { cities, citiesBySlug, crossingsForCity } from "@/lib/crossings";
import { fetchLiveCrossings, primaryLane, laneHasData, severityOf } from "@/lib/cbp";
import { sevStyles, formatMinutes } from "@/lib/severity";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) return {};
  const names = crossingsForCity(slug).map((c) => c.name).join(", ");
  return {
    title: `Puentes y líneas en vivo — ${city.name}, ${city.state} ↔ ${city.nameUs}, ${city.stateUs}`,
    description: `Tiempo de espera en vivo de los puentes de ${city.name}: ${names}. Consulta minutos de espera, carriles abiertos, cruce peatonal y la mejor hora para cruzar a ${city.nameUs}.`,
    alternates: { canonical: `/ciudad/${city.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) notFound();

  const list = crossingsForCity(slug);
  const live = await fetchLiveCrossings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            { "@type": "ListItem", position: 2, name: city.name, item: absoluteUrl(`/ciudad/${city.slug}`) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Puentes internacionales de ${city.name}`,
          itemListElement: list.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            url: absoluteUrl(`/puente/${c.slug}`),
          })),
        }}
      />

      <nav aria-label="Miga de pan" className="mb-3 text-[12px] text-ink-faint">
        <Link href="/" className="hover:text-sage-ink">Inicio</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{city.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-balance font-display text-[32px] font-normal leading-[1.08] tracking-tight text-ink">
          Cruces de {city.name}
        </h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          {city.name}, {city.state} ↔ {city.nameUs}, {city.stateUs}
        </p>
      </header>

      <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line bg-surface">
        {list.map((crossing) => {
          const l = live.get(crossing.slug);
          const auto = primaryLane(l, "auto");
          const ped = primaryLane(l, "peaton");
          const main = crossing.pedestrianOnly ? ped : auto;
          const sev = main && laneHasData(main) ? sevStyles[severityOf(main)] : sevStyles["sin-datos"];
          const closed = main ? main.status.toLowerCase().includes("closed") : false;

          return (
            <Link
              key={crossing.slug}
              href={`/puente/${crossing.slug}`}
              className="flex min-h-[60px] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-bone active:bg-bone"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${sev.dot}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">{crossing.name}</span>
                <span className="block truncate text-[11.5px] text-ink-faint">
                  {l?.hours ?? crossing.nameUs}
                </span>
              </span>
              {ped && laneHasData(ped) && ped.delayMinutes !== null && !crossing.pedestrianOnly && (
                <span className="shrink-0 text-[11.5px] tabular text-ink-faint">
                  🚶 {formatMinutes(ped.delayMinutes)}m
                </span>
              )}
              <span
                className={`w-[72px] shrink-0 text-right text-[18px] font-semibold tabular ${
                  closed ? "text-[13px] font-medium text-ink-faint" : sev.text
                }`}
              >
                {closed
                  ? "Cerrado"
                  : main && laneHasData(main) && main.delayMinutes !== null
                    ? formatMinutes(main.delayMinutes)
                    : "—"}
              </span>
              <span className="shrink-0 text-ink-faint" aria-hidden>›</span>
            </Link>
          );
        })}
      </div>

      <Link
        href={`/mejor-hora-para-cruzar/${city.slug}`}
        className="mt-5 flex items-center justify-between rounded-2xl bg-sage px-5 py-4 text-white transition-colors hover:bg-sage-deep"
      >
        <span className="text-[14.5px] font-semibold">Ver la mejor hora para cruzar</span>
        <span aria-hidden>→</span>
      </Link>

      <AdSlot slot="2233445566" className="mt-8" />

      <section className="mt-8">
        <p className="text-[13.5px] leading-relaxed text-ink-soft">{city.description}</p>
      </section>
    </div>
  );
}
