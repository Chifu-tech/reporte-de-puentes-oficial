import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { crossingsForCity, sortedCities } from "@/lib/crossings";
import { fetchLiveCrossings, type CrossingLive, type LaneData } from "@/lib/cbp";
import { formatLocalNow, hoursEs } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Horarios de los puentes internacionales y garitas hoy (México–EU)",
  description:
    "¿A qué hora abre y cierra cada puente internacional y garita entre México y Estados Unidos? Horarios oficiales de U.S. CBP de hoy: cuáles abren 24 horas, cuáles cierran de noche y qué carriles tiene cada uno.",
  alternates: { canonical: "/horarios-puentes-internacionales" },
};

function has(l: LaneData | undefined): boolean {
  if (!l) return false;
  const s = l.status.toLowerCase();
  return l.delayMinutes !== null || (s !== "" && s !== "n/a");
}

function lanesLabel(live: CrossingLive | undefined, pedestrianOnly: boolean): string {
  if (!live) return "—";
  const out: string[] = [];
  if (!pedestrianOnly && has(live.lanes.standard)) out.push("coche");
  if (!pedestrianOnly && has(live.lanes.ready)) out.push("Ready Lane");
  if (!pedestrianOnly && has(live.lanes.sentri)) out.push("SENTRI");
  if (has(live.lanes.pedestrian)) out.push("peatonal");
  return out.length > 0 ? out.join(" · ") : "—";
}

export default async function HorariosPage() {
  let live: Map<string, CrossingLive> = new Map();
  try {
    live = await fetchLiveCrossings();
  } catch {
    // CBP caído: la tabla muestra guiones
  }
  const updated = formatLocalNow("America/Mexico_City");

  const groups = sortedCities.map((city) => ({
    city,
    rows: crossingsForCity(city.slug).map((c) => {
      const l = live.get(c.slug);
      return { c, l, hours: hoursEs(l?.hours), is24: /24\s*hrs?/i.test(l?.hours ?? "") };
    }),
  }));
  const all = groups.flatMap((g) => g.rows);
  const open24 = all.filter((r) => r.is24);
  const limited = all.filter((r) => r.hours && !r.is24);

  const faqs = [
    {
      q: "¿Qué puentes internacionales abren las 24 horas?",
      a: `Según U.S. CBP, abren las 24 horas: ${open24.map((r) => r.c.name).join(", ")}.`,
    },
    {
      q: "¿Qué puentes y garitas cierran de noche?",
      a: `Tienen horario limitado: ${limited.map((r) => `${r.c.name} (${r.hours})`).join("; ")}.`,
    },
    {
      q: "¿El horario de los puentes cambia en días festivos?",
      a: "Puede cambiar. CBP ajusta horarios por días festivos, obras u operativos especiales. Esta página se actualiza sola con el horario que CBP reporta cada día; si vas a cruzar tarde, revísala antes de salir.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            {
              "@type": "ListItem",
              position: 2,
              name: "Horarios de los puentes internacionales",
              item: absoluteUrl("/horarios-puentes-internacionales"),
            },
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

      <header className="mb-8">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          Horarios de los puentes internacionales y garitas
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          El horario de cada puerto de entrada de México a Estados Unidos, tal como lo reporta U.S.
          Customs and Border Protection (CBP) hoy. {open24.length} de {all.length} cruces abren las 24
          horas; el resto cierra de noche. Toca un cruce para ver su línea en vivo.
        </p>
        <p className="mt-2 text-[11.5px] text-ink-faint">
          Consultado a CBP el <time dateTime={updated.iso}>{updated.label}</time> (hora del centro de México)
        </p>
      </header>

      <div className="space-y-6">
        {groups.map(({ city, rows }) => (
          <section key={city.slug} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <h2 className="border-b border-line-soft px-4 py-3 text-[15px] font-semibold text-ink">
              <Link href={`/ciudad/${city.slug}`} className="hover:text-sage-ink">
                {city.name} ↔ {city.nameUs}
              </Link>
            </h2>
            <table className="w-full text-left text-[13px]">
              <thead className="sr-only">
                <tr>
                  <th>Cruce</th>
                  <th>Horario</th>
                  <th>Carriles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map(({ c, l, hours }) => (
                  <tr key={c.slug}>
                    <td className="px-4 py-2.5 align-top">
                      <Link href={`/puente/${c.slug}`} className="font-medium text-ink hover:text-sage-ink">
                        {c.name}
                      </Link>
                      {l?.portStatus === "Closed" && (
                        <span className="ml-2 rounded-full bg-gris-soft px-2 py-0.5 text-[10.5px] font-semibold text-gris">
                          cerrado ahora
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 align-top text-ink-soft">{hours ?? "—"}</td>
                    <td className="hidden px-4 py-2.5 align-top text-ink-faint sm:table-cell">
                      {lanesLabel(l, c.pedestrianOnly ?? false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <AdSlot slot="6677889900" className="mt-10" />

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Preguntas frecuentes sobre horarios</h2>
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
        <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">
          ¿Quieres saber a qué hora hay menos fila? Revisa{" "}
          <Link href="/mejor-hora-para-cruzar" className="font-medium text-sage-ink hover:underline">
            la mejor hora para cruzar
          </Link>{" "}
          en cada ciudad.
        </p>
      </section>
    </div>
  );
}
