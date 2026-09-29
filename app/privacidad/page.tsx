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
          Utilizamos herramientas de analítica (Vercel Analytics y, eventualmente, Google
          Analytics) que miden el uso agregado del sitio: páginas visitadas, dispositivo y país de
          origen. Estos datos son anónimos y no identifican a personas.
        </p>

        <h2 className="pt-2 text-[16px] font-semibold text-ink">3. Cookies y publicidad</h2>
        <p>
          El sitio puede utilizar cookies de terceros —como Google AdSense— para mostrar anuncios
          relevantes. Google y sus socios pueden usar cookies para personalizar anuncios según tus
          visitas a este u otros sitios. Puedes desactivar la publicidad personalizada en la
          configuración de anuncios de tu cuenta de Google, o gestionar las cookies desde tu
          navegador.
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
