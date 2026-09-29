import type { Metadata } from "next";
import Link from "next/link";
import Board from "@/components/Board";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildBoard } from "@/lib/board";
import { sevStyles } from "@/lib/severity";
import { site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Reporte de Puentes Oficial — Tiempo de espera en puentes México–Estados Unidos",
  description:
    "Consulta en tiempo real cuánto se tarda el cruce en cada puente internacional de México a Estados Unidos: Ciudad Juárez, Tijuana, Reynosa, Nuevo Laredo, Mexicali, Nogales y más. En coche o a pie, carriles abiertos y cámaras en vivo.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const board = await buildBoard();
  const total = board.reduce((acc, c) => acc + c.crossings.length, 0);

  // El "puente" del hero: una barra por puente con espera reportada.
  const withData = board
    .flatMap((c) => c.crossings)
    .filter((c) => !c.pedestrianOnly && c.auto.hasData && c.auto.severity !== "cerrado");
  const maxMin = Math.max(...withData.map((c) => c.auto.minutes ?? 0), 30);
  const avg =
    withData.length > 0
      ? Math.round(
          withData.reduce((acc, c) => acc + (c.auto.minutes ?? 0), 0) / withData.length
        )
      : null;
  const bars = withData.slice(0, 44);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          inLanguage: "es-MX",
          description: site.description,
        }}
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="pb-6 pt-9">
          <h1 className="text-balance font-display text-[34px] font-normal leading-[1.05] tracking-tight text-ink sm:text-[42px]">
            ¿Cuál cruce te conviene hoy?
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            {total} puentes de la frontera México–Estados Unidos, en tiempo real y con datos
            oficiales de U.S. CBP.
          </p>

          {bars.length > 0 && (
            <figure className="mt-7" aria-label="Espera actual de cada puente en una barra">
              {/* La línea punteada es el otro lado; las barras, los puentes */}
              <div className="flex h-16 items-end gap-1 border-t border-dashed border-line pt-2 sm:h-20">
                {bars.map((c) => (
                  <div
                    key={c.slug}
                    className={`w-full rounded-t-[3px] ${sevStyles[c.auto.severity].dot}`}
                    style={{ height: `${Math.max(10, ((c.auto.minutes ?? 0) / maxMin) * 100)}%` }}
                  />
                ))}
              </div>
              <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2 text-[11.5px] text-ink-faint">
                <span>Cada barra es un puente — el color es su espera ahora mismo.</span>
                {avg !== null && (
                  <span className="tabular">
                    Espera promedio de la frontera: <strong className="font-semibold text-ink-soft">{avg} min</strong>
                  </span>
                )}
              </figcaption>
            </figure>
          )}
        </header>

        <div id="ciudades">
          <Board cities={board} />
        </div>

        <AdSlot slot="1234567890" className="mt-10" />

        <section className="mt-10 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-[19px] font-normal tracking-tight text-ink">
            El puente correcto ahorra horas de fila
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
            Las líneas varían más de una hora entre garitas de la misma ciudad: en Juárez, el Libre
            se satura por la mañana mientras Zaragoza o Santa Teresa fluyen; en Tijuana, Otay puede
            ahorrarte dos horas contra San Ysidro. Cada pocos minutos consultamos los tiempos de
            espera oficiales de U.S. Customs and Border Protection: minutos, carriles abiertos,
            Ready Lane, SENTRI y cruce peatonal.
          </p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
            Además, guardamos el historial de cada garita para calcular{" "}
            <Link href="/mejor-hora-para-cruzar" className="font-medium text-sage-ink hover:underline">
              la mejor hora para cruzar
            </Link>
            . Empieza por tu ciudad:{" "}
            {board.slice(0, 8).map((c, i) => (
              <span key={c.slug}>
                <Link href={`/ciudad/${c.slug}`} className="font-medium text-sage-ink hover:underline">
                  {c.name}
                </Link>
                {i < Math.min(board.length, 8) - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </section>
      </div>
    </>
  );
}
