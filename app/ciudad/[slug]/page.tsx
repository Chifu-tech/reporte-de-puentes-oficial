import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import ShareButton from "@/components/ShareButton";
import { cities, citiesBySlug, crossingsForCity } from "@/lib/crossings";
import { fetchLiveCrossings, primaryLane, laneHasData, severityOf, type CrossingLive } from "@/lib/cbp";
import {
  cityDescription,
  cityH1,
  cityTitle,
  formatLocalNow,
  headlineWait,
  hoursEs,
  lineWord,
  minutesText,
  nickname,
  termPlural,
  thePlural,
  the,
} from "@/lib/seo";
import { sevStyles, formatMinutes } from "@/lib/severity";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

async function safeLive(): Promise<Map<string, CrossingLive>> {
  try {
    return await fetchLiveCrossings();
  } catch {
    return new Map();
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) return {};
  const title = cityTitle(city);
  const description = cityDescription(city, await safeLive());
  return {
    // Sin el sufijo de marca: el título ya empieza con "Reporte de Puentes"/"Garitas de".
    title: { absolute: title },
    description,
    alternates: { canonical: `/ciudad/${city.slug}` },
    openGraph: { title, description, url: `/ciudad/${city.slug}`, type: "website" },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) notFound();

  const list = crossingsForCity(slug);
  const live = await safeLive();
  const updated = formatLocalNow(city.tz);
  const plural = termPlural(city);

  // El cruce más rápido ahora (en coche; o a pie si todos son peatonales).
  const ranked = list
    .map((c) => ({ c, h: headlineWait(c, live.get(c.slug)) }))
    .filter((x): x is { c: typeof x.c; h: NonNullable<typeof x.h> } => x.h !== null);
  const byMode = (mode: "coche" | "a pie") =>
    ranked.filter((x) => x.h.mode === mode).sort((a, b) => a.h.minutes - b.h.minutes)[0] ?? null;
  const fastestCar = byMode("coche");
  const fastestWalk = list
    .map((c) => ({ c, m: live.get(c.slug)?.lanes.pedestrian.delayMinutes ?? null }))
    .filter((x): x is { c: typeof x.c; m: number } => x.m !== null)
    .sort((a, b) => a.m - b.m)[0] ?? null;

  const faqs = [
    {
      q: `¿Cuál es ${city.term === "garita" ? "la garita más rápida" : "el puente más rápido"} de ${city.name} ahora?`,
      a: fastestCar
        ? `En coche, ahora mismo ${the(fastestCar.c)} reporta la menor espera: ${minutesText(fastestCar.h.minutes)}.${
            fastestWalk ? ` A pie, ${the(fastestWalk.c)} con ${minutesText(fastestWalk.m)}.` : ""
          } Los tiempos son de U.S. CBP y cambian cada pocos minutos.`
        : `En este momento U.S. CBP no reporta minutos de espera para ${thePlural(city)} de ${city.name}. Revisa la lista de arriba en unos minutos.`,
    },
    {
      q: `¿${city.term === "garita" ? "Cuántas" : "Cuántos"} ${plural} hay en ${city.name}?`,
      a: `${city.name} tiene ${list.length} ${list.length === 1 ? (city.term === "garita" ? "garita" : "puente") : plural} hacia ${city.nameUs}, ${city.stateUs}: ${list
        .map((c) => (nickname(c) ? `${c.name} (${nickname(c)})` : c.name))
        .join(", ")}.`,
    },
    {
      q: `¿Qué horario tienen ${thePlural(city)} de ${city.name}?`,
      a: list
        .map((c) => {
          const h = hoursEs(live.get(c.slug)?.hours);
          return h ? `${c.name}: ${h}` : null;
        })
        .filter(Boolean)
        .join(". ")
        .concat(". Horarios reportados por U.S. CBP."),
    },
  ];

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
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${city.term === "garita" ? "Garitas" : "Puentes internacionales"} de ${city.name}`,
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
          {cityH1(city)}
        </h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          {city.name}, {city.state} ↔ {city.nameUs}, {city.stateUs}
        </p>
        <p className="mt-2 text-[11.5px] text-ink-faint">
          Consultado a CBP el <time dateTime={updated.iso}>{updated.label}</time> (hora de {city.name})
        </p>
        <ShareButton
          className="mt-3"
          slug={city.slug}
          url={absoluteUrl(`/ciudad/${city.slug}`)}
          text={
            fastestCar
              ? `${city.term === "garita" ? "Garitas" : "Puentes"} de ${city.name} ahora: ${the(fastestCar.c)} va más rápido (${minutesText(fastestCar.h.minutes)}).`
              : `Cómo está ${lineWord(city)} en ${city.name} ahora:`
          }
        />
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
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          {city.term === "garita" ? "Garitas" : "Puentes internacionales"} de {city.name} y {city.nameUs}
        </h2>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{city.description}</p>
        <ul className="mt-4 space-y-1.5">
          {list.map((c) => (
            <li key={c.slug} className="text-[13.5px] text-ink-soft">
              <Link href={`/puente/${c.slug}`} className="font-medium text-sage-ink hover:underline">
                {c.name}
              </Link>
              {c.aliases && c.aliases.length > 0 ? ` — también conocido como ${c.aliases.slice(0, 2).join(" o ")}` : ""}
              {" · "}
              <Link href={`/mejor-hora-para-cruzar/${city.slug}/${c.slug}`} className="hover:underline">
                mejor hora
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Preguntas frecuentes: {plural} de {city.name}
        </h2>
        <div className="mt-3 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-line-soft bg-bone px-4 py-3">
              <summary className="cursor-pointer list-none text-[13.5px] font-semibold text-ink marker:hidden">
                <span className="mr-1.5 inline-block text-sage-ink transition-transform group-open:rotate-90">›</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-4 text-[13px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
