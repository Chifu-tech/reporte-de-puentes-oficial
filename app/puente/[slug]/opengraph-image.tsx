import { cityOf, crossingsBySlug } from "@/lib/crossings";
import { fetchLiveCrossings } from "@/lib/cbp";
import { ogCard, ogSize } from "@/lib/og";

export const revalidate = 300;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Tiempo de espera en vivo del puente";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const crossing = crossingsBySlug.get(slug);
  if (!crossing) return ogCard({ eyebrow: "EN VIVO", title: "Reporte de Puentes", subtitle: "", rows: [] });
  const city = cityOf(crossing);
  let live;
  try {
    live = (await fetchLiveCrossings()).get(slug);
  } catch {
    live = undefined;
  }
  const rows = crossing.pedestrianOnly
    ? [{ label: "A pie", minutes: live?.lanes.pedestrian.delayMinutes ?? null }]
    : [
        { label: "En coche", minutes: live?.lanes.standard.delayMinutes ?? null },
        { label: "Ready Lane", minutes: live?.lanes.ready.delayMinutes ?? null },
        { label: "SENTRI", minutes: live?.lanes.sentri.delayMinutes ?? null },
        { label: "A pie", minutes: live?.lanes.pedestrian.delayMinutes ?? null },
      ].filter((r, i) => i === 0 || r.minutes !== null);
  return ogCard({
    eyebrow: "EN VIVO",
    title: crossing.name,
    subtitle: `${city.name} – ${city.nameUs} · ${city.term === "garita" ? "Cómo está la línea ahora" : "Tiempo de espera ahora"}`,
    rows,
  });
}
