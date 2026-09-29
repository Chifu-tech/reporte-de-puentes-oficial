import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Reporte de Puentes Oficial: qué datos recopilamos (o no), cookies, analítica y publicidad.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">Política de privacidad</h1>
      <div className="mt-6 space-y-5 text-[14.5px] leading-relaxed text-ink-soft">
        <p>
          <strong className="font-semibold text-ink">{site.name}</strong> (en adelante «el sitio»)
          respeta tu privacidad. Esta política explica qué información se recopila cuando visitas{" "}
          <strong className="font-semibold text-ink">reportedepuentesoficial.mx</strong> y cómo se utiliza.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">1. Información que no recopilamos</h2>
        <p>
          No requerimos registro ni cuenta para usar el sitio. No te pedimos nombre, correo,
          teléfono ni ningún dato personal para consultar los tiempos de espera.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">2. Datos de uso y analítica</h2>
        <p>
          Utilizamos Google Analytics 4 y Vercel Analytics para medir el uso agregado del sitio:
          páginas visitadas, tipo de dispositivo, país o ciudad aproximada, cómo llegaste al sitio y
          acciones como buscar un puente o compartir un reporte. Google Analytics usa cookies propias
          para distinguir visitas; no usamos estos datos para identificarte personalmente.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">3. Cookies y publicidad</h2>
        <p>
          El sitio utiliza Google AdSense para mostrar anuncios. Proveedores externos, incluido
          Google, usan cookies para mostrar anuncios basados en tus visitas anteriores a este y a
          otros sitios web. Las cookies de publicidad de Google permiten a Google y a sus socios
          mostrarte anuncios según tus visitas a este y a otros sitios de Internet.
        </p>
        <p>
          Puedes desactivar la publicidad personalizada en la{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="font-medium text-sage-ink hover:underline">
            configuración de anuncios de Google
          </a>{" "}
          o en{" "}
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="font-medium text-sage-ink hover:underline">
            aboutads.info
          </a>
          , y gestionar o borrar las cookies desde tu navegador. Para saber más, consulta{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="font-medium text-sage-ink hover:underline">
            cómo usa Google la información de los sitios que usan sus servicios
          </a>
          .
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">4. Datos de origen público</h2>
        <p>
          Los tiempos de espera mostrados provienen del portal público de U.S. Customs and Border
          Protection (CBP) y las cámaras de fuentes públicas de las ciudades fronterizas. No
          recopilamos ningún dato de los usuarios de esas fuentes.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">5. Cambios a esta política</h2>
        <p>
          Podremos actualizar esta política ocasionalmente. La versión vigente siempre estará
          publicada en esta página.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">6. Contacto</h2>
        <p>
          Dudas sobre privacidad: <a href="mailto:hola@reportedepuentesoficial.mx" className="font-medium text-sage-ink hover:text-sage-ink">hola@reportedepuentesoficial.mx</a>
        </p>
      </div>
    </div>
  );
}
