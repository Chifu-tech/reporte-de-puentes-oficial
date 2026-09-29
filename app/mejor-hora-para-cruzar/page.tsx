import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";
import { sortedCities, crossingsForCity } from "@/lib/crossings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mejor hora para cruzar la frontera México–Estados Unidos",
  description:
    "Descubre la mejor hora para cruzar cada puente internacional de México a Estados Unidos según promedios históricos de espera: madrugada vs hora pico, por día de la semana, en cada garita.",
  alternates: { canonical: "/mejor-hora-para-cruzar" },
};

export default function MejorHoraIndex() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Mejor hora para cruzar la frontera México–Estados Unidos",
          url: `${site.url}/mejor-hora-para-cruzar`,
          inLanguage: "es-MX",
        }}
      />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          La mejor hora para cruzar, según datos
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Cada 15 minutos registramos los tiempos de espera oficiales de U.S. CBP en cada garita.
          Con ese historial calculamos el promedio de espera por hora y por día de la semana, para
          que sepas cuándo conviene cruzar en tu ciudad. Elige tu frontera:
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCities.map((city) => (
          <Link
            key={city.slug}
            href={`/mejor-hora-para-cruzar/${city.slug}`}
            className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:border-sage/40 hover:shadow-[0_2px_12px_rgba(47,107,94,0.08)]"
          >
            <h2 className="text-[15.5px] font-semibold text-ink group-hover:text-sage-ink">{city.name}</h2>
            <p className="mt-0.5 text-xs text-ink-faint">
              {city.nameUs}, {city.stateUs} · {crossingsForCity(city.slug).length}{" "}
              {crossingsForCity(city.slug).length === 1 ? "puente" : "puentes"}
            </p>
          </Link>
        ))}
      </div>

      <AdSlot slot="4455667788" className="mt-10" />

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Reglas de oro para cruzar rápido</h2>
        <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">La madrugada casi siempre gana.</strong> Entre
              las 4 y 6 a.m. la mayoría de las garitas registra sus esperas mínimas del día.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">Evita las 8–11 a.m.</strong> Es la ventana
              con más tráfico: trabajadores transfronterizos y cruce escolar.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">Domingo por la tarde y lunes temprano</strong>{" "}
              concentran los retornos de fin de semana: considera cruzar sábado por la mañana.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">Compara puentes, no solo horarios.</strong>{" "}
              Muchas veces conviene manejar 15 minutos extra a una garita alternativa que estar una
              hora en la fila del puente principal.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
