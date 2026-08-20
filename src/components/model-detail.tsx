"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Zap,
  DollarSign,
  Brain,
  Wrench,
  Table,
  Scale,
  Calendar,
  Radio,
  Type,
  Image as ImageIcon,
  AudioLines,
  Video,
} from "lucide-react";
import type { CatalogJson, FreeQuotaType, Model } from "@/lib/types";
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

function modalityIcon(value: string): { icon: React.ReactNode; label: string } | null {
  switch (value) {
    case "text":
      return { icon: <Type className="h-3.5 w-3.5" />, label: "text" };
    case "image":
      return { icon: <ImageIcon className="h-3.5 w-3.5" />, label: "image" };
    case "audio":
      return { icon: <AudioLines className="h-3.5 w-3.5" />, label: "audio" };
    case "video":
      return { icon: <Video className="h-3.5 w-3.5" />, label: "video" };
    default:
      return null;
  }
}

function ModalityChips({ values }: { values: string[] }) {
  if (values.length === 0) return "—";
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => {
        const mapped = modalityIcon(v);
        if (!mapped) return <span key={v}>{v}</span>;
        return (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {mapped.icon}
            {mapped.label}
          </span>
        );
      })}
    </div>
  );
}

/** 给各规格项配一个可读图标 */
function specIcon(label: string): React.ReactNode {
  switch (label) {
    case "推理":
    case "Reasoning":
      return <Brain className="h-4 w-4" />;
    case "工具":
    case "Tool call":
      return <Wrench className="h-4 w-4" />;
    case "结构化输出":
    case "Structured":
      return <Table className="h-4 w-4" />;
    case "权重":
    case "Weights":
      return <Scale className="h-4 w-4" />;
    case "发布":
    case "Released":
      return <Calendar className="h-4 w-4" />;
    case "可免费使用的中转站":
    case "Free on relays":
      return <Radio className="h-4 w-4" />;
    default:
      return null;
  }
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
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 h-10 px-2">
        <Link href="/models">
          <ArrowLeft className="h-4 w-4" />
          {t("models.back")}
        </Link>
      </Button>

      {/* 标题区 */}
      <header className="flex items-start gap-4 sm:gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <ProviderLogo id={model.provider} size={40} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {model.name}
            </h1>
            <button
              type="button"
              onClick={copyId}
              title={t("models.copyId")}
              aria-label={t("models.copyId")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-sm text-muted-foreground">
            <span>{model.id}</span>
            <Link
              href={`/labs/${model.provider}`}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              {model.provider}
            </Link>
            {model.open_weights && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                {t("models.open")}
              </span>
            )}
          </div>
          {model.description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {model.description}
            </p>
          )}
        </div>
      </header>

      {/* 关键规格卡 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          icon={<DollarSign className="h-4 w-4" />}
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
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Spec
            label={t("models.input")}
            value={<ModalityChips values={model.modalities.input} />}
          />
          <Spec
            label={t("models.output")}
            value={<ModalityChips values={model.modalities.output} />}
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
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {t("models.availableRelays")}{" "}
          <span className="text-sm font-normal text-muted-foreground">({relays.length})</span>
        </h2>
        {relays.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relays.map((r) => {
              const fq = r.free_quota;
              const fType = fq.type as FreeQuotaType | undefined;
              return (
                <li key={r.id}>
                  <Link
                    href={`/relay/${r.id}`}
                    className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
                  >
                    <RelayLogo id={r.id} name={r.name} size={44} logo={r.logo} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate font-medium text-foreground">
                        {r.name}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {fq.available && fq.amount
                          ? fq.amount
                          : locale === "zh"
                            ? "查看详情"
                            : "See details"}
                      </span>
                    </span>
                    {fq.available && fType && (
                      <Badge variant={FREE_VARIANT[fType]} className="shrink-0">
                        {t(`free.${fType}` as DictKey)}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
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
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        accent
          ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent"
          : "border-border bg-card/50"
      }`}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-bold tracking-tight ${
          accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Spec({
  label,
  value,
  yes,
}: {
  label: string;
  value: React.ReactNode;
  yes?: boolean;
}) {
  const icon = specIcon(label);
  return (
    <div className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={`mt-0.5 text-sm font-medium ${
            yes ? "text-emerald-600 dark:text-emerald-500" : "text-foreground"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
