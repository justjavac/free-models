"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";

const ENDPOINTS = ["/api.json", "/models.json", "/catalog.json"];

export function AboutContent({
  relayCount,
  modelCount,
}: {
  relayCount: number;
  modelCount: number;
}) {
  const { t } = useApp();
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      <p>{t("about.body")}</p>
      <p className="text-foreground/90">{t("about.count", { n: relayCount, m: modelCount })}</p>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">{t("about.data")}</h2>
        <ul className="flex flex-wrap gap-2">
          {ENDPOINTS.map((e) => (
            <li key={e}>
              <Link
                href={e}
                className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground hover:bg-accent"
              >
                {e}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p>{t("about.contribute")}</p>
    </div>
  );
}
