"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Minus } from "lucide-react";
import type { ReactNode } from "react";
import type { CatalogJson, FreeQuotaType, Model, Relay, RelayStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { useApp } from "@/components/providers";
import { RelayLogo } from "@/components/logo";
import { formatTokens } from "@/lib/format";
import type { DictKey } from "@/lib/i18n";

const FREE_VARIANT: Record<FreeQuotaType, "success" | "info" | "purple" | "warning"> = {
  credit: "success",
  token: "info",
  daily_checkin: "purple",
  free_models: "warning",
  unlimited: "success",
};
const STATUS_DOT: Record<RelayStatus, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export function RelayDetail({ relay, catalog }: { relay: Relay; catalog: CatalogJson }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeQuotaType | undefined;
  const modelCount = Object.keys(relay.models).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
      </Link>

      {/* 头部：logo + 名称 + id + 状态（对齐 models.dev） */}
      <header className="flex flex-wrap items-start gap-4">
        <RelayLogo id={relay.id} name={relay.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{relay.name}</h1>
            <span className="font-mono text-sm text-muted-foreground">{relay.id}</span>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_DOT[relay.status]}`} />
            <span className="text-sm text-muted-foreground">
              {t(`status.${relay.status}` as DictKey)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <a href={relay.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
              {relay.url.replace(/^https?:\/\//, "")}
            </a>
            {relay.openai_compatible && <Badge variant="info">OpenAI Compatible</Badge>}
            {relay.region.map((r) => (
              <Badge key={r} variant="outline">
                {t(`region.${r}` as DictKey)}
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {fq.available && fType && (
              <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>
            )}
            {relay.features.map((f) => (
              <Badge key={f} variant="outline">
                {f}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyButton value={relay.api} />
          <a href={relay.auth.signup} target="_blank" rel="noreferrer">
            <Badge variant="default" className="cursor-pointer gap-1 py-1.5">
              {t("card.signup")} <ExternalLink className="h-3 w-3" />
            </Badge>
          </a>
        </div>
      </header>

      {/* 统计条（对齐 models.dev 的 Models / Package / API / Docs） */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={locale === "zh" ? "收录模型" : "Models"} value={String(modelCount)} />
        <Stat
          label="Package"
          value={relay.npm ?? "@ai-sdk/openai-compatible"}
          mono
        />
        <Stat label="API" value={relay.api} mono breakAll />
        <Stat
          label={t("card.doc")}
          value={
            relay.doc ? (
              <a
                href={relay.doc}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline hover:text-sky-300"
              >
                {locale === "zh" ? "文档" : "Docs"} ↗
              </a>
            ) : (
              "—"
            )
          }
        />
      </section>

      {/* 免费额度 */}
      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">{t("detail.freeQuota")}</h2>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          {fq.available ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {fType && (
                  <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>
                )}
                <span className="text-sm font-semibold">{fq.amount}</span>
              </div>
              {fq.notes && <p className="text-sm text-muted-foreground">{fq.notes}</p>}
              {fq.expires && (
                <p className="text-xs text-muted-foreground">
                  {locale === "zh" ? "有效期：" : "Expires: "} {fq.expires}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {locale === "zh" ? "未提供免费额度" : "No free quota offered"}
            </p>
          )}
        </div>
      </section>

      {/* 模型表（对齐 models.dev 列：Model/ID/Context/Output/Price/Reasoning/Tool Call/Structured） */}
      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">
          {t("detail.modelsOffered")}{" "}
          <span className="text-sm font-normal text-muted-foreground">({modelCount})</span>
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t("detail.modelName")}</th>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">{t("models.context")}</th>
                <th className="px-3 py-2 font-medium">{t("models.maxOutput")}</th>
                <th className="px-3 py-2 font-medium">{t("detail.price")}</th>
                <th className="px-3 py-2 font-medium">{t("models.reasoning")}</th>
                <th className="px-3 py-2 font-medium">{t("models.toolCall")}</th>
                <th className="px-3 py-2 font-medium">{t("models.structured")}</th>
                <th className="px-3 py-2 font-medium">{t("detail.availableOn")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(relay.models).map(([id]) => {
                const m = catalog.models[id];
                return <ModelRow key={id} id={id} model={m} />;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function ModelRow({ id, model }: { id: string; model?: Model }) {
  const { locale } = useApp();
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-2">
        <Link
          href={`/models/${id}`}
          className="font-medium text-foreground hover:underline"
        >
          {model?.name ?? id}
        </Link>
      </td>
      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{id}</td>
      <td className="px-3 py-2 text-muted-foreground">{formatTokens(model?.context)}</td>
      <td className="px-3 py-2 text-muted-foreground">{formatTokens(model?.max_output)}</td>
      <td className="px-3 py-2 text-muted-foreground">
        {model?.price
          ? `$${model.price.input?.toFixed(2)} / $${model.price.output?.toFixed(2)}`
          : "—"}
      </td>
      <td className="px-3 py-2">
        {model?.reasoning ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-2">
        {model?.tool_call ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-2">
        {model?.structured_output ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">
        {model?.available_on.length ?? 0} {locale === "zh" ? "家" : ""}
      </td>
    </tr>
  );
}

function Stat({
  label,
  value,
  mono,
  breakAll,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`mt-0.5 text-sm font-medium text-foreground ${mono ? "font-mono" : ""} ${
          breakAll ? "break-all" : "truncate"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
