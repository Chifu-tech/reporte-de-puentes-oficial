import type { MetadataRoute } from "next";
import { crossings, sortedCities } from "@/lib/crossings";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/mejor-hora-para-cruzar`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const cityPages: MetadataRoute.Sitemap = sortedCities.flatMap((c) => [
    { url: `${site.url}/ciudad/${c.slug}`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${site.url}/mejor-hora-para-cruzar/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 },
  ]);

  const crossingPages: MetadataRoute.Sitemap = crossings.map((c) => ({
    url: `${site.url}/puente/${c.slug}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages, ...crossingPages];
}
