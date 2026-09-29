"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CityDisplay, CrossingDisplay, LaneSnapshot, Mode } from "@/lib/board";
import { sevStyles, formatMinutes } from "@/lib/severity";
import { track } from "@/lib/track";

function Row({ c, mode }: { c: CrossingDisplay; mode: Mode }) {
  const snap: LaneSnapshot = mode === "auto" && !c.pedestrianOnly ? c.auto : c.peaton;
  const sev = sevStyles[snap.severity];
  const closed = snap.severity === "cerrado";
  const other = mode === "auto" && !c.pedestrianOnly ? c.peaton : c.auto;
  const showOther = !c.pedestrianOnly && other.hasData && other.severity !== "cerrado";

  return (
    <Link
      href={`/puente/${c.slug}`}
      className="flex min-h-[52px] items-center gap-3 px-4 py-3 transition-colors hover:bg-bone active:bg-bone"
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${sev.dot}`} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-ink">{c.name}</span>
        {c.pedestrianOnly && (
          <span className="block text-[11px] text-ink-faint">solo peatonal</span>
        )}
      </span>
      {showOther && (
        <span className="shrink-0 text-[11.5px] tabular text-ink-faint">
          {mode === "auto" ? "🚶" : "🚗"} {formatMinutes(other.minutes)}m
        </span>
      )}
      <span
        className={`w-[72px] shrink-0 text-right text-[18px] font-semibold tabular ${
          closed ? "text-[13px] font-medium text-ink-faint" : sev.text
        }`}
      >
        {closed ? "Cerrado" : snap.hasData ? formatMinutes(snap.minutes) : "—"}
      </span>
      <span className="shrink-0 text-ink-faint" aria-hidden>
        ›
      </span>
    </Link>
  );
}

export default function Board({ cities }: { cities: CityDisplay[] }) {
  const [mode, setMode] = useState<Mode>("auto");
  const [query, setQuery] = useState("");

  // Qué buscan (y con qué apodos) — se manda cuando dejan de escribir.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => track("buscar", { search_term: q.slice(0, 100) }), 1200);
    return () => clearTimeout(t);
  }, [query]);

  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    track("cambiar_modo", { modo: next });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nq = norm(q);
    return cities
      .map((city) => ({
        ...city,
        crossings: city.crossings.filter(
          (c) =>
            norm(c.name).includes(nq) ||
            norm(c.nameUs).includes(nq) ||
            c.aliases.some((a) => norm(a).includes(nq)) ||
            norm(city.name).includes(nq)
        ),
      }))
      .filter((city) => city.crossings.length > 0);
  }, [cities, query]);

  return (
    <div>
      {/* Controles fijos: el pulgar siempre alcanza el toggle */}
      <div className="sticky top-[57px] z-30 -mx-4 border-b border-line bg-bone/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex gap-2">
          <div
            role="tablist"
            aria-label="Modo de cruce"
            className="flex flex-1 rounded-full border border-line bg-surface p-1"
          >
            <button
              role="tab"
              aria-selected={mode === "auto"}
              onClick={() => changeMode("auto")}
              className={`flex-1 rounded-full py-1.5 text-[13.5px] font-semibold transition-colors ${
                mode === "auto" ? "bg-sage text-white" : "text-ink-soft"
              }`}
            >
              🚗 En coche
            </button>
            <button
              role="tab"
              aria-selected={mode === "peaton"}
              onClick={() => changeMode("peaton")}
              className={`flex-1 rounded-full py-1.5 text-[13.5px] font-semibold transition-colors ${
                mode === "peaton" ? "bg-sage text-white" : "text-ink-soft"
              }`}
            >
              🚶 A pie
            </button>
          </div>
          <label className="relative shrink-0">
            <span className="sr-only">Buscar puente o ciudad</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar…"
              className="h-full w-28 rounded-full border border-line bg-surface px-3.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-sage focus:outline-none sm:w-44"
            />
          </label>
        </div>
      </div>

      {/* Lista de puentes por ciudad */}
      <div className="space-y-7 pt-6">
        {filtered.map((city) => (
          <section key={city.slug} aria-label={`Puentes de ${city.name}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 px-1">
              <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-ink-faint">
                {city.name} · {city.nameUs}
              </h2>
              {city.best && mode === "auto" && !city.crossings.every((c) => c.pedestrianOnly) && (
                <span className="max-w-[55%] truncate text-[11px] font-semibold text-verde">
                  Mejor: {city.best.name} {formatMinutes(city.best.minutes)}m
                </span>
              )}
            </div>
            <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line bg-surface">
              {city.crossings.map((c) => (
                <Row key={c.slug} c={c} mode={mode} />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-soft">
            Nada con «{query}». Prueba «Zaragoza» o «Tijuana».
          </p>
        )}
      </div>
    </div>
  );
}
