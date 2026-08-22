"use client";

import Link from "next/link";
import { CheckCircle2, Minus, ArrowLeft, Gift, Database, Building2 } from "lucide-react";
import type { CatalogJson, FreeQuotaType, Model, ModelRef, Relay } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers";
import { ProviderLogo, RelayLogo } from "@/components/logo";
import { formatTokens } from "@/lib/format";
import { FREE_VARIANT } from "@/lib/ui";
import type { DictKey } from "@/lib/i18n";

export function RelayDetail({ relay, catalog }: { relay: Relay; catalog: CatalogJson }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeQuotaType | undefined;
  const modelCount = Object.keys(relay.models).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 h-10 px-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          {t("detail.back")}
        </Link>
      </Button>

      {/* Hero 头部 */}
      <header className="mt-4 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <RelayLogo id={relay.id} name={relay.name} size={56} logo={relay.logo} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                {relay.name}
              </h1>
              {fq.available && fType && (
                <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {modelCount} {t("models.title")} · {relay.providers.length} {t("card.providers")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CopyButton value={relay.auth.signup} />
          <a
            href={relay.auth.signup}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("card.signup")}
          </a>
        </div>
      </header>

      {/* 免费额度 */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Gift className="h-4 w-4 text-emerald-500" />
          {t("detail.freeQuota")}
        </h2>
        <div
          className={`rounded-2xl border p-5 shadow-sm ${
            fq.available
              ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent"
              : "border-border/60 bg-card"
          }`}
        >
          {fq.available ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{fq.amount}</div>
              {fq.notes && <p className="text-sm text-muted-foreground">{fq.notes}</p>}
              {fq.expires && (
                <p className="text-sm text-muted-foreground">
                  {locale === "zh" ? "有效期至" : "Expires: "} {fq.expires}
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

      {/* 支持厂商 */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-indigo-500" />
          {t("detail.providers")}{" "}
          <span className="text-xs font-normal text-muted-foreground">({relay.providers.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          {relay.providers.map((p) => (
            <Link
              key={p}
              href={`/labs/${p}`}
              title={p}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/80 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ProviderLogo id={p} size={28} />
            </Link>
          ))}
        </div>
      </section>

      {/* 模型表 */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Database className="h-4 w-4 text-violet-500" />
          {t("detail.modelsOffered")}{" "}
          <span className="text-xs font-normal text-muted-foreground">({modelCount})</span>
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="sticky top-0 z-10 bg-muted/80 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                <tr>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("detail.modelName")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">ID</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("models.context")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("models.maxOutput")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("detail.price")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("models.reasoning")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("models.toolCall")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("models.structured")}</th>
              <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3">{t("detail.availableOn")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(relay.models).map(([id, ref]) => {
                  const m = catalog.models[id];
                  return <ModelRow key={id} id={id} refModel={ref} model={m} />;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function ModelRow({
  id,
  refModel,
  model,
}: {
  id: string;
  refModel: ModelRef;
  model?: Model;
}) {
  const { locale } = useApp();
  const price = refModel.cost ?? model?.price;
  return (
    <tr className="transition-colors hover:bg-accent/40">
      <td className="px-3 py-2 sm:px-4 sm:py-2.5">
        <Link
          href={`/models/${id}`}
          className="font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {model?.name ?? refModel.name ?? id}
        </Link>
      </td>
      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{id}</td>
      <td className="px-4 py-2.5 text-muted-foreground">{formatTokens(model?.context)}</td>
      <td className="px-4 py-2.5 text-muted-foreground">{formatTokens(model?.max_output)}</td>
      <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
        {price ? `$${price.input?.toFixed(2)} / $${price.output?.toFixed(2)}` : "—"}
      </td>
      <td className="px-3 py-2 sm:px-4 sm:py-2.5">
        {model?.reasoning ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-2 sm:px-4 sm:py-2.5">
        {model?.tool_call ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-3 py-2 sm:px-4 sm:py-2.5">
        {model?.structured_output ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </td>
      <td className="px-4 py-2.5 text-xs text-muted-foreground">
        {model?.available_on.length ?? 0} {locale === "zh" ? "家" : ""}
      </td>
    </tr>
  );
}
