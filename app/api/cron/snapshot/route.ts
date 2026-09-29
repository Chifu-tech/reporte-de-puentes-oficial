import { NextResponse } from "next/server";
import { crossings } from "@/lib/crossings";
import { fetchRawCbp, type LaneKey } from "@/lib/cbp";
import { insertSnapshots, minutesSinceLastCapture, type SnapshotRow } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CbpLaneRaw {
  update_time?: string;
  operational_status?: string;
  delay_minutes?: string;
  lanes_open?: string;
}

interface CbpPortRaw {
  port_number: string;
  port_status?: string;
  hours?: string;
  passenger_vehicle_lanes?: {
    standard_lanes?: CbpLaneRaw;
    ready_lanes?: CbpLaneRaw;
    NEXUS_SENTRI_lanes?: CbpLaneRaw;
  };
  pedestrian_lanes?: { standard_lanes?: CbpLaneRaw };
  commercial_vehicle_lanes?: {
    standard_lanes?: CbpLaneRaw;
    FAST_lanes?: CbpLaneRaw;
  };
}

function toInt(v: unknown): number | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = req.headers.get("authorization");
    const url = new URL(req.url);
    const provided = header?.replace("Bearer ", "") ?? url.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }
  }

  // Guard anti-duplicados: si otro scheduler acaba de capturar, se omite.
  const age = await minutesSinceLastCapture();
  if (age !== null && age < 10) {
    return NextResponse.json({ ok: true, skipped: true, minutesSinceLast: Math.round(age) });
  }

  try {
    const raw = (await fetchRawCbp()) as CbpPortRaw[];
    const byPort = new Map(raw.map((p) => [p.port_number, p]));
    const capturedAt = new Date().toISOString();
    const rows: SnapshotRow[] = [];

    for (const crossing of crossings) {
      const port = byPort.get(crossing.portNumber);
      if (!port) continue;

      const lanes: Array<[LaneKey, CbpLaneRaw | undefined]> = [
        ["standard", port.passenger_vehicle_lanes?.standard_lanes],
        ["ready", port.passenger_vehicle_lanes?.ready_lanes],
        ["sentri", port.passenger_vehicle_lanes?.NEXUS_SENTRI_lanes],
        ["pedestrian", port.pedestrian_lanes?.standard_lanes],
        ["commercial", port.commercial_vehicle_lanes?.standard_lanes],
        ["fast", port.commercial_vehicle_lanes?.FAST_lanes],
      ];

      for (const [key, lane] of lanes) {
        rows.push({
          port_number: crossing.portNumber,
          captured_at: capturedAt,
          lane_key: key,
          delay_minutes: toInt(lane?.delay_minutes),
          lanes_open: toInt(lane?.lanes_open),
          status: lane?.operational_status ?? "",
        });
      }
    }

    const inserted = await insertSnapshots(rows);
    return NextResponse.json({ ok: true, capturedAt, rows: inserted });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
