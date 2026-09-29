import { citiesBySlug, crossingsForCity } from "@/lib/crossings";
import { fetchLiveCrossings } from "@/lib/cbp";
import { ogCard, ogSize } from "@/lib/og";
import { headlineWait, shortName } from "@/lib/seo";

export const revalidate = 300;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Tiempo de espera en vivo de los puentes de la ciudad";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = citiesBySlug.get(slug);
  if (!city) return ogCard({ eyebrow: "EN VIVO", title: "Reporte de Puentes", subtitle: "", rows: [] });
  let live: Awaited<ReturnType<typeof fetchLiveCrossings>> = new Map();
  try {
    live = await fetchLiveCrossings();
  } catch {
    // sin datos: la tarjeta sale con guiones
  }
  const rows = crossingsForCity(slug).map((c) => {
    const h = headlineWait(c, live.get(c.slug));
    return {
      label: shortName(c),
      minutes: h?.minutes ?? null,
      note: h?.mode,
    };
  });
  return ogCard({
    eyebrow: "EN VIVO",
    title: city.term === "garita" ? `Garitas de ${city.name}` : `Puentes de ${city.name}`,
    subtitle: `${city.name} – ${city.nameUs}, ${city.stateUs} · Tiempo de espera ahora`,
    rows,
  });
}
