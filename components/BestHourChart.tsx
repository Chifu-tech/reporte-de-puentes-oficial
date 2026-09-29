import type { HourAverage } from "@/lib/db";

const DÍAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export default function BestHourChart({ data, tz }: { data: HourAverage[]; tz: string }) {
  const hasData = data.some((d) => d.avgDelay !== null && d.samples > 0);
  if (!hasData) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-bone p-6 text-center">
        <p className="text-sm font-medium text-ink-soft">Estamos recolectando datos históricos</p>
        <p className="mt-1 text-xs text-ink-faint">
          En unos días podrás ver aquí la mejor hora para cruzar, con promedios por hora.
        </p>
      </div>
    );
  }

  const values = data.filter((d) => d.avgDelay !== null).map((d) => d.avgDelay as number);
  const max = Math.max(...values, 10);
  const best = data.reduce<HourAverage | null>(
    (acc, cur) =>
      cur.avgDelay !== null && cur.samples > 0 && (acc === null || (acc.avgDelay ?? 999) > cur.avgDelay)
        ? cur
        : acc,
    null
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px] text-ink-soft">Promedio de espera por hora (últimos 14 días)</p>
        {best && best.avgDelay !== null && (
          <p className="rounded-full bg-verde-soft px-3 py-1 text-[11.5px] font-semibold text-verde">
            Mejor hora: {best.hour}:00 · ~{best.avgDelay} min
          </p>
        )}
      </div>
      <div className="flex h-36 items-end gap-[3px]" role="img" aria-label="Gráfica de espera promedio por hora del día">
        {data.map((d) => {
          const h = d.avgDelay === null ? 0 : Math.max(3, (d.avgDelay / max) * 100);
          const isBest = best !== null && d.hour === best.hour && d.avgDelay !== null;
          const sevClass =
            d.avgDelay === null
              ? "bg-line-soft"
              : d.avgDelay <= 20
                ? "bg-verde/80"
                : d.avgDelay <= 44
                  ? "bg-ambar/80"
                  : "bg-rojo/80";
          return (
            <div key={d.hour} className="group relative flex h-full flex-1 flex-col justify-end">
              <div
                className={`w-full rounded-t-[3px] ${sevClass} ${isBest ? "ring-2 ring-sage" : ""}`}
                style={{ height: `${h}%` }}
              />
              <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[10.5px] font-medium text-white group-hover:block">
                {d.avgDelay === null ? `${d.hour}:00 sin datos` : `${d.hour}:00 · ~${d.avgDelay} min`}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-ink-faint">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">
        Hora local de la garita ({tz.split("/")[1]?.replace("_", " ")}). Promedios calculados con
        datos de U.S. CBP; los tiempos reales pueden variar.
      </p>
    </div>
  );
}

export function DayAverages({ data }: { data: { day: number; avgDelay: number | null }[] }) {
  const hasData = data.some((d) => d.avgDelay !== null);
  if (!hasData) return null;
  const values = data.filter((d) => d.avgDelay !== null).map((d) => d.avgDelay as number);
  const max = Math.max(...values, 10);
  return (
    <div className="mt-6">
      <p className="mb-3 text-[13px] text-ink-soft">Espera promedio por día de la semana (últimos 60 días)</p>
      <div className="flex h-24 items-end gap-2" role="img" aria-label="Gráfica de espera promedio por día de la semana">
        {data.map((d) => {
          const h = d.avgDelay === null ? 0 : Math.max(4, (d.avgDelay / max) * 100);
          const sevClass =
            d.avgDelay === null
              ? "bg-line-soft"
              : d.avgDelay <= 20
                ? "bg-verde/70"
                : d.avgDelay <= 44
                  ? "bg-ambar/70"
                  : "bg-rojo/70";
          return (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-semibold text-ink-faint tabular">
                {d.avgDelay === null ? "" : d.avgDelay}
              </span>
              <div className={`w-full max-w-10 rounded-t-[4px] ${sevClass}`} style={{ height: `${h}%` }} />
              <span className="text-[10.5px] text-ink-faint">{DÍAS[d.day]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
