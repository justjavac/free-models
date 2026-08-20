"use client";

import Link from "next/link";
import type { CatalogJson, FreeQuotaType, Relay } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProviderLogo, RelayLogo } from "@/components/logo";
import type { DictKey } from "@/lib/i18n";

const FREE_VARIANT: Record<FreeQuotaType, "success" | "info" | "purple" | "warning"> = {
  credit: "success",
  token: "info",
  daily_checkin: "purple",
  free_models: "warning",
  unlimited: "success",
};

/** 中转站列表行：重点突出免费额度与说明 */
function RelayRow({ relay }: { relay: Relay }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeQuotaType | undefined;
  const providers = relay.providers.slice(0, 3);
  const extra = relay.providers.length - providers.length;
  const note = fq.notes ?? relay.pricing.notes;

  return (
    <li className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[1.1fr_1.4fr_1.6fr_0.9fr_0.55fr_0.9fr] md:items-center md:gap-4">
      {/* 中转站：logo + 名字 */}
      <div className="flex min-w-0 items-center gap-3">
        <RelayLogo id={relay.id} name={relay.name} size={40} logo={relay.logo} />
        <div className="min-w-0">
          <Link
            href={`/relay/${relay.id}`}
            className="truncate font-semibold hover:underline"
          >
            {relay.name}
          </Link>
        </div>
      </div>

      {/* 免费额度（重点突出） */}
      <div className="rounded-lg bg-emerald-500/5 px-3 py-2 ring-1 ring-emerald-500/10">
        {fq.available && fType && (
          <Badge variant={FREE_VARIANT[fType]} className="mb-1">
            {t(`free.${fType}` as DictKey)}
          </Badge>
        )}
        <div className="text-sm font-semibold leading-snug text-foreground">
          {fq.amount ?? (locale === "zh" ? "查看详情" : "See details")}
        </div>
      </div>

      {/* 说明 */}
      <div className="text-sm text-muted-foreground">
        <p className="line-clamp-2">{note ?? "—"}</p>
      </div>

      {/* 支持厂商（logo） */}
      <div className="flex flex-wrap items-center gap-1.5">
        {providers.map((p) => (
          <Link
            key={p}
            href={`/labs/${p}`}
            title={p}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card/60 transition-transform hover:scale-110"
          >
            <ProviderLogo id={p} size={20} />
          </Link>
        ))}
        {extra > 0 && (
          <span className="px-1 py-0.5 text-xs text-muted-foreground">+{extra}</span>
        )}
      </div>

      {/* 模型数 */}
      <div className="hidden text-sm text-muted-foreground md:block">{relay.model_count}</div>

      {/* 操作 */}
      <div className="flex gap-2">
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

/** 中转站（供应商）列表（数据量小，无需搜索/筛选） */
export function RelayList({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const relays = Object.values(catalog.api);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="hidden border-b border-border bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[1.1fr_1.4fr_1.6fr_0.9fr_0.55fr_0.9fr] md:gap-4">
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
  );
}
