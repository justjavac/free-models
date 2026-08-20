"use client";

import Link from "next/link";
import { CheckCircle2, Minus } from "lucide-react";
import type { ReactNode } from "react";
import type { CatalogJson, FreeQuotaType, Model, Relay } from "@/lib/types";
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

export function RelayDetail({ relay, catalog }: { relay: Relay; catalog: CatalogJson }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeQuotaType | undefined;
  const modelCount = Object.keys(relay.models).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t("detail.back")}
      </Link>

      {/* 头部：logo + 名称 + id + 免费额度 badge + 操作 */}
      <header className="flex flex-wrap items-start gap-3">
        <RelayLogo id={relay.id} name={relay.name} size={48} logo={relay.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{relay.name}</h1>
            <span className="font-mono text-sm text-muted-foreground">{relay.id}</span>
            {fq.available && fType && (
              <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <a href={relay.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
              {relay.url.replace(/^https?:\/\//, "")}
            </a>
            {relay.openai_compatible && <Badge variant="info" className="text-[10px]">OpenAI Compatible</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CopyButton value={relay.auth.signup} />
          <a
            href={relay.auth.signup}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("card.signup")}
          </a>
        </div>
      </header>

      {/* 统计条：去掉 API，保留 Models / Package / Docs */}
      <section className="mt-4 grid grid-cols-3 gap-2">
        <Stat label={locale === "zh" ? "收录模型" : "Models"} value={String(modelCount)} />
        <Stat
          label="Package"
          value={relay.npm ?? "@ai-sdk/openai-compatible"}
          mono
        />
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
      <section className="mt-4">
        <h2 className="mb-1.5 text-sm font-semibold">{t("detail.freeQuota")}</h2>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          {fq.available ? (
            <div className="space-y-1.5">
              <div className="text-sm font-semibold">{fq.amount}</div>
              {fq.notes && <p className="text-xs text-muted-foreground">{fq.notes}</p>}
              {fq.expires && (
                <p className="text-xs text-muted-foreground">
                  {locale === "zh" ? "有效期：" : "Expires: "} {fq.expires}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {locale === "zh" ? "未提供免费额度" : "No free quota offered"}
            </p>
          )}
        </div>
      </section>

      {/* 模型表（对齐 models.dev 列） */}
      <section className="mt-4">
        <h2 className="mb-1.5 text-sm font-semibold">
          {t("detail.modelsOffered")}{" "}
          <span className="text-xs font-normal text-muted-foreground">({modelCount})</span>
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-1.5 font-medium">{t("detail.modelName")}</th>
                <th className="px-3 py-1.5 font-medium">ID</th>
                <th className="px-3 py-1.5 font-medium">{t("models.context")}</th>
                <th className="px-3 py-1.5 font-medium">{t("models.maxOutput")}</th>
                <th className="px-3 py-1.5 font-medium">{t("detail.price")}</th>
                <th className="px-3 py-1.5 font-medium">{t("models.reasoning")}</th>
                <th className="px-3 py-1.5 font-medium">{t("models.toolCall")}</th>
                <th className="px-3 py-1.5 font-medium">{t("models.structured")}</th>
                <th className="px-3 py-1.5 font-medium">{t("detail.availableOn")}</th>
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
      <td className="px-3 py-1.5">
        <Link
          href={`/models/${id}`}
          className="font-medium text-foreground hover:underline"
        >
          {model?.name ?? id}
        </Link>
      </td>
      <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground">{id}</td>
      <td className="px-3 py-1.5 text-muted-foreground">{formatTokens(model?.context)}</td>
      <td className="px-3 py-1.5 text-muted-foreground">{formatTokens(model?.max_output)}</td>
      <td className="px-3 py-1.5 text-muted-foreground">
        {model?.price
          ? `$${model.price.input?.toFixed(2)} / $${model.price.output?.toFixed(2)}`
          : "—"}
      </td>
      <td className="px-3 py-1.5">
        {model?.reasoning ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-1.5">
        {model?.tool_call ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-1.5">
        {model?.structured_output ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-1.5 text-xs text-muted-foreground">
        {model?.available_on.length ?? 0} {locale === "zh" ? "家" : ""}
      </td>
    </tr>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 px-3 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}