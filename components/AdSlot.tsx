"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Espacio publicitario con AdSense.
 * Desactivado por defecto (NEXT_PUBLIC_ADS_ENABLED): cuando está apagado
 * no renderiza nada. Al activarlo, reserva altura fija para evitar saltos
 * de layout (CLS). Las ubicaciones ya están diseñadas en el layout.
 */
export default function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense aún no cargó; lo reintenta el script principal
    }
  }, []);

  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  return (
    <aside
      aria-label="Publicidad"
      className={`flex min-h-[110px] items-center justify-center overflow-hidden rounded-xl border border-line-soft bg-surface ${className}`}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
