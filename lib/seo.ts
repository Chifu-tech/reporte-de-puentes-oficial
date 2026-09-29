import type { City, Crossing } from "./crossings";
import { crossingsForCity } from "./crossings";
import { severityOf, type CrossingLive, type LaneData } from "./cbp";
import { formatMinutes } from "./severity";

/**
 * Textos SEO (títulos, descripciones, H1) armados con el vocabulario local:
 * "garita" / "la línea" en BC y Sonora, "puente" / "fila" en el resto,
 * más los apodos de cada cruce y los minutos en vivo de CBP.
 */

const PREFIX = /^(puente|garita|línea|linea|puerto|puerta)( de| del)?\s+/i;

function fold(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Apodo principal sin prefijo ("Puente Santa Fe" → "Santa Fe"), o null si no aporta. */
export function nickname(c: Crossing): string | null {
  const first = c.aliases?.[0];
  if (!first || c.name.includes("(")) return null;
  const bare = first.replace(PREFIX, "");
  if (bare.length < 4 || fold(c.name).includes(fold(bare))) return null;
  return bare;
}

/** Nombre para títulos: "Paso del Norte (Santa Fe)". */
export function titleName(c: Crossing): string {
  const nick = nickname(c);
  return nick ? `${c.name} (${nick})` : c.name;
}

/** "el Puente Libre" / "la Garita San Ysidro". */
export function the(c: Crossing): string {
  return /^garita/i.test(c.name) ? `la ${c.name}` : `el ${c.name}`;
}

/** "del Puente Libre" / "de la Garita San Ysidro". */
export function ofThe(c: Crossing): string {
  return /^garita/i.test(c.name) ? `de la ${c.name}` : `del ${c.name}`;
}

/** "al Puente Libre" / "a la Garita San Ysidro". */
export function toThe(c: Crossing): string {
  return /^garita/i.test(c.name) ? `a la ${c.name}` : `al ${c.name}`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clock(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t === "midnight") return "medianoche";
  if (t === "noon") return "mediodía";
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!m) return raw.trim();
  return `${m[1]}:${m[2] ?? "00"} ${m[3] === "am" ? "a.m." : "p.m."}`;
}

/** Horario de CBP en español: "6 am-10 pm" → "de 6:00 a.m. a 10:00 p.m.". */
export function hoursEs(hours: string | undefined | null): string | null {
  if (!hours) return null;
  const h = hours.trim();
  if (/24\s*hrs?/i.test(h)) return "las 24 horas, todos los días";
  const m = h.match(/^(.+?)\s*-\s*(.+)$/);
  if (!m) return h;
  return `de ${clock(m[1])} a ${clock(m[2])}`;
}

export function termPlural(city: City): string {
  return city.term === "garita" ? "garitas" : "puentes";
}

/** "las garitas" / "los puentes". */
export function thePlural(city: City): string {
  return city.term === "garita" ? "las garitas" : "los puentes";
}

/** "otras garitas" / "otros puentes". */
export function otherPlural(city: City): string {
  return city.term === "garita" ? "otras garitas" : "otros puentes";
}

/** Nombre corto para listas: sin "Garita (de)" ni el paréntesis final. */
export function shortName(c: Crossing): string {
  return c.name.replace(/^Garita (de )?/, "").replace(/ \(.*\)$/, "");
}

/** "la línea" (garitas) o "la fila" (puentes): como lo dice la gente de cada ciudad. */
export function lineWord(city: City): string {
  return city.term === "garita" ? "la línea" : "la fila";
}

export function minutesText(minutes: number): string {
  if (minutes === 0) return "sin espera";
  return minutes >= 60 ? formatMinutes(minutes) : `${minutes} min`;
}

export interface Headline {
  minutes: number;
  mode: "coche" | "a pie";
  lane: LaneData;
}

/** Espera más representativa del cruce: coche normal, Ready Lane o peatonal (en ese orden). */
export function headlineWait(c: Crossing, live: CrossingLive | undefined): Headline | null {
  if (!live) return null;
  const order: Array<[LaneData, "coche" | "a pie"]> = c.pedestrianOnly
    ? [[live.lanes.pedestrian, "a pie"]]
    : [
        [live.lanes.standard, "coche"],
        [live.lanes.ready, "coche"],
        // SENTRI no: su espera no representa la fila de la mayoría.
        [live.lanes.pedestrian, "a pie"],
      ];
  for (const [lane, mode] of order) {
    if (lane.delayMinutes !== null && severityOf(lane) !== "cerrado") {
      return { minutes: lane.delayMinutes, mode, lane };
    }
  }
  return null;
}

export function crossingTitle(c: Crossing, city: City, head: Headline | null): string {
  const name = titleName(c);
  if (head) {
    return city.term === "garita"
      ? `${name}: ${minutesText(head.minutes)} de línea${head.mode === "a pie" && !c.pedestrianOnly ? " a pie" : ""} ahora, en vivo`
      : `${name} en vivo: ${minutesText(head.minutes)} de espera${head.mode === "a pie" && !c.pedestrianOnly ? " a pie" : ""} ahora`;
  }
  return city.term === "garita"
    ? `${name}: cómo está la línea hoy, en vivo`
    : `${name} en vivo: tiempo de espera y fila hoy`;
}

export function crossingDescription(c: Crossing, city: City, live: CrossingLive | undefined): string {
  const std = live?.lanes.standard;
  const ped = live?.lanes.pedestrian;
  const parts: string[] = [];
  if (!c.pedestrianOnly && std?.delayMinutes != null) parts.push(`en coche ${minutesText(std.delayMinutes)}`);
  if (ped?.delayMinutes != null) parts.push(`a pie ${minutesText(ped.delayMinutes)}`);
  const now = parts.length > 0 ? `Ahora: ${parts.join(", ")}. ` : "";
  const extra = (c.aliases ?? []).filter((a) => !fold(c.name).includes(fold(a.replace(PREFIX, "")))).slice(0, 2);
  const called = /^garita/i.test(c.name) ? "también llamada" : "también llamado";
  const aka = extra.length > 0 ? `, ${called} ${extra.join(" o ")},` : "";
  const lanes = c.pedestrianOnly ? "de la línea peatonal y Ready Lane" : "en coche, a pie, SENTRI y Ready Lane";
  return `¿Cómo está ${lineWord(city)} en ${the(c)}${aka} hoy? ${now}Tiempo de espera en vivo ${lanes}, horario, cámaras y la mejor hora para cruzar a ${city.nameUs}.`;
}

export function cityTitle(city: City): string {
  if (city.term === "garita") {
    const names = crossingsForCity(city.slug)
      .filter((c) => !c.pedestrianOnly)
      .slice(0, 2)
      .map((c) => c.name.replace(/^Garita (de )?/, "").replace(/ \(.*\)$/, ""));
    const which = names.length > 0 ? ` en ${names.join(" y ")}` : "";
    return `Garitas de ${city.name} en vivo hoy: cómo está la línea${which}`;
  }
  return `Reporte de Puentes ${city.name.replace(/^Ciudad /, "")}–${city.nameUs} EN VIVO hoy: fila y tiempo de espera`;
}

export function cityDescription(city: City, live: Map<string, CrossingLive>): string {
  const list = crossingsForCity(city.slug);
  const now = list
    .map((c) => {
      const h = headlineWait(c, live.get(c.slug));
      return h ? `${shortName(c)} ${minutesText(h.minutes)}` : null;
    })
    .filter(Boolean)
    .slice(0, 4);
  const lead = now.length > 0 ? `Ahora: ${now.join(" · ")}. ` : "";
  const kind = city.term === "garita" ? `Reporte de garitas de ${city.name}` : `Reporte de puentes de ${city.name}`;
  return `${lead}${kind} en vivo: tiempo de espera en coche y a pie, carriles SENTRI y Ready Lane, cámaras y la mejor hora para cruzar a ${city.nameUs}.`;
}

export function cityH1(city: City): string {
  return city.term === "garita"
    ? `Garitas de ${city.name}: cómo está la línea hoy`
    : `Reporte de puentes de ${city.name} en vivo`;
}

/** "martes 29 de septiembre, 10:45 a.m." en la zona horaria de la ciudad. */
export function formatLocalNow(tz: string, date = new Date()): { label: string; iso: string } {
  const day = new Intl.DateTimeFormat("es-MX", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("es-MX", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return { label: `${day}, ${time}`, iso: date.toISOString() };
}

/** Hora local (0-23) en la zona horaria dada. */
export function localHour(tz: string, date = new Date()): number {
  const h = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hour12: false }).format(date);
  return Number.parseInt(h, 10) % 24;
}

export function hourLabel(hour: number): string {
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00 ${suffix}`;
}
