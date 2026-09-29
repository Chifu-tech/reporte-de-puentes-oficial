import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Reporte de Puentes Oficial es un servicio independiente que monitorea los tiempos de espera oficiales de todos los puentes fronterizos entre México y Estados Unidos.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">Nosotros</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          <strong className="font-semibold text-ink">{site.name}</strong> nació con una idea simple:
          cruzar la frontera ya es suficientemente pesado como para además no saber cuánto vas a
          esperar o por qué puente te conviene ir.
        </p>
        <p>
          Monitoreamos de forma continua los tiempos de espera oficiales que publica U.S. Customs
          and Border Protection (CBP) en todos los puertos de entrada de la frontera México–Estados
          Unidos, y los presentamos de forma clara: minutos de espera, carriles abiertos, cruce
          peatonal, cámaras cuando existen y, con el tiempo, la mejor hora para cruzar según
          promedios históricos.
        </p>
        <p>
          Somos un proyecto independiente, sin afiliación con CBP ni con ninguna autoridad de
          puentes. Creemos que un sitio de consulta debe ser rápido, limpio y sin anuncios que
          estorben — por eso decidimos hacerlo distinto.
        </p>
        <p>
          ¿Sugerencias, un error en un dato, o quieres que agreguemos algo?{" "}
          <Link href="/contacto" className="font-medium text-sage-ink hover:text-sage-ink">
            Escríbenos
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
