export const site = {
  name: "Reporte de Puentes Oficial",
  /** Marca corta para títulos (plantilla `%s | …`) y textos compartidos. */
  brand: "Reporte de Puentes",
  shortName: "Puentes",
  domain: "reportedepuentesoficial.mx",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reportedepuentesoficial.mx",
  description:
    "Tiempos de espera en vivo de todos los puentes y garitas entre México y Estados Unidos. Consulta cómo está la línea, carriles abiertos, cámaras y la mejor hora para cruzar en coche o a pie.",
  locale: "es_MX",
  author: "Reporte de Puentes Oficial",
  email: "hola@reportedepuentesoficial.mx",
  analytics: {
    /** ID de medición de Google Analytics 4 (G-XXXXXXX). Vacío = GA apagado. */
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  },
  ads: {
    /**
     * ID de editor de AdSense (ca-pub-XXXX). Con solo tenerlo se carga el
     * script, la meta de verificación y /ads.txt para que AdSense revise el sitio.
     */
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
    /** Enciende los bloques manuales `AdSlot` (fase de monetización). */
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
