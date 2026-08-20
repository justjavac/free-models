import type { MetadataRoute } from "next";
import { getCatalog, getRelays } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const relays = getRelays().map((r) => ({
    url: `${base}/relay/${r.id}`,
    lastModified: r.updated_at,
  }));
  const models = Object.keys(getCatalog().models).map((id) => ({
    url: `${base}/models/${id}`,
    lastModified: new Date().toISOString(),
  }));
  const labs = Array.from(
    new Set(Object.values(getCatalog().models).map((m) => m.provider)),
  ).map((id) => ({
    url: `${base}/labs/${id}`,
    lastModified: new Date().toISOString(),
  }));
  return [
    { url: base, lastModified: new Date().toISOString() },
    { url: `${base}/about`, lastModified: new Date().toISOString() },
    ...relays,
    ...models,
    ...labs,
  ];
}
