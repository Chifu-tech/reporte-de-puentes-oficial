import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BestHourChart, { DayAverages } from "@/components/BestHourChart";
import JsonLd from "@/components/JsonLd";
import { cities, citiesBySlug, crossingsForCity } from "@/lib/crossings";
import { averageDelayByDay, averageDelayByHour } from "@/lib/db";
import { lineWord, termPlural } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 900;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) return {};
  return {
    title: `Mejor hora para cruzar en ${city.name}: ${termPlural(city)} con menos ${lineWord(city).replace("la ", "")}`,
    description: `¿A qué hora hay menos ${lineWord(city).replace("la ", "")} en ${city.name}? Promedios de espera por hora y por día de la semana en ${crossingsForCity(slug).map((c) => c.name).join(", ")}, con datos oficiales de U.S. CBP.`,
    alternates: { canonical: `/mejor-hora-para-cruzar/${city.slug}` },
  };
}

export default async function MejorHoraCity({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) notFound();

  const list = crossingsForCity(slug);
  const charts = await Promise.all(
    list.map(async (c) => ({
      crossing: c,
      hourly: await averageDelayByHour(c.portNumber, c.pedestrianOnly ? ["pedestrian"] : ["standard", "ready"], city.tz),
      daily: await averageDelayByDay(c.portNumber, c.pedestrianOnly ? ["pedestrian"] : ["standard", "ready"], city.tz),
    }))
  );

  const anyData = charts.some((ch) => ch.hourly.some((h) => h.avgDelay !== null && h.samples > 0));

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
          ],
        }}
      />

      <nav aria-label="Miga de pan" className="mb-4 text-[12.5px] text-ink-faint">
        <Link href="/" className="hover:text-sage-ink">Inicio</Link>
        <span className="mx-1.5">/</span>
        <Link href="/mejor-hora-para-cruzar" className="hover:text-sage-ink">Mejor hora para cruzar</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{city.name}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          La mejor hora para cruzar en {city.name}
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Promedios de espera por hora del día en cada garita de {city.name} ({city.nameUs},{" "}
          {city.stateUs}), calculados con el historial de tiempos oficiales de U.S. CBP.
          {anyData
            ? " Las barras verdes marcan las horas con menor espera."
            : " Estamos recolectando datos desde hace poco; las gráficas se llenarán en los próximos días."}
        </p>
      </header>

      <div className="space-y-6">
        {charts.map(({ crossing, hourly, daily }) => (
          <section key={crossing.slug} className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                <Link href={`/puente/${crossing.slug}`} className="hover:text-sage-ink">
                  {crossing.name}
                </Link>
              </h2>
              <span className="flex gap-3 text-[12.5px] font-medium text-sage-ink">
                <Link href={`/mejor-hora-para-cruzar/${city.slug}/${crossing.slug}`} className="hover:underline">
                  Por día →
                </Link>
                <Link href={`/puente/${crossing.slug}`} className="hover:underline">
                  En vivo →
                </Link>
              </span>
            </div>
            <BestHourChart data={hourly} tz={city.tz} />
            <DayAverages data={daily} />
          </section>
        ))}
      </div>

      <AdSlot slot="5566778899" className="mt-10" />

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Cómo leer estas gráficas</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          Cada barra representa la espera promedio a esa hora durante los últimos 14 días (por día
          de la semana, los últimos 60). No son el tiempo exacto de este momento: para eso usa{" "}
          <Link href={`/ciudad/${city.slug}`} className="font-medium text-sage-ink hover:text-sage-ink">
            el reporte en vivo de {city.name}
          </Link>
          . Los promedios te ayudan a planear: si tu horario es flexible, apunta a las horas con
          barras verdes.
        </p>
      </section>
    </div>
  );
}
