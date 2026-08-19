"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CatalogJson } from "@/lib/types";
import { useApp } from "@/components/providers";
import { monogramStyle, initial } from "@/lib/visual";

/** 模型厂商（lab）logo 网格，对齐 models.dev 的 Providers/Labs 视图 */
export function ProviderGrid({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const providers = useMemo(() => {
    const count = new Map<string, number>();
    for (const m of Object.values(catalog.models)) {
      count.set(m.provider, (count.get(m.provider) ?? 0) + 1);
    }
    return Array.from(count.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [catalog]);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("providers.labs")}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("providers.labsDesc")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {providers.map(([name, count]) => (
          <Link
            key={name}
            href={`/?provider=${encodeURIComponent(name)}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 transition-colors hover:border-foreground/30"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
              style={monogramStyle(name)}
            >
              {initial(name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium capitalize text-foreground">
                {name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("card.models", { n: count })}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
