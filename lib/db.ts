import { createClient, type Client } from "@libsql/client";

export interface SnapshotRow {
  port_number: string;
  captured_at: string;
  lane_key: string;
  delay_minutes: number | null;
  lanes_open: number | null;
  status: string;
}

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
    client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb(): Promise<void> {
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      port_number TEXT NOT NULL,
      captured_at TEXT NOT NULL,
      lane_key TEXT NOT NULL,
      delay_minutes INTEGER,
      lanes_open INTEGER,
      status TEXT NOT NULL
    )
  `);
  await getDb().execute(
    "CREATE INDEX IF NOT EXISTS idx_snapshots_port_time ON snapshots(port_number, captured_at)"
  );
}

/** Minutos desde la última captura (null si no hay datos o falla la DB). */
export async function minutesSinceLastCapture(): Promise<number | null> {
  try {
    await initDb();
    const rs = await getDb().execute("SELECT MAX(captured_at) as last FROM snapshots");
    const last = rs.rows[0]?.last;
    if (typeof last !== "string") return null;
    const age = (Date.now() - new Date(last).getTime()) / 60000;
    return Number.isFinite(age) ? age : null;
  } catch {
    return null;
  }
}

export async function insertSnapshots(rows: SnapshotRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  await initDb();
  const db = getDb();
  const sql =
    "INSERT INTO snapshots (port_number, captured_at, lane_key, delay_minutes, lanes_open, status) VALUES (?, ?, ?, ?, ?, ?)";
  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await db.batch(
      chunk.map((r) => ({
        sql,
        args: [r.port_number, r.captured_at, r.lane_key, r.delay_minutes, r.lanes_open, r.status],
      })),
      "write"
    );
  }
  return rows.length;
}

export interface HourAverage {
  hour: number;
  avgDelay: number | null;
  samples: number;
}

/**
 * Promedio de espera por hora local del cruce, con los snapshots
 * de los últimos `days` días. Devuelve 24 entradas (0-23).
 */
export async function averageDelayByHour(
  portNumber: string,
  laneKeys: string[],
  tz: string,
  days = 14
): Promise<HourAverage[]> {
  const sums = new Array(24).fill(0);
  const counts = new Array(24).fill(0);
  try {
    await initDb();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const placeholders = laneKeys.map(() => "?").join(",");
    const rs = await getDb().execute({
      sql: `SELECT captured_at, delay_minutes FROM snapshots
            WHERE port_number = ? AND lane_key IN (${placeholders})
              AND captured_at >= ? AND delay_minutes IS NOT NULL`,
      args: [portNumber, ...laneKeys, since],
    });
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz });
    for (const row of rs.rows) {
      const d = new Date(row.captured_at as string);
      const hour = Number.parseInt(fmt.format(d), 10) % 24;
      const delay = row.delay_minutes as number;
      if (hour >= 0 && hour < 24 && delay >= 0 && delay < 600) {
        sums[hour] += delay;
        counts[hour] += 1;
      }
    }
  } catch {
    // DB sin configurar o vacía: devolver promedios nulos
  }
  return sums.map((s, h) => ({
    hour: h,
    avgDelay: counts[h] > 0 ? Math.round(s / counts[h]) : null,
    samples: counts[h],
  }));
}

export interface DayOfWeekAverage {
  day: number; // 0 = domingo
  avgDelay: number | null;
}

export async function averageDelayByDay(
  portNumber: string,
  laneKeys: string[],
  tz: string,
  days = 60
): Promise<DayOfWeekAverage[]> {
  const sums = new Array(7).fill(0);
  const counts = new Array(7).fill(0);
  try {
    await initDb();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const placeholders = laneKeys.map(() => "?").join(",");
    const rs = await getDb().execute({
      sql: `SELECT captured_at, delay_minutes FROM snapshots
            WHERE port_number = ? AND lane_key IN (${placeholders})
              AND captured_at >= ? AND delay_minutes IS NOT NULL`,
      args: [portNumber, ...laneKeys, since],
    });
    const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz });
    const dayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    for (const row of rs.rows) {
      const d = new Date(row.captured_at as string);
      const idx = dayIndex[fmt.format(d)];
      const delay = row.delay_minutes as number;
      if (idx !== undefined && delay >= 0 && delay < 600) {
        sums[idx] += delay;
        counts[idx] += 1;
      }
    }
  } catch {
    // sin datos
  }
  return sums.map((s, i) => ({ day: i, avgDelay: counts[i] > 0 ? Math.round(s / counts[i]) : null }));
}
