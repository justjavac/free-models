"use client";

import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";

export function Hero({ relayCount, modelCount }: { relayCount: number; modelCount: number }) {
  const { t } = useApp();
  return (
    <section className="relative overflow-hidden border-b border-border/70 pb-10 pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />
      <div className="mx-auto max-w-6xl px-4 text-center">
        <Badge variant="outline" className="mb-4">
          {t("site.subtitle")}
        </Badge>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("home.headline")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
          {t("home.desc")}
        </p>
        <p className="mt-6 text-sm font-medium text-foreground">
          {t("home.count", { n: relayCount, m: modelCount })}
        </p>
      </div>
    </section>
  );
}
