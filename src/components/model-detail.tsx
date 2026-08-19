"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import type { CatalogJson, FreeQuotaType, Model } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { monogramStyle, initial } from "@/lib/visual";
import { formatTokens } from "@/lib/format";
import type { DictKey } from "@/lib/i18n";

const FREE_VARIANT: Record<FreeQuotaType, "success" | "info" | "purple" | "warning"> = {
  credit: "success",
  token: "info",
  daily_checkin: "purple",
  free_models: "warning",
  unlimited: "success",
};

function fmtPrice(n?: number): string {
  return n === undefined ? "?" : n.toFixed(2);
}

export function ModelDetail({ model, catalog }: { model: Model; catalog: CatalogJson }) {
  const { t, locale } = useApp();
  const [copied, setCopied] = useState(false);
  const relays = model.available_on
    .map((rid) => catalog.api[rid])
    .filter((r) => !!r);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(model.id);
    } catch {
      /* 忽略 */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          {t("models.back")}
        </Link>
      </Button>

      {/* 标题 */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{model.name}</h1>
          <button
            type="button"
            onClick={copyId}
            title={t("models.copyId")}
            aria-label={t("models.copyId")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{model.id}</p>
        {model.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {model.description}
          </p>
        )}
      </div>

      {/* 规格 */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
          <Spec label={t("models.provider")} value={model.provider} />
          <Spec
            label={t("models.context")}
            value={model.context ? model.context.toLocaleString() : "—"}
          />
          <Spec
            label={t("models.input")}
            value={model.modalities.input.join(" / ") || "—"}
          />
          <Spec
            label={t("models.output")}
            value={model.modalities.output.join(" / ") || "—"}
          />
          <Spec
            label={t("models.reasoning")}
            value={t(model.reasoning ? "detail.yes" : "detail.no")}
            yes={model.reasoning}
          />
          <Spec
            label={t("models.toolCall")}
            value={t(model.tool_call ? "detail.yes" : "detail.no")}
            yes={model.tool_call}
          />
          <Spec
            label={t("models.weights")}
            value={model.open_weights ? t("models.open") : t("models.closed")}
            yes={model.open_weights}
          />
          <Spec label={t("models.released")} value={model.release_date ?? "—"} />
          <Spec label={t("models.maxOutput")} value={formatTokens(model.max_output)} />
          <Spec
            label={t("detail.price")}
            value={
              model.price
                ? `$${fmtPrice(model.price.input)} / $${fmtPrice(model.price.output)}`
                : "—"
            }
          />
        </CardContent>
      </Card>

      {/* 可免费使用的中转站 */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {t("models.availableRelays")}
        </h2>
        {relays.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relays.map((r) => {
              const fq = r.free_quota;
              return (
                <li key={r.id}>
                  <Link
                    href={`/relay/${r.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 transition-colors hover:border-foreground/30"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={monogramStyle(r.id)}
                    >
                      {initial(r.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate font-medium text-foreground">
                        {r.name}
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {fq.available && fq.amount
                          ? fq.amount
                          : locale === "zh"
                            ? "查看详情"
                            : "See details"}
                      </span>
                    </span>
                    {fq.available && fq.type && (
                      <Badge variant={FREE_VARIANT[fq.type]} className="shrink-0">
                        {t(`free.${fq.type}` as DictKey)}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Spec({
  label,
  value,
  yes,
}: {
  label: string;
  value: string;
  yes?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm ${yes ? "text-emerald-500" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
