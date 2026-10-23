import type { MetadataRoute } from "next";
import { resultData } from "@/data/results";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dogandme.vercel.app";

  const typePages = Object.keys(resultData).map((type) => ({
    url: `${base}/result/${type}`,
    lastModified: new Date(),
    priority: 0.7 as const,
  }));

  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), priority: 0.3 },
    ...typePages,
  ];
}
