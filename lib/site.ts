export const site = {
  name: "Reporte de Puentes Oficial",
  shortName: "Puentes",
  domain: "reportedepuentesoficial.mx",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reportedepuentesoficial.mx",
  description:
    "Tiempos de espera en vivo de todos los puentes fronterizos entre México y Estados Unidos. Consulta líneas, carriles abiertos, cámaras y la mejor hora para cruzar en coche o a pie.",
  locale: "es_MX",
  author: "Reporte de Puentes Oficial",
  ads: {
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
