"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Copy, Check, CheckCircle2, Minus } from "lucide-react";
import type { Model } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { monogramStyle, initial } from "@/lib/visual";
import { formatTokens } from "@/lib/format";

/** 厂商（lab）独立页：logo + 该厂商全部模型表格 */
export function LabDetail({
  provider,
  models,
}: {
  provider: string;
  models: Model[];
}) {
  const { t } = useApp();
  const [copied, setCopied] = useState<string | null>(null);

  // 对齐 models.dev：默认按发布日期倒序（最新在前）
  const sorted = useMemo(() => {
    return [...models].sort((a, b) => {
      if (a.release_date && b.release_date)
        return b.release_date.localeCompare(a.release_date);
      if (a.release_date) return -1;
      if (b.release_date) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [models]);

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
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/providers">
          <ArrowLeft className="h-4 w-4" />
          {t("labs.back")}
        </Link>
      </Button>

      {/* 标题：logo + 名称 + 模型数 */}
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-white"
          style={monogramStyle(provider)}
        >
          {initial(provider)}
        </span>
        <div>
          <h1 className="text-2xl font-bold capitalize tracking-tight text-foreground">
            {provider}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("card.models", { n: sorted.length })}
          </p>
        </div>
      </div>

      {/* 该厂商模型表格 */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden border-b border-border bg-card/60 px-3 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_0.7fr_0.7fr_0.55fr_0.55fr_0.7fr_1.4fr] md:gap-2">
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
                className="grid grid-cols-1 gap-1 px-3 py-2.5 transition-colors hover:bg-accent/40 md:grid-cols-[2fr_0.7fr_0.7fr_0.55fr_0.55fr_0.7fr_1.4fr] md:items-center md:gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/models/${m.id}`}
                      className="truncate font-medium text-foreground hover:underline"
                    >
                      {m.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => copyId(m.id)}
                      title={t("models.copyId")}
                      aria-label={t("models.copyId")}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied === m.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
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
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>
                <div className="hidden xl:block">
                  {m.tool_call ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>
                <div className="hidden xl:block">
                  {m.open_weights ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/25">
                      {t("models.open")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/70">
                      {t("models.closed")}
                    </span>
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
                          className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20"
                        >
                          {rid}
                        </Link>
                      ))}
                      {extra > 0 && (
                        <span className="px-1 py-0.5 text-xs text-muted-foreground">
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
    </div>
  );
}
