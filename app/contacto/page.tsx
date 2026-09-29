import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta al equipo de Reporte de Puentes Oficial: sugerencias, reporte de errores, publicidad o colaboración.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-balance font-display text-[34px] font-normal leading-[1.06] tracking-tight text-ink">Contacto</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          Para sugerencias, reportar un dato incorrecto, publicidad u oportunidades de
          colaboración, escríbenos a:
        </p>
        <p>
          <a
            href="mailto:hola@reportedepuentesoficial.mx"
            className="font-semibold text-sage-ink hover:text-sage-ink"
          >
            hola@reportedepuentesoficial.mx
          </a>
        </p>
        <p>
          Tratamos de responder en un máximo de 48 horas. Si nos escribes sobre un error en un
          tiempo de espera, incluye el puente y la hora aproximada en que lo viste: nos ayuda a
          rastrearlo contra la fuente oficial.
        </p>
      </div>
    </div>
  );
}
