import { crossings } from "./crossings";

const CBP_API = "https://bwt.cbp.gov/api/waittimes";

export type LaneKey = "standard" | "ready" | "sentri" | "pedestrian" | "commercial" | "fast";

export interface LaneData {
  key: LaneKey;
  label: string;
  status: string;
  delayMinutes: number | null;
  lanesOpen: number | null;
  maxLanes: number | null;
  updatedAt: string | null;
}

export interface CrossingLive {
  portNumber: string;
  portStatus: string;
  hours: string;
  lanes: Record<LaneKey, LaneData>;
}

export type Severity = "verde" | "amarillo" | "rojo" | "cerrado" | "sin-datos";

interface CbpLane {
  update_time?: string;
  operational_status?: string;
  delay_minutes?: string;
  lanes_open?: string;
}

interface CbpPort {
  port_number: string;
  port_status: string;
  hours: string;
  passenger_vehicle_lanes?: {
    maximum_lanes?: string;
    standard_lanes?: CbpLane;
    NEXUS_SENTRI_lanes?: CbpLane;
    ready_lanes?: CbpLane;
  };
  pedestrian_lanes?: {
    maximum_lanes?: string;
    standard_lanes?: CbpLane;
  };
  commercial_vehicle_lanes?: {
    maximum_lanes?: string;
    standard_lanes?: CbpLane;
    FAST_lanes?: CbpLane;
  };
}

function toInt(value?: string): number | null {
  if (value === undefined || value === null || value.trim() === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function lane(key: LaneKey, label: string, raw: CbpLane | undefined, maxLanes?: string): LaneData {
  return {
    key,
    label,
    status: raw?.operational_status?.trim() || "",
    delayMinutes: toInt(raw?.delay_minutes),
    lanesOpen: toInt(raw?.lanes_open),
    maxLanes: toInt(maxLanes),
    updatedAt: raw?.update_time?.trim() || null,
  };
}

export function severityOf(l: LaneData): Severity {
  const status = l.status.toLowerCase();
  if (status.includes("closed") || status.includes("cerrado")) return "cerrado";
  if (l.delayMinutes === null) return "sin-datos";
  if (l.delayMinutes <= 20) return "verde";
  if (l.delayMinutes <= 44) return "amarillo";
  return "rojo";
}

/** Métrica principal de un cruce según el modo de cruce. */
export function primaryLane(live: CrossingLive | undefined, mode: "auto" | "peaton"): LaneData | null {
  if (!live) return null;
  const preferred = mode === "peaton" ? "pedestrian" : "standard";
  const l = live.lanes[preferred];
  if (l && (l.delayMinutes !== null || l.status)) return l;
  return live.lanes.pedestrian ?? live.lanes.standard ?? null;
}

export function laneHasData(l: LaneData | null | undefined): boolean {
  if (!l) return false;
  return l.delayMinutes !== null || (l.status !== "" && l.status.toLowerCase() !== "n/a");
}

export async function fetchCbpPorts(): Promise<Map<string, CbpPort>> {
  const res = await fetch(CBP_API, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`CBP API respondió ${res.status}`);
  const data = (await res.json()) as CbpPort[];
  return new Map(data.map((p) => [p.port_number, p]));
}

export async function fetchLiveCrossings(): Promise<Map<string, CrossingLive>> {
  const ports = await fetchCbpPorts();
  const out = new Map<string, CrossingLive>();
  for (const crossing of crossings) {
    const p = ports.get(crossing.portNumber);
    if (!p) continue;
    out.set(crossing.slug, {
      portNumber: p.port_number,
      portStatus: p.port_status,
      hours: p.hours,
      lanes: {
        standard: lane("standard", "Normal", p.passenger_vehicle_lanes?.standard_lanes, p.passenger_vehicle_lanes?.maximum_lanes),
        ready: lane("ready", "Ready Lane", p.passenger_vehicle_lanes?.ready_lanes, p.passenger_vehicle_lanes?.maximum_lanes),
        sentri: lane("sentri", "SENTRI", p.passenger_vehicle_lanes?.NEXUS_SENTRI_lanes, p.passenger_vehicle_lanes?.maximum_lanes),
        pedestrian: lane("pedestrian", "Peatonal", p.pedestrian_lanes?.standard_lanes, p.pedestrian_lanes?.maximum_lanes),
        commercial: lane("commercial", "Carga", p.commercial_vehicle_lanes?.standard_lanes, p.commercial_vehicle_lanes?.maximum_lanes),
        fast: lane("fast", "FAST", p.commercial_vehicle_lanes?.FAST_lanes, p.commercial_vehicle_lanes?.maximum_lanes),
      },
    });
  }
  return out;
}

/** Snapshot plano para el cron histórico. */
export function flattenForSnapshot(live: CrossingLive): Array<{
  laneKey: LaneKey;
  delayMinutes: number | null;
  lanesOpen: number | null;
  status: string;
}> {
  return Object.values(live.lanes).map((l) => ({
    laneKey: l.key,
    delayMinutes: l.delayMinutes,
    lanesOpen: l.lanesOpen,
    status: l.status,
  }));
}

export async function fetchRawCbp(): Promise<CbpPort[]> {
  const res = await fetch(CBP_API, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CBP API respondió ${res.status}`);
  return res.json();
}
