"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Copy, Check, CheckCircle2, Minus, Cpu } from "lucide-react";
import type { Model } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { monogramStyle, initial } from "@/lib/visual";
import { formatTokens } from "@/lib/format";
import { sortByReleaseDate } from "@/lib/sort";

/** 厂商（lab）独立页 */
export function LabDetail({
  provider,
  models,
}: {
  provider: string;
  models: Model[];
}) {
  const { t } = useApp();
  const [copied, setCopied] = useState<string | null>(null);
  const sorted = useMemo(() => sortByReleaseDate(models), [models]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      /* 忽略 */
    }
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
  };

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 h-10 px-2">
        <Link href="/providers">
          <ArrowLeft className="h-4 w-4" />
          {t("labs.back")}
        </Link>
      </Button>

      {/* 头部 */}
      <header className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm"
          style={monogramStyle(provider)}
        >
          {initial(provider)}
        </span>
        <div>
          <h1 className="text-3xl font-bold capitalize tracking-tight text-foreground text-balance">
            {provider}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            {t("card.models", { n: sorted.length })}
          </p>
        </div>
      </header>

      {/* 模型表 */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Cpu className="h-5 w-5 text-violet-500" />
          {t("models.title")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="hidden border-b border-border bg-card/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[2fr_0.7fr_0.7fr_0.55fr_0.55fr_0.7fr_1.4fr] md:gap-2">
            <span>{t("models.title")}</span>
            <span>{t("models.context")}</span>
            <span>{t("models.output")}</span>
            <span className="hidden xl:block">{t("models.reasoning")}</span>
            <span className="hidden xl:block">{t("models.toolCall")}</span>
            <span className="hidden xl:block">{t("models.weights")}</span>
            <span className="text-right">{t("models.availableOn")}</span>
          </div>
          <ul className="divide-y divide-border">
            {sorted.map((m) => {
              const shown = m.available_on.slice(0, 3);
              const extra = m.available_on.length - shown.length;
              return (
                <li
                  key={m.id}
                  className="grid grid-cols-1 gap-1 px-3 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[2fr_0.7fr_0.7fr_0.55fr_0.55fr_0.7fr_1.4fr] md:items-center md:gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/models/${m.id}`}
                        className="truncate font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {m.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => copyId(m.id)}
                        title={t("models.copyId")}
                        aria-label={t("models.copyId")}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {copied === m.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{m.id}</div>
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {formatTokens(m.context)}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {formatTokens(m.max_output)}
                  </div>
                  <div className="hidden xl:block">
                    {m.reasoning ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="hidden xl:block">
                    {m.tool_call ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="hidden xl:block">
                    {m.open_weights ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                        {t("models.open")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/70">{t("models.closed")}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-start gap-1 md:justify-end">
                    {m.available_on.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <>
                        {shown.map((rid) => (
                          <Link
                            key={rid}
                            href={`/relay/${rid}`}
                            className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-emerald-400"
                          >
                            {rid}
                          </Link>
                        ))}
                        {extra > 0 && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            +{extra}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
