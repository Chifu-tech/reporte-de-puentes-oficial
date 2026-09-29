import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import BestHourChart, { DayAverages } from "@/components/BestHourChart";
import CameraPlayer from "@/components/CameraPlayer";
import JsonLd from "@/components/JsonLd";
import LaneGrid from "@/components/LaneGrid";
import ShareButton from "@/components/ShareButton";
import { cityOf, crossings, crossingsBySlug, crossingsForCity, type Crossing } from "@/lib/crossings";
import { fetchLiveCrossings, severityOf, type CrossingLive, type LaneData } from "@/lib/cbp";
import { averageDelayByDay, averageDelayByDayHour, averageDelayByHour } from "@/lib/db";
import {
  capitalize,
  crossingDescription,
  crossingTitle,
  formatLocalNow,
  headlineWait,
  hourLabel,
  hoursEs,
  lineWord,
  localHour,
  minutesText,
  ofThe,
  otherPlural,
  termPlural,
  thePlural,
  the,
  titleName,
  toThe,
} from "@/lib/seo";
import { sevStyles, formatMinutes } from "@/lib/severity";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return crossings.map((c) => ({ slug: c.slug }));
}

async function liveFor(slug: string): Promise<CrossingLive | undefined> {
  try {
    return (await fetchLiveCrossings()).get(slug);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = crossingsBySlug.get(slug);
  if (!c) return {};
  const city = cityOf(c);
  const live = await liveFor(c.slug);
  const title = crossingTitle(c, city, headlineWait(c, live));
  const description = crossingDescription(c, city, live);
  return {
    title,
    description,
    alternates: { canonical: `/puente/${c.slug}` },
    openGraph: { title, description, url: `/puente/${c.slug}`, type: "website" },
  };
}

/** Carril reportado por CBP (aunque no tenga espera en este momento). */
function laneExists(l: LaneData | undefined): boolean {
  if (!l) return false;
  const s = l.status.toLowerCase();
  return l.delayMinutes !== null || (s !== "" && s !== "n/a");
}

export default async function CrossingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const crossing = crossingsBySlug.get(slug);
  if (!crossing) notFound();

  const city = cityOf(crossing);
  const live = await liveFor(crossing.slug);
  const others = crossingsForCity(crossing.citySlug).filter((c) => c.slug !== crossing.slug);

  const chartLaneKeys = crossing.pedestrianOnly ? ["pedestrian"] : ["standard", "ready"];
  const [hourly, daily, grid] = await Promise.all([
    averageDelayByHour(crossing.portNumber, chartLaneKeys, city.tz),
    averageDelayByDay(crossing.portNumber, chartLaneKeys, city.tz),
    averageDelayByDayHour(crossing.portNumber, chartLaneKeys, city.tz),
  ]);

  const bestHour = hourly.reduce<{ hour: number; avg: number } | null>((acc, cur) => {
    if (cur.avgDelay === null || cur.samples === 0) return acc;
    return acc === null || cur.avgDelay < acc.avg ? { hour: cur.hour, avg: cur.avgDelay } : acc;
  }, null);

  const bestOnDay = (day: number) =>
    grid
      .filter((g) => g.day === day && g.avgDelay !== null && g.samples >= 2)
      .reduce<{ hour: number; avg: number } | null>(
        (acc, g) => (acc === null || (g.avgDelay as number) < acc.avg ? { hour: g.hour, avg: g.avgDelay as number } : acc),
        null
      );
  const bestSat = bestOnDay(6);
  const bestSun = bestOnDay(0);

  const std = live?.lanes.standard;
  const ped = live?.lanes.pedestrian;
  const stdSev = std ? sevStyles[severityOf(std)] : null;
  const pedSev = ped ? sevStyles[severityOf(ped)] : null;
  const head = headlineWait(crossing, live);

  // Espera actual contra el promedio histórico de esta misma hora.
  const nowHour = localHour(city.tz);
  const avgNow = hourly.find((h) => h.hour === nowHour);
  const vsAvg =
    head && head.mode === (crossing.pedestrianOnly ? "a pie" : "coche") && avgNow?.avgDelay != null && avgNow.samples >= 3
      ? head.minutes - avgNow.avgDelay
      : null;

  const updated = formatLocalNow(city.tz);
  const Nombre = capitalize(the(crossing));
  const horario = hoursEs(live?.hours);
  const hasSentri = !crossing.pedestrianOnly && laneExists(live?.lanes.sentri);
  const hasReady = !crossing.pedestrianOnly && laneExists(live?.lanes.ready);
  const hasPed = laneExists(ped);
  const shareText = head
    ? `${titleName(crossing)}: ${minutesText(head.minutes)} de ${crossing.pedestrianOnly ? "línea peatonal" : lineWord(city).replace("la ", "")} ahora mismo (${head.mode}).`
    : `Cómo está ${lineWord(city)} en ${the(crossing)} ahora:`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `¿Cuánto se tarda en cruzar ${the(crossing)} ahora?`,
      a:
        head
          ? `En este momento U.S. CBP reporta ${minutesText(head.minutes)} de espera ${head.mode === "coche" ? "en coche" : "a pie"}${
              !crossing.pedestrianOnly && std?.lanesOpen ? `, con ${std.lanesOpen} carril${std.lanesOpen === 1 ? "" : "es"} abierto${std.lanesOpen === 1 ? "" : "s"}` : ""
            }${!crossing.pedestrianOnly && ped?.delayMinutes != null ? `, y el cruce peatonal ${minutesText(ped.delayMinutes)}` : ""}. Los tiempos son estimados y se actualizan cada pocos minutos en esta página.`
          : `Consulta arriba el tiempo de espera en vivo reportado por U.S. CBP para vehículos y peatones; en este momento no hay un reporte de minutos.`,
    },
    {
      q: `¿Está abierto hoy ${the(crossing)}?`,
      a:
        live?.portStatus === "Closed"
          ? `Según U.S. CBP, el puerto aparece como cerrado en este momento. Revisa ${thePlural(city).split(" ")[0]} ${otherPlural(city)} de ${city.name}.`
          : `${live?.portStatus === "Open" ? "Sí. Según U.S. CBP el puerto está abierto" : "Consulta el estado en vivo arriba"}${horario ? `; su horario es ${horario}` : ""}. El horario corresponde al puerto de entrada de ${city.nameUs}, ${city.stateUs}.`,
    },
    {
      q: `¿Cuál es el horario ${ofThe(crossing)}?`,
      a: horario
        ? `${Nombre} (${crossing.nameUs}) abre ${horario}, según U.S. Customs and Border Protection. En días festivos o por operativos especiales el horario puede cambiar.`
        : `Consulta el horario oficial en el portal de U.S. CBP; ${the(crossing)} (${crossing.nameUs}) no lo reporta en este momento.`,
    },
    {
      q: `¿Cuánto se tarda cruzar caminando por ${the(crossing)}?`,
      a: !hasPed
        ? `${Nombre} no tiene cruce peatonal reportado por U.S. CBP hacia Estados Unidos. Revisa ${thePlural(city).split(" ")[0]} ${otherPlural(city)} de ${city.name} para cruzar a pie.`
        : ped?.delayMinutes != null
          ? `Ahora mismo la línea peatonal reporta ${minutesText(ped.delayMinutes)} de espera. A pie suele avanzar más rápido que en coche en horas pico, pero en la mañana de lunes a viernes se llena con trabajadores y estudiantes.`
          : `${Nombre} tiene cruce peatonal; en este momento CBP no reporta minutos de espera para la línea a pie.`,
    },
    ...(!crossing.pedestrianOnly
      ? [
          {
            q: `¿${capitalize(the(crossing))} tiene SENTRI y Ready Lane?`,
            a:
              hasSentri && hasReady
                ? `Sí. ${Nombre} tiene carriles SENTRI y Ready Lane además de los carriles normales. SENTRI es para viajeros confiables con tarjeta aprobada; Ready Lane acepta documentos con chip como la visa láser, la passport card o la green card.`
                : hasSentri
                  ? `${Nombre} tiene carril SENTRI (para viajeros confiables con tarjeta aprobada); CBP no reporta Ready Lane en este cruce.`
                  : hasReady
                    ? `${Nombre} tiene Ready Lane (para documentos con chip como la visa láser, la passport card o la green card); CBP no reporta carril SENTRI en este cruce.`
                    : `Según U.S. CBP, ${the(crossing)} no reporta carriles SENTRI ni Ready Lane; solo carriles normales.`,
          },
        ]
      : []),
    ...(crossing.aliases && crossing.aliases.length > 0
      ? [
          {
            q: `¿Qué otros nombres tiene ${the(crossing)}?`,
            a: `${Nombre} también es conocido como ${crossing.aliases.join(", ")}. En Estados Unidos su nombre oficial es ${crossing.nameUs}.`,
          },
        ]
      : []),
    {
      q: `¿Cuál es la mejor hora para cruzar por ${the(crossing)}?`,
      a: bestHour
        ? `Según nuestro historial de los últimos días, la hora con menor espera promedio es alrededor de las ${hourLabel(bestHour.hour)}, con unos ${bestHour.avg} minutos de ${lineWord(city).replace("la ", "")}.${
            bestSat || bestSun
              ? ` En fin de semana: ${[bestSat && `el sábado conviene cerca de las ${hourLabel(bestSat.hour)} (~${bestSat.avg} min)`, bestSun && `el domingo cerca de las ${hourLabel(bestSun.hour)} (~${bestSun.avg} min)`].filter(Boolean).join(" y ")}.`
              : ""
          }`
        : `Las primeras horas de la mañana (entre 4 y 7 a.m.) suelen tener las líneas más cortas; entre 8 y 11 a.m. se concentran las horas pico, y el domingo en la tarde se llenan los regresos. Estamos juntando el historial de esta garita para calcular su mejor hora exacta.`,
    },
    {
      q: `¿Hay cámaras en vivo ${ofThe(crossing)}?`,
      a:
        crossing.cameras && crossing.cameras.length > 0
          ? `Sí. En esta página puedes ver ${crossing.cameras.length} cámara${crossing.cameras.length === 1 ? "" : "s"} en vivo ${ofThe(crossing)}: ${crossing.cameras.map((c) => c.label).join(", ")}. Son transmisiones públicas de terceros y a veces se caen.`
          : `Por ahora no conocemos una cámara pública de ${the(crossing)} que se pueda ver en línea. Revisa las cámaras en vivo de otros puentes y garitas en nuestra sección de cámaras.`,
    },
    {
      q: `¿Cómo llegar ${toThe(crossing)}?`,
      a: `${Nombre} ${crossing.facts[0].charAt(0).toLowerCase()}${crossing.facts[0].slice(1)}. Usa el botón «Cómo llegar» de esta página para abrir la ruta en Google Maps desde tu ubicación.`,
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
            ...(crossing.aliases ? { alternateName: crossing.aliases } : {}),
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
        {crossing.aliases && crossing.aliases.length > 0 && (
          <p className="mt-1 text-[13px] text-ink-soft">
            También conocido como: {crossing.aliases.join(" · ")}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {live?.portStatus && (
            <p className="inline-block rounded-full bg-sage-soft px-3 py-1 text-[12px] font-semibold text-sage-ink">
              {live.portStatus === "Open" ? "Puerto abierto" : live.portStatus === "Closed" ? "Puerto cerrado" : live.portStatus}
            </p>
          )}
          <ShareButton text={shareText} url={absoluteUrl(`/puente/${crossing.slug}`)} slug={crossing.slug} />
        </div>
      </header>

      {/* Tiempos principales */}
      <section aria-labelledby="linea-ahora">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 id="linea-ahora" className="text-lg font-semibold tracking-tight text-ink">
            ¿Cómo está {lineWord(city)} en {the(crossing)} hoy?
          </h2>
          <p className="text-[11.5px] text-ink-faint">
            Consultado a CBP el <time dateTime={updated.iso}>{updated.label}</time> (hora de {city.name})
          </p>
        </div>
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
        {head && vsAvg !== null && avgNow?.avgDelay != null && (
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            La espera {head.mode === "coche" ? "en coche" : "a pie"} es de{" "}
            <strong className="font-semibold text-ink">{minutesText(head.minutes)}</strong>
            {Math.abs(vsAvg) < 5
              ? `, casi igual al promedio de las ${hourLabel(nowHour)} (${avgNow.avgDelay} min).`
              : vsAvg > 0
                ? `: ${vsAvg} min más que el promedio a esta hora (${avgNow.avgDelay} min). Hoy está más cargado de lo normal.`
                : `: ${-vsAvg} min menos que el promedio a esta hora (${avgNow.avgDelay} min). Buen momento para cruzar.`}
          </p>
        )}
      </section>

      {/* Detalle por carril */}
      {live && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Línea peatonal, SENTRI y Ready Lane</h2>
          <LaneGrid
            lanes={[live.lanes.standard, live.lanes.ready, live.lanes.sentri, live.lanes.pedestrian]}
          />
          {(live.lanes.commercial.delayMinutes !== null || live.lanes.commercial.lanesOpen !== null) && (
            <div className="mt-4">
              <LaneGrid lanes={[live.lanes.commercial, live.lanes.fast]} title="Carga (comercial)" />
            </div>
          )}
          <p className="mt-3 text-[12.5px] text-ink-faint">
            ¿Qué carril te toca? Lee nuestras guías de{" "}
            <Link href="/guias/sentri" className="font-medium text-sage-ink hover:underline">SENTRI</Link> y{" "}
            <Link href="/guias/ready-lane" className="font-medium text-sage-ink hover:underline">Ready Lane</Link>.
          </p>
        </section>
      )}

      <AdSlot slot="3344556677" className="my-10" />

      {/* Mejor hora */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Mejor hora para cruzar {the(crossing)}</h2>
          <Link
            href={`/mejor-hora-para-cruzar/${city.slug}/${crossing.slug}`}
            className="text-[12.5px] font-medium text-sage-ink hover:underline"
          >
            Ver por día de la semana →
          </Link>
        </div>
        <div className="mt-5">
          <BestHourChart data={hourly} tz={city.tz} />
          <DayAverages data={daily} />
        </div>
      </section>

      {/* Cámaras */}
      {crossing.cameras && crossing.cameras.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Cámaras en vivo {ofThe(crossing)}</h2>
          <p className="mt-1 text-[13px] text-ink-faint">
            Transmisiones públicas de terceros; pueden caerse sin aviso.
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
          Horario y cómo llegar {toThe(crossing)}
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{crossing.description}</p>
        <ul className="mt-4 space-y-1.5">
          {crossing.facts.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
              {f}
            </li>
          ))}
          {horario && (
            <li className="flex items-start gap-2 text-[13.5px] text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
              Horario reportado hoy por CBP: {horario}
            </li>
          )}
        </ul>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(crossing.mapsQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full border border-sage px-5 py-2 text-[13px] font-semibold text-sage-ink transition-colors hover:bg-sage hover:text-white"
        >
          Cómo llegar {toThe(crossing)} (Google Maps)
        </a>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Preguntas frecuentes sobre {the(crossing)}
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

      {/* Otros cruces de la ciudad */}
      {others.length > 0 && <OtherCrossings city={city.name} citySlug={city.slug} others={otherPlural(city)} all={thePlural(city)} list={others} />}

      <p className="mt-8 text-[12.5px] leading-relaxed text-ink-faint">
        Ver el{" "}
        <Link href={`/ciudad/${city.slug}`} className="font-medium text-sage-ink hover:underline">
          reporte de {termPlural(city)} de {city.name} en vivo
        </Link>{" "}
        o consulta los{" "}
        <Link href="/horarios-puentes-internacionales" className="font-medium text-sage-ink hover:underline">
          horarios de todos los puentes
        </Link>
        .
      </p>
    </div>
  );
}

function OtherCrossings({
  city,
  citySlug,
  others,
  all,
  list,
}: {
  city: string;
  citySlug: string;
  others: string;
  all: string;
  list: Crossing[];
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        {others.charAt(0).toUpperCase() + others.slice(1)} de {city}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {list.map((o) => (
          <Link
            key={o.slug}
            href={`/puente/${o.slug}`}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-sage/40 hover:text-sage-ink"
          >
            {o.name}
          </Link>
        ))}
      </div>
      <Link href={`/ciudad/${citySlug}`} className="mt-3 inline-block text-[12.5px] font-medium text-sage-ink hover:underline">
        Comparar {all.startsWith("las") ? "todas" : "todos"} {all} de {city} →
      </Link>
    </section>
  );
}
