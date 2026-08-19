import type { MetadataRoute } from "next";
import { getRelays } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://models.jjc.fun";
  const relays = getRelays().map((r) => ({
    url: `${base}/relay/${r.id}`,
    lastModified: r.updated_at,
  }));
  return [
    { url: base, lastModified: new Date().toISOString() },
    { url: `${base}/providers`, lastModified: new Date().toISOString() },
    { url: `${base}/about`, lastModified: new Date().toISOString() },
    ...relays,
  ];
}
