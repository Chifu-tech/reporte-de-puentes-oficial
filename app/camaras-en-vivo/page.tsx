import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import CameraPlayer from "@/components/CameraPlayer";
import JsonLd from "@/components/JsonLd";
import { crossingsForCity, sortedCities } from "@/lib/crossings";
import { site, absoluteUrl } from "@/lib/site";

const withCams = sortedCities
  .map((city) => ({ city, list: crossingsForCity(city.slug).filter((c) => c.cameras && c.cameras.length > 0) }))
  .filter((g) => g.list.length > 0);
const cityNames = withCams.map((g) => g.city.name);

export const metadata: Metadata = {
  title: `Cámaras de puentes y garitas en vivo: ${cityNames.slice(0, 3).join(", ")}`,
  description: `Mira en vivo las cámaras de los puentes internacionales y garitas de ${cityNames.join(", ")}. Transmisiones públicas de la línea en tiempo real, junto con el tiempo de espera oficial de CBP.`,
  alternates: { canonical: "/camaras-en-vivo" },
};

export default function CamarasPage() {
  const total = withCams.reduce((acc, g) => acc + g.list.reduce((a, c) => a + (c.cameras?.length ?? 0), 0), 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            { "@type": "ListItem", position: 2, name: "Cámaras en vivo", item: absoluteUrl("/camaras-en-vivo") },
          ],
        }}
      />

      <header className="mb-8 max-w-2xl">
        <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">
          Cámaras de puentes y garitas en vivo
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          {total} cámaras públicas de la línea en {cityNames.join(", ")}. Úsalas para ver qué tan larga está la
          fila antes de salir, y compáralas con el tiempo de espera oficial de U.S. CBP de cada puente. Son
          transmisiones de terceros (gobiernos locales y fideicomisos de puentes) y pueden caerse sin aviso.
        </p>
      </header>

      <div className="space-y-12">
        {withCams.map(({ city, list }) => (
          <section key={city.slug}>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Cámaras de {city.term === "garita" ? "las garitas" : "los puentes"} de {city.name}
            </h2>
            <div className="mt-5 space-y-8">
              {list.map((c) => (
                <div key={c.slug}>
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[15.5px] font-semibold text-ink">{c.name} en vivo</h3>
                    <Link href={`/puente/${c.slug}`} className="text-[12.5px] font-medium text-sage-ink hover:underline">
                      Tiempo de espera ahora →
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {c.cameras!.map((cam) => (
                      <CameraPlayer key={cam.src} camera={cam} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AdSlot slot="7788990011" className="mt-12" />

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">¿No está tu puente?</h2>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
          Solo publicamos cámaras públicas que se pueden ver sin registro. Si conoces una cámara oficial de otro
          puente o garita,{" "}
          <Link href="/contacto" className="font-medium text-sage-ink hover:underline">
            escríbenos
          </Link>
          . Mientras tanto, el{" "}
          <Link href="/" className="font-medium text-sage-ink hover:underline">
            reporte de puentes en vivo
          </Link>{" "}
          tiene el tiempo de espera de todos los cruces.
        </p>
      </section>
    </div>
  );
}
