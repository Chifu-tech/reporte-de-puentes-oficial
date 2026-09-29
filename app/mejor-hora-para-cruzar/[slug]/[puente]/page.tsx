import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BestHourChart, { DayAverages } from "@/components/BestHourChart";
import JsonLd from "@/components/JsonLd";
import { cityOf, crossings, crossingsBySlug } from "@/lib/crossings";
import { averageDelayByDay, averageDelayByDayHour, averageDelayByHour, firstCaptureDate } from "@/lib/db";
import { capitalize, hourLabel, lineWord, ofThe, the, titleName } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 900;

const DÍAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function generateStaticParams() {
  return crossings.map((c) => ({ slug: c.citySlug, puente: c.slug }));
}

function find(slug: string, puente: string) {
  const c = crossingsBySlug.get(puente);
  return c && c.citySlug === slug ? c : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; puente: string }>;
}): Promise<Metadata> {
  const { slug, puente } = await params;
  const c = find(slug, puente);
  if (!c) return {};
  const city = cityOf(c);
  return {
    title: `Mejor hora para cruzar ${titleName(c)}: por día y hora`,
    description: `¿A qué hora hay menos ${lineWord(city).replace("la ", "")} en ${the(c)}? Promedios de espera por hora y por día de la semana (sábado, domingo, entre semana), calculados con datos oficiales de U.S. CBP.`,
    alternates: { canonical: `/mejor-hora-para-cruzar/${city.slug}/${c.slug}` },
  };
}

export default async function MejorHoraPuente({ params }: { params: Promise<{ slug: string; puente: string }> }) {
  const { slug, puente } = await params;
  const crossing = find(slug, puente);
  if (!crossing) notFound();
  const city = cityOf(crossing);

  const keys = crossing.pedestrianOnly ? ["pedestrian"] : ["standard", "ready"];
  const [hourly, daily, grid, since] = await Promise.all([
    averageDelayByHour(crossing.portNumber, keys, city.tz),
    averageDelayByDay(crossing.portNumber, keys, city.tz),
    averageDelayByDayHour(crossing.portNumber, keys, city.tz),
    firstCaptureDate(),
  ]);

  // Por día: hora más rápida y más lenta (con al menos 2 muestras).
  const perDay = DÍAS.map((name, day) => {
    const cells = grid.filter((g) => g.day === day && g.avgDelay !== null && g.samples >= 2);
    const best = cells.reduce<(typeof cells)[number] | null>((a, g) => (a === null || (g.avgDelay as number) < (a.avgDelay as number) ? g : a), null);
    const worst = cells.reduce<(typeof cells)[number] | null>((a, g) => (a === null || (g.avgDelay as number) > (a.avgDelay as number) ? g : a), null);
    return { day, name, best, worst, avg: daily.find((d) => d.day === day)?.avgDelay ?? null };
  });
  const ranked = perDay.filter((d) => d.avg !== null).sort((a, b) => (a.avg as number) - (b.avg as number));
  const hasData = ranked.length > 0;
  const sinceLabel = since
    ? new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: city.tz }).format(since)
    : null;
  const unit = crossing.pedestrianOnly ? "a pie" : "en coche";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            { "@type": "ListItem", position: 2, name: "Mejor hora para cruzar", item: absoluteUrl("/mejor-hora-para-cruzar") },
            { "@type": "ListItem", position: 3, name: city.name, item: absoluteUrl(`/mejor-hora-para-cruzar/${city.slug}`) },
            {
              "@type": "ListItem",
              position: 4,
              name: crossing.name,
              item: absoluteUrl(`/mejor-hora-para-cruzar/${city.slug}/${crossing.slug}`),
            },
          ],
        }}
      />

      <nav aria-label="Miga de pan" className="mb-4 text-[12.5px] text-ink-faint">
        <Link href="/" className="hover:text-sage-ink">Inicio</Link>
        <span className="mx-1.5">/</span>
        <Link href="/mejor-hora-para-cruzar" className="hover:text-sage-ink">Mejor hora</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/mejor-hora-para-cruzar/${city.slug}`} className="hover:text-sage-ink">{city.name}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{crossing.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          Mejor hora para cruzar {the(crossing)}
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Promedios de espera {unit} por hora del día y por día de la semana en {the(crossing)} ({crossing.nameUs}),
          calculados cada 15 minutos con los tiempos oficiales de U.S. CBP.{" "}
          {sinceLabel ? `Historial desde el ${sinceLabel}.` : "Estamos empezando a juntar el historial."}
        </p>
        <Link
          href={`/puente/${crossing.slug}`}
          className="mt-4 inline-block rounded-full bg-sage px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-sage-deep"
        >
          Ver {lineWord(city)} en vivo ahora →
        </Link>
      </header>

      {hasData && (
        <section className="mb-8 rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Días con menos {lineWord(city).replace("la ", "")} {ofThe(crossing)}
          </h2>
          <ol className="mt-4 space-y-2">
            {ranked.map((d, i) => (
              <li key={d.day} className="flex items-baseline gap-3 text-[14px] text-ink-soft">
                <span className="w-5 shrink-0 text-right font-semibold tabular text-ink-faint">{i + 1}.</span>
                <span className="w-24 shrink-0 font-semibold text-ink">{capitalize(d.name)}</span>
                <span className="tabular">~{d.avg} min en promedio</span>
                {d.best && (
                  <span className="hidden text-[12.5px] text-verde sm:inline">
                    · mejor: {hourLabel(d.best.hour)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Espera promedio por hora</h2>
        <div className="mt-5">
          <BestHourChart data={hourly} tz={city.tz} />
          <DayAverages data={daily} />
        </div>
      </section>

      <AdSlot slot="5566778899" className="my-10" />

      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Mejor hora para cruzar {the(crossing)}, día por día
        </h2>
        {hasData ? (
          <div className="mt-4 space-y-3">
            {perDay.map((d) =>
              d.best ? (
                <div key={d.day}>
                  <h3 className="text-[14.5px] font-semibold text-ink">¿A qué hora cruzar el {d.name}?</h3>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">
                    El {d.name} la espera más corta suele ser cerca de las {hourLabel(d.best.hour)} (~{d.best.avgDelay} min)
                    {d.worst && d.worst.hour !== d.best.hour
                      ? ` y la más larga cerca de las ${hourLabel(d.worst.hour)} (~${d.worst.avgDelay} min).`
                      : "."}
                  </p>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
            Todavía no tenemos suficientes datos de {the(crossing)} para cada día. Mientras tanto, la regla general de la
            frontera funciona: la madrugada (4 a 6 a.m.) casi siempre gana, de 8 a 11 a.m. es hora pico por trabajadores y
            estudiantes, y el domingo en la tarde se llenan los regresos.
          </p>
        )}
        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-faint">
          Son promedios: te ayudan a planear, pero la línea de hoy puede ser distinta por clima, operativos o días
          festivos. Antes de salir, revisa{" "}
          <Link href={`/puente/${crossing.slug}`} className="font-medium text-sage-ink hover:underline">
            el tiempo de espera en vivo {ofThe(crossing)}
          </Link>{" "}
          o compara con{" "}
          <Link href={`/mejor-hora-para-cruzar/${city.slug}`} className="font-medium text-sage-ink hover:underline">
            los otros cruces de {city.name}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
