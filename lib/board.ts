import { crossings, sortedCities, citiesBySlug } from "./crossings";
import {
  fetchLiveCrossings,
  laneHasData,
  primaryLane,
  severityOf,
  type CrossingLive,
  type LaneData,
  type Severity,
} from "./cbp";

export type Mode = "auto" | "peaton";

export interface LaneSnapshot {
  minutes: number | null;
  lanesOpen: number | null;
  severity: Severity;
  updatedAt: string | null;
  hasData: boolean;
}

export interface CrossingDisplay {
  slug: string;
  name: string;
  nameUs: string;
  citySlug: string;
  pedestrianOnly: boolean;
  auto: LaneSnapshot;
  peaton: LaneSnapshot;
  readyMinutes: number | null;
  sentriMinutes: number | null;
}

export interface CityDisplay {
  slug: string;
  name: string;
  state: string;
  nameUs: string;
  stateUs: string;
  crossings: CrossingDisplay[];
  best: { slug: string; name: string; minutes: number } | null;
}

function snapshot(live: CrossingLive | undefined, mode: Mode): LaneSnapshot {
  const lane: LaneData | null = primaryLane(live, mode);
  if (!lane || !laneHasData(lane)) {
    return { minutes: null, lanesOpen: null, severity: "sin-datos", updatedAt: lane?.updatedAt ?? null, hasData: false };
  }
  const sev = severityOf(lane);
  return {
    minutes: lane.delayMinutes,
    lanesOpen: lane.lanesOpen,
    severity: sev === "cerrado" ? "cerrado" : sev,
    updatedAt: lane.updatedAt,
    hasData: true,
  };
}

export async function buildBoard(): Promise<CityDisplay[]> {
  const live = await fetchLiveCrossings();

  const board: CityDisplay[] = sortedCities.map((city) => {
    const list: CrossingDisplay[] = crossings
      .filter((c) => c.citySlug === city.slug)
      .map((c) => {
        const l = live.get(c.slug);
        const auto = snapshot(l, "auto");
        const peaton = snapshot(l, "peaton");
        return {
          slug: c.slug,
          name: c.name,
          nameUs: c.nameUs,
          citySlug: c.citySlug,
          pedestrianOnly: c.pedestrianOnly ?? false,
          auto,
          peaton,
          readyMinutes: l?.lanes.ready.delayMinutes ?? null,
          sentriMinutes: l?.lanes.sentri.delayMinutes ?? null,
        };
      });

    const candidates = list.filter((c) => c.auto.hasData && c.auto.severity !== "cerrado");
    const best =
      candidates.length > 0
        ? candidates.reduce((acc, cur) => {
            const a = acc.auto.minutes ?? 999;
            const b = cur.auto.minutes ?? 999;
            return b < a
              ? cur
              : acc;
          })
        : null;

    return {
      slug: city.slug,
      name: city.name,
      state: city.state,
      nameUs: city.nameUs,
      stateUs: city.stateUs,
      crossings: list,
      best: best ? { slug: best.slug, name: best.name, minutes: best.auto.minutes ?? 0 } : null,
    };
  });

  return board;
}

export function cityBySlugOrThrow(slug: string) {
  const city = citiesBySlug.get(slug);
  if (!city) throw new Error(`Ciudad desconocida: ${slug}`);
  return city;
}
