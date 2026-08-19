"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { CatalogJson, FreeQuotaType, Relay, RelayStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { useApp } from "@/components/providers";
import { monogramStyle, initial } from "@/lib/visual";
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

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
      </Link>

      <div className="flex items-start gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white"
          style={monogramStyle(relay.id)}
        >
          {initial(relay.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{relay.name}</h1>
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[relay.status]}`} />
            <span className="text-sm text-muted-foreground">
              {t(`status.${relay.status}` as DictKey)}
            </span>
          </div>
          <a
            href={relay.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {relay.url}
          </a>
          <div className="mt-2 flex flex-wrap gap-2">
            {fq.available && fType && (
              <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>
            )}
            {relay.openai_compatible && <Badge variant="info">OpenAI</Badge>}
            {relay.region.map((r) => (
              <Badge key={r} variant="outline">
                {t(`region.${r}` as DictKey)}
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
      </div>

      <Section title={t("detail.overview")}>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("detail.apiBase")} value={relay.api} isCode />
          <Field label={t("detail.env")} value={relay.auth.env.join(", ")} isCode />
          <Field
            label={t("detail.openai")}
            value={relay.openai_compatible ? t("detail.openai") : t("detail.notOpenai")}
          />
          <Field
            label={t("auth.api_key")}
            value={t(`auth.${relay.auth.type}` as DictKey)}
          />
          <Field label={t("detail.providers")} value={relay.providers.join(", ")} />
          <Field label={t("detail.pricing")} value={relay.pricing.notes ?? relay.pricing.model} />
          {relay.doc && <Field label={t("card.doc")} value={relay.doc} isLink />}
          <Field label={t("detail.updated")} value={relay.updated_at} />
        </dl>
      </Section>

      <Section title={t("detail.freeQuota")}>
        <div className="rounded-lg border border-border bg-card/50 p-4">
          {fq.available ? (
            <div className="space-y-2">
              {fType && <Badge variant={FREE_VARIANT[fType]}>{t(`free.${fType}` as DictKey)}</Badge>}
              <p className="text-sm">{fq.amount}</p>
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
      </Section>

      <Section title={t("detail.modelsOffered")}>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">{t("detail.providers")}</th>
                <th className="px-4 py-2 font-medium">{t("detail.availableOn")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(relay.models).map(([id]) => {
                const m = catalog.models[id];
                return (
                  <tr key={id} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs">{id}</td>
                    <td className="px-4 py-2">{m?.provider ?? "?"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {m?.available_on.length ?? 0} {locale === "zh" ? "家中转站" : "relays"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  isCode,
  isLink,
}: {
  label: string;
  value: string;
  isCode?: boolean;
  isLink?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-all">
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-sky-400 underline">
            {value}
          </a>
        ) : isCode ? (
          <code className="text-sm">{value}</code>
        ) : (
          <span className="text-sm">{value}</span>
        )}
      </dd>
    </div>
  );
}
