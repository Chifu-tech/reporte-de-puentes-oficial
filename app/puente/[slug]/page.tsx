import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BestHourChart, { DayAverages } from "@/components/BestHourChart";
import CameraPlayer from "@/components/CameraPlayer";
import JsonLd from "@/components/JsonLd";
import LaneGrid from "@/components/LaneGrid";
import { cityOf, crossings, crossingsBySlug, crossingsForCity } from "@/lib/crossings";
import { fetchLiveCrossings, severityOf } from "@/lib/cbp";
import { averageDelayByDay, averageDelayByHour } from "@/lib/db";
import { sevStyles, formatMinutes } from "@/lib/severity";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return crossings.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = crossingsBySlug.get(slug);
  if (!c) return {};
  const city = cityOf(c);
  return {
    title: `${c.name} — Línea y tiempo de espera en vivo`,
    description: `Cuánto se tarda ahora el ${c.name} (${city.name} ↔ ${city.nameUs}): tiempo de espera en vivo, carriles abiertos, cruce peatonal, cámaras y la mejor hora para cruzar.`,
    alternates: { canonical: `/puente/${c.slug}` },
  };
}

export default async function CrossingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const crossing = crossingsBySlug.get(slug);
  if (!crossing) notFound();

  const city = cityOf(crossing);
  const live = (await fetchLiveCrossings()).get(crossing.slug);
  const others = crossingsForCity(crossing.citySlug).filter((c) => c.slug !== crossing.slug);

  const chartLaneKeys = crossing.pedestrianOnly ? ["pedestrian"] : ["standard", "ready"];
  const hourly = await averageDelayByHour(crossing.portNumber, chartLaneKeys, city.tz);
  const daily = await averageDelayByDay(crossing.portNumber, chartLaneKeys, city.tz);

  const bestHour = hourly.reduce<{ hour: number; avg: number } | null>((acc, cur) => {
    if (cur.avgDelay === null || cur.samples === 0) return acc;
    return acc === null || cur.avgDelay < acc.avg ? { hour: cur.hour, avg: cur.avgDelay } : acc;
  }, null);

  const std = live?.lanes.standard;
  const ped = live?.lanes.pedestrian;
  const stdSev = std ? sevStyles[severityOf(std)] : null;
  const pedSev = ped ? sevStyles[severityOf(ped)] : null;

  const horario = live?.hours ?? "Consulta el horario oficial de la garita";
  const faqs = [
    {
      q: `¿Cuál es el horario del ${crossing.name}?`,
      a: `El ${crossing.name} (${crossing.nameUs}) abre ${horario.toLowerCase()}. El horario corresponde al puerto de entrada (${city.nameUs}, ${city.stateUs}) reportado por U.S. Customs and Border Protection.`,
    },
    {
      q: `¿Cuánto se tarda en cruzar el ${crossing.name} ahora?`,
      a: std && std.delayMinutes !== null
        ? `En este momento la línea para vehículos reporta ${std.delayMinutes} minuto${std.delayMinutes === 1 ? "" : "s"} de espera${std.lanesOpen !== null && std.lanesOpen > 0 ? `, con ${std.lanesOpen} carril${std.lanesOpen === 1 ? "" : "es"} abierto${std.lanesOpen === 1 ? "" : "s"}` : ""}${ped?.delayMinutes !== null && ped ? `, y el cruce peatonal ${ped.delayMinutes} minuto${ped.delayMinutes === 1 ? "" : "s"}` : ""}. Los tiempos son estimados de U.S. CBP.`
        : `Consulta arriba el tiempo de espera en vivo reportado por U.S. CBP para vehículos y peatones.`,
    },
    {
      q: `¿Cuál es la mejor hora para cruzar por el ${crossing.name}?`,
      a: bestHour
        ? `Según nuestro historial de los últimos días, la hora con menor espera promedio es alrededor de las ${bestHour.hour}:00, con unos ${bestHour.avg} minutos de línea. Consulta la gráfica de este puente para ver el promedio hora por hora.`
        : `Las primeras horas de la mañana (entre 4 y 7 a.m.) suelen tener las líneas más cortas; entre 8 y 11 a.m. se concentran las horas pico. Próximamente publicaremos promedios por hora con datos históricos de esta garita.`,
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
            { "@type": "ListItem", position: 3, name: crossing.name, item: absoluteUrl(`/puente/${crossing.slug}`) },
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
      {crossing.coords && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Place",
            name: `${crossing.name} (${crossing.nameUs})`,
            geo: {
              "@type": "GeoCoordinates",
              latitude: crossing.coords.lat,
              longitude: crossing.coords.lng,
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: `${city.nameUs}, ${city.stateUs}`,
              addressCountry: "US",
            },
            url: absoluteUrl(`/puente/${crossing.slug}`),
          }}
        />
      )}

      <nav aria-label="Miga de pan" className="mb-4 text-[12.5px] text-ink-faint">
        <Link href="/" className="hover:text-sage-ink">Inicio</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/ciudad/${city.slug}`} className="hover:text-sage-ink">{city.name}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{crossing.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">{crossing.name}</h1>
        <p className="mt-1.5 text-[14px] text-ink-faint">
          {crossing.nameUs} · {city.name}, {city.state} ↔ {city.nameUs}, {city.stateUs}
        </p>
        {live?.portStatus && (
          <p className="mt-3 inline-block rounded-full bg-sage-soft px-3 py-1 text-[12px] font-semibold text-sage-ink">
            {live.portStatus === "Open" ? "Puerto abierto" : live.portStatus === "Closed" ? "Puerto cerrado" : live.portStatus}
          </p>
        )}
      </header>

      {/* Tiempos principales */}
      {live ? (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {!crossing.pedestrianOnly && (
            <div className={`p-4 sm:p-5 ${stdSev && std?.delayMinutes !== null ? stdSev.bg : "bg-surface"}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">🚗 En coche</p>
              <div className="mt-1.5 flex items-baseline gap-1">
                {std && std.delayMinutes !== null ? (
                  <>
                    <span className={`text-4xl font-bold tabular ${stdSev?.text}`}>
                      {formatMinutes(std.delayMinutes)}
                    </span>
                    <span className="text-xs font-medium text-ink-soft">min</span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-ink-faint">
                    {std && std.status.toLowerCase().includes("closed") ? "Cerrado" : "Sin reporte"}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[11.5px] text-ink-soft">
                {std?.lanesOpen && std.lanesOpen > 0 ? `${std.lanesOpen} carriles abiertos` : ""}
              </p>
            </div>
          )}
          <div className={`p-4 sm:p-5 ${pedSev && ped?.delayMinutes !== null ? pedSev.bg : "bg-surface"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">🚶 A pie</p>
            <div className="mt-1.5 flex items-baseline gap-1">
              {ped && ped.delayMinutes !== null ? (
                <>
                  <span className={`text-4xl font-bold tabular ${pedSev?.text}`}>
                    {formatMinutes(ped.delayMinutes)}
                  </span>
                  <span className="text-xs font-medium text-ink-soft">min</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-ink-faint">
                  {ped && ped.status.toLowerCase().includes("closed") ? "Cerrado" : "Sin cruce peatonal"}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11.5px] text-ink-soft">{ped?.updatedAt ?? ""}</p>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-sm text-ink-soft">
          No hay reporte disponible de U.S. CBP para este puerto en este momento.
        </p>
      )}

      {/* Detalle por carril */}
      {live && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Líneas por carril</h2>
          <LaneGrid
            lanes={[live.lanes.standard, live.lanes.ready, live.lanes.sentri, live.lanes.pedestrian]}
          />
          {(live.lanes.commercial.delayMinutes !== null || live.lanes.commercial.lanesOpen !== null) && (
            <div className="mt-4">
              <LaneGrid lanes={[live.lanes.commercial, live.lanes.fast]} title="Carga (comercial)" />
            </div>
          )}
        </section>
      )}

      <AdSlot slot="3344556677" className="my-10" />

      {/* Mejor hora */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Mejor hora para cruzar</h2>
        <div className="mt-5">
          <BestHourChart data={hourly} tz={city.tz} />
          <DayAverages data={daily} />
        </div>
      </section>

      {/* Cámaras */}
      {crossing.cameras && crossing.cameras.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Cámaras en vivo</h2>
          <p className="mt-1 text-[13px] text-ink-faint">
            Streams públicos de la Ciudad de El Paso y el Fideicomiso de Puentes Fronterizos.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crossing.cameras.map((cam) => (
              <CameraPlayer key={cam.src} camera={cam} />
            ))}
          </div>
        </section>
      )}

      {/* Contenido SEO */}
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Sobre el {crossing.name}
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{crossing.description}</p>
        <ul className="mt-4 space-y-1.5">
          {crossing.facts.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(crossing.mapsQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full border border-sage px-5 py-2 text-[13px] font-semibold text-sage-ink transition-colors hover:bg-sage hover:text-white"
        >
          Cómo llegar al {crossing.name} (Google Maps)
        </a>

        <div className="mt-8 border-t border-line-soft pt-6">
          <h3 className="text-[15px] font-semibold text-ink">Preguntas frecuentes</h3>
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
        </div>
      </section>

      {/* Otros puentes de la ciudad */}
      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Otros puentes de {city.name}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((o) => {
              return (
                <Link
                  key={o.slug}
                  href={`/puente/${o.slug}`}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-sage/40 hover:text-sage-ink"
                >
                  {o.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
