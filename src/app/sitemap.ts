import type { MetadataRoute } from "next";
import { getCatalog, getRelays } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://models.jjc.fun";
  const relays = getRelays().map((r) => ({
    url: `${base}/relay/${r.id}`,
    lastModified: r.updated_at,
  }));
  const models = Object.keys(getCatalog().models).map((id) => ({
    url: `${base}/models/${id}`,
    lastModified: new Date().toISOString(),
  }));
  return [
    { url: base, lastModified: new Date().toISOString() },
    { url: `${base}/providers`, lastModified: new Date().toISOString() },
    { url: `${base}/about`, lastModified: new Date().toISOString() },
    ...relays,
    ...models,
  ];
}
