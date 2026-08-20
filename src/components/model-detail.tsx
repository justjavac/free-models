"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Check, ExternalLink, Layers, Zap } from "lucide-react";
import type { CatalogJson, Model } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProviderLogo, RelayLogo } from "@/components/logo";
import { formatTokens } from "@/lib/format";
import { FREE_VARIANT } from "@/lib/ui";
import type { DictKey } from "@/lib/i18n";

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
        <Link href="/models">
          <ArrowLeft className="h-4 w-4" />
          {t("models.back")}
        </Link>
      </Button>

      {/* 标题：厂商 logo + 名称 + ID */}
      <header className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card/60">
          <ProviderLogo id={model.provider} size={36} />
        </div>
        <div className="min-w-0 flex-1">
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
          <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-sm text-muted-foreground">
            {model.id}
            <Link
              href={`/labs/${model.provider}`}
              className="rounded bg-secondary px-1.5 py-0.5 text-xs capitalize text-secondary-foreground hover:underline"
            >
              {model.provider}
            </Link>
            {model.open_weights && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/25">
                {t("models.open")}
              </span>
            )}
          </div>
          {model.description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {model.description}
            </p>
          )}
        </div>
      </header>

      {/* 关键规格条：上下文 / 输出 / 价格（价格醒目） */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KeySpec
          icon={<Layers className="h-4 w-4" />}
          label={t("models.context")}
          value={model.context ? model.context.toLocaleString() : "—"}
          sub={`≈ ${formatTokens(model.context)}`}
        />
        <KeySpec
          icon={<Zap className="h-4 w-4" />}
          label={t("models.maxOutput")}
          value={formatTokens(model.max_output)}
          sub={model.max_output ? model.max_output.toLocaleString() : undefined}
        />
        <KeySpec
          label={t("detail.price")}
          value={
            model.price
              ? `$${fmtPrice(model.price.input)} / $${fmtPrice(model.price.output)}`
              : "—"
          }
          sub={model.price ? "input / output · 每百万 token" : undefined}
          accent={!!model.price}
        />
      </section>

      {/* 详细规格 */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
          <Spec label={t("models.input")} value={model.modalities.input.join(" / ") || "—"} />
          <Spec label={t("models.output")} value={model.modalities.output.join(" / ") || "—"} />
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
            label={t("models.structured")}
            value={t(model.structured_output ? "detail.yes" : "detail.no")}
            yes={model.structured_output}
          />
          <Spec
            label={t("models.weights")}
            value={model.open_weights ? t("models.open") : t("models.closed")}
            yes={model.open_weights}
          />
          <Spec label={t("models.released")} value={model.release_date ?? "—"} />
          <Spec label={t("models.availableOn")} value={String(model.available_on.length)} />
        </CardContent>
      </Card>

      {/* 可免费使用的中转站 */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {t("models.availableRelays")}{" "}
          <span className="font-normal text-muted-foreground">({relays.length})</span>
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
                    <RelayLogo id={r.id} name={r.name} size={36} logo={r.logo} />
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

function KeySpec({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold tracking-tight ${accent ? "text-emerald-400" : "text-foreground"}`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
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
