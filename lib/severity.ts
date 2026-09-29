import type { Severity } from "./cbp";

export interface SevStyle {
  dot: string;
  text: string;
  bg: string;
  label: string;
}

export const sevStyles: Record<Severity, SevStyle> = {
  verde: { dot: "bg-verde", text: "text-verde", bg: "bg-verde-soft", label: "Fluido" },
  amarillo: { dot: "bg-ambar", text: "text-ambar", bg: "bg-ambar-soft", label: "Moderado" },
  rojo: { dot: "bg-rojo", text: "text-rojo", bg: "bg-rojo-soft", label: "Demorado" },
  cerrado: { dot: "bg-gris", text: "text-gris", bg: "bg-gris-soft", label: "Cerrado" },
  "sin-datos": { dot: "bg-gris", text: "text-gris", bg: "bg-gris-soft", label: "Sin datos" },
};

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "—";
  if (minutes === 0) return "0";
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  return String(minutes);
}
