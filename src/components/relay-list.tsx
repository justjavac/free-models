"use client";

import Link from "next/link";
import type { CatalogJson, FreeQuotaType, Relay } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProviderLogo, RelayLogo } from "@/components/logo";
import { FREE_VARIANT } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SubmitRelayButton } from "@/components/submit-relay-button";
import type { DictKey } from "@/lib/i18n";

/** 中转站列表行：桌面为表格行，移动端为卡片 */
function RelayRow({ relay }: { relay: Relay }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeQuotaType | undefined;
  const providers = relay.providers.slice(0, 3);
  const extra = relay.providers.length - providers.length;
  const note = fq.notes ?? relay.pricing.notes;

  return (
    <li className="group transition-colors hover:bg-accent/40 md:grid md:grid-cols-[1.2fr_1.3fr_1.5fr_1fr_0.6fr_1fr] md:items-center md:gap-4">
      {/* 中转站 */}
      <div className="flex min-w-0 items-center gap-3 px-4 py-3">
        <RelayLogo id={relay.id} name={relay.name} size={40} logo={relay.logo} />
        <div className="min-w-0">
          <Link
            href={`/relay/${relay.id}`}
            className="block truncate font-semibold text-foreground hover:underline"
          >
            {relay.name}
          </Link>
          <span className="hidden text-xs text-muted-foreground md:inline">
            {relay.model_count} {t("models.title")}
          </span>
        </div>
      </div>

      {/* 免费额度 */}
      <div className="px-4 pb-3 md:py-3">
        <span className="mb-1 text-xs text-muted-foreground md:hidden">{t("card.free")}</span>
        <div
          className={cn(
            "rounded-xl px-3 py-2 ring-1",
            fq.available
              ? "bg-emerald-500/5 ring-emerald-500/10"
              : "bg-muted ring-border",
          )}
        >
          {fq.available && fType && (
            <Badge variant={FREE_VARIANT[fType]} className="mb-1">
              {t(`free.${fType}` as DictKey)}
            </Badge>
          )}
          <div className="text-sm font-semibold leading-snug text-foreground">
            {fq.amount ?? (locale === "zh" ? "查看详情" : "See details")}
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div className="px-4 pb-3 md:py-3">
        <span className="mb-1 text-xs text-muted-foreground md:hidden">{t("providers.notes")}</span>
        <p className="line-clamp-2 text-sm text-muted-foreground">{note ?? "—"}</p>
      </div>

      {/* 支持厂商 */}
      <div className="px-4 pb-3 md:py-3">
        <span className="mb-1 text-xs text-muted-foreground md:hidden">{t("card.providers")}</span>
        <div className="flex flex-wrap items-center gap-2">
          {providers.map((p) => (
            <Link
              key={p}
              href={`/labs/${p}`}
              title={p}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ProviderLogo id={p} size={22} />
            </Link>
          ))}
          {extra > 0 && (
            <span className="rounded-lg bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
              +{extra}
            </span>
          )}
        </div>
      </div>

      {/* 模型数（仅桌面） */}
      <div className="hidden text-sm text-muted-foreground md:block">{relay.model_count}</div>

      {/* 操作 */}
      <div className="flex items-center gap-2 px-4 pb-3 md:py-3">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/relay/${relay.id}`}>{t("card.viewDetail")}</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={relay.auth.signup} target="_blank" rel="noreferrer">
            {t("card.signup")}
          </a>
        </Button>
      </div>
    </li>
  );
}

/** 中转站（供应商）列表 */
export function RelayList({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const relays = Object.values(catalog.api);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{t("home.submitHint")}</p>
        <SubmitRelayButton />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="hidden border-b border-border bg-card/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[1.2fr_1.3fr_1.5fr_1fr_0.6fr_1fr] md:gap-4">
        <span>{t("providers.relays")}</span>
        <span>{t("card.free")}</span>
        <span>{t("providers.notes")}</span>
        <span>{t("card.providers")}</span>
        <span>{t("models.title")}</span>
        <span className="text-right">{t("card.viewDetail")}</span>
      </div>
      <ul className="divide-y divide-border">
        {relays.map((r) => (
          <RelayRow key={r.id} relay={r} />
        ))}
      </ul>
      </div>
    </>
  );
}
