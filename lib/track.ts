"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { site } from "./site";

/** Evento de GA4. No hace nada si GA está apagado (sin NEXT_PUBLIC_GA_ID). */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (!site.analytics.gaId) return;
  sendGAEvent("event", event, params);
}
