import type { MetadataRoute } from "next";
import { resultData } from "@/data/results";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.daeng.me";

  const typePages = Object.keys(resultData).map((type) => ({
    url: `${base}/result/${type}`,
    lastModified: new Date(),
    priority: 0.7 as const,
  }));

  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/profile`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/quiz/intro`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/history`, lastModified: new Date(), priority: 0.5 },
    { url: `${base}/premium`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), priority: 0.3 },
    ...typePages,
  ];
}
