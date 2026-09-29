"use client";

import { track } from "@/lib/track";

/**
 * Compartir por WhatsApp (o el menú nativo del teléfono). En la frontera los
 * reportes de puentes circulan en grupos de WhatsApp y Facebook.
 */
export default function ShareButton({
  text,
  url,
  slug,
  className = "",
}: {
  text: string;
  url: string;
  slug: string;
  className?: string;
}) {
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (typeof navigator !== "undefined" && navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({ text, url });
        track("compartir", { metodo: "nativo", pagina: slug });
      } catch {
        // cancelado por el usuario
      }
      return;
    }
    track("compartir", { metodo: "whatsapp", pagina: slug });
  }

  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border border-sage px-4 py-2 text-[13px] font-semibold text-sage-ink transition-colors hover:bg-sage hover:text-white ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Compartir
    </a>
  );
}
