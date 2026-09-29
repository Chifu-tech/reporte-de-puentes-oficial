import type { LaneData } from "@/lib/cbp";
import { severityOf } from "@/lib/cbp";
import { sevStyles, formatMinutes } from "@/lib/severity";

export function LaneRow({ lane }: { lane: LaneData }) {
  const sev = sevStyles[severityOf(lane)];
  const status = lane.status.toLowerCase();
  const closed = status.includes("closed") || status.includes("cerrado");
  const pending = status.includes("pending");
  const na = lane.delayMinutes === null && !closed && !pending && status === "";

  if (na || pending) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line-soft bg-bone px-4 py-3">
        <span className="text-[13.5px] font-medium text-ink-soft">{lane.label}</span>
        <span className="text-[12.5px] text-ink-faint">
          {pending ? "Actualización pendiente" : "No disponible"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-line-soft bg-surface px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className={`inline-block h-2 w-2 rounded-full ${sev.dot}`} aria-hidden />
        <span className="text-[13.5px] font-medium text-ink">{lane.label}</span>
        {lane.lanesOpen !== null && lane.lanesOpen > 0 && (
          <span className="rounded-full bg-bone px-2 py-0.5 text-[11px] text-ink-faint ring-1 ring-line">
            {lane.lanesOpen} {lane.key === "pedestrian" ? "líneas" : "carriles"}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        {closed ? (
          <span className="text-[13.5px] font-semibold text-ink-faint">Cerrado</span>
        ) : (
          <>
            <span className={`text-xl font-semibold tabular ${sev.text}`}>
              {formatMinutes(lane.delayMinutes)}
            </span>
            <span className="text-[11px] font-medium text-ink-faint">min</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function LaneGrid({ lanes, title }: { lanes: LaneData[]; title?: string }) {
  const visible = lanes.filter((l) => {
    const has = l.delayMinutes !== null || l.lanesOpen !== null || l.status !== "";
    return has;
  });
  if (visible.length === 0) return null;
  return (
    <div>
      {title && <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>}
      <div className="grid gap-2 sm:grid-cols-2">
        {visible.map((l) => (
          <LaneRow key={l.key} lane={l} />
        ))}
      </div>
    </div>
  );
}
