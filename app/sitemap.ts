import type { MetadataRoute } from "next";
import { crossings, sortedCities } from "@/lib/crossings";
import { guias } from "@/lib/guias";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/mejor-hora-para-cruzar`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/horarios-puentes-internacionales`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/camaras-en-vivo`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/guias`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const cityPages: MetadataRoute.Sitemap = sortedCities.flatMap((c) => [
    { url: `${site.url}/ciudad/${c.slug}`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${site.url}/mejor-hora-para-cruzar/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 },
  ]);

  const crossingPages: MetadataRoute.Sitemap = crossings.flatMap((c) => [
    { url: `${site.url}/puente/${c.slug}`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.9 },
    {
      url: `${site.url}/mejor-hora-para-cruzar/${c.citySlug}/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
  ]);

  const guidePages: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${site.url}/guias/${g.slug}`,
    lastModified: new Date(`${g.updated}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...crossingPages, ...guidePages];
}
