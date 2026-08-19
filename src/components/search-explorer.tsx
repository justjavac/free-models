"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, Check } from "lucide-react";
import type { CatalogJson, FreeQuotaType, Region, Relay, RelayStatus } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type FreeType = FreeQuotaType;
type Status = RelayStatus;

function readQuery(key: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

function readSet(key: string): Set<string> {
  const v = readQuery(key);
  return new Set(v ? v.split(",").filter(Boolean) : []);
}

/** 中转站列表行：重点突出免费额度与说明 */
function RelayRow({ relay }: { relay: Relay }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeType | undefined;
  const providers = relay.providers.slice(0, 3);
  const extra = relay.providers.length - providers.length;
  const note = fq.notes ?? relay.pricing.notes;

  return (
    <li className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[1.1fr_1.4fr_1.6fr_0.9fr_0.55fr_0.9fr] md:items-center md:gap-4">
      {/* 中转站 */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
          style={monogramStyle(relay.id)}
        >
          {initial(relay.name)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/relay/${relay.id}`}
              className="truncate font-semibold hover:underline"
            >
              {relay.name}
            </Link>
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[relay.status]}`}
              title={t(`status.${relay.status}` as DictKey)}
            />
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {relay.url.replace(/^https?:\/\//, "")}
          </div>
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

      {/* 支持厂商 */}
      <div className="flex flex-wrap gap-1">
        {providers.map((p) => (
          <span
            key={p}
            className="rounded bg-secondary px-1.5 py-0.5 text-xs capitalize text-secondary-foreground"
          >
            {p}
          </span>
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

export function SearchExplorer({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const relays = useMemo(() => Object.values(catalog.api), [catalog]);

  // 派生筛选项
  const allFreeTypes = useMemo(
    () => Array.from(new Set(relays.map((r) => r.free_quota.type).filter(Boolean))) as FreeType[],
    [relays],
  );
  const allRegions = useMemo(
    () => Array.from(new Set(relays.flatMap((r) => r.region))) as Region[],
    [relays],
  );
  const allProviders = useMemo(
    () => Array.from(new Set(relays.flatMap((r) => r.providers))).sort(),
    [relays],
  );
  const allStatuses = useMemo(
    () => Array.from(new Set(relays.map((r) => r.status))) as Status[],
    [relays],
  );

  const [q, setQ] = useState<string>(() => readQuery("q"));
  const searchRef = useRef<HTMLInputElement>(null);
  const [freeTypes, setFreeTypes] = useState<Set<string>>(() => readSet("free"));
  const [regions, setRegions] = useState<Set<string>>(() => readSet("region"));
  const [providers, setProviders] = useState<Set<string>>(() => readSet("provider"));
  const [statuses, setStatuses] = useState<Set<string>>(() => readSet("status"));
  const [openaiOnly, setOpenaiOnly] = useState<boolean>(() => readQuery("openai") === "1");

  // URL 同步（全部筛选状态写回，可分享 / 刷新恢复）
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (freeTypes.size) params.set("free", Array.from(freeTypes).join(","));
    if (regions.size) params.set("region", Array.from(regions).join(","));
    if (providers.size) params.set("provider", Array.from(providers).join(","));
    if (statuses.size) params.set("status", Array.from(statuses).join(","));
    if (openaiOnly) params.set("openai", "1");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, freeTypes, regions, providers, statuses, openaiOnly]);

  // `/` 快捷键聚焦搜索
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(relays, {
        keys: [
          { name: "name", weight: 2 },
          { name: "id", weight: 1 },
          { name: "providers", weight: 1 },
          { name: "free_quota.amount", weight: 0.6 },
          { name: "url", weight: 0.3 },
          {
            name: "_models",
            weight: 0.8,
            getFn: (r) => Object.values(r.models).map((m) => m.name).join(" "),
          },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [relays],
  );

  const results = useMemo(() => {
    let list = q.trim() ? fuse.search(q.trim()).map((x) => x.item) : relays;
    if (freeTypes.size)
      list = list.filter((r) => r.free_quota.type && freeTypes.has(r.free_quota.type));
    if (regions.size) list = list.filter((r) => r.region.some((x) => regions.has(x)));
    if (providers.size) list = list.filter((r) => r.providers.some((x) => providers.has(x)));
    if (statuses.size) list = list.filter((r) => statuses.has(r.status));
    if (openaiOnly) list = list.filter((r) => r.openai_compatible);
    return list;
  }, [q, fuse, relays, freeTypes, regions, providers, statuses, openaiOnly]);

  const toggle = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) {
      next.delete(val);
    } else {
      next.add(val);
    }
    return next;
  };

  const hasFilters =
    freeTypes.size || regions.size || providers.size || statuses.size || openaiOnly;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("providers.relays")}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("providers.relaysDesc")}</p>
      </div>
      {/* 搜索框 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-10 pl-10 pr-10 text-base"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 筛选栏 */}
      <div className="rounded-xl border border-border bg-card/50 p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("filters.title")}</span>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFreeTypes(new Set());
                setRegions(new Set());
                setProviders(new Set());
                setStatuses(new Set());
                setOpenaiOnly(false);
              }}
            >
              <X /> {t("filters.reset")}
            </Button>
          )}
        </div>

        <FilterRow label={t("filters.freeType")}>
          {allFreeTypes.map((ft) => (
            <Chip
              key={ft}
              active={freeTypes.has(ft)}
              onClick={() => setFreeTypes(toggle(freeTypes, ft))}
            >
              {t(`free.${ft}` as DictKey)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filters.region")}>
          {allRegions.map((r) => (
            <Chip
              key={r}
              active={regions.has(r)}
              onClick={() => setRegions(toggle(regions, r))}
            >
              {t(`region.${r}` as DictKey)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filters.status")}>
          {allStatuses.map((s) => (
            <Chip
              key={s}
              active={statuses.has(s)}
              onClick={() => setStatuses(toggle(statuses, s))}
            >
              {t(`status.${s}` as DictKey)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filters.openai")}>
          <Chip active={openaiOnly} onClick={() => setOpenaiOnly((v) => !v)}>
            OpenAI
          </Chip>
        </FilterRow>

        <FilterRow label={t("filters.provider")}>
          <div className="flex max-h-20 flex-wrap gap-1.5 overflow-y-auto pr-1">
            {allProviders.map((p) => (
              <Chip
                key={p}
                active={providers.has(p)}
                onClick={() => setProviders(toggle(providers, p))}
              >
                {p}
              </Chip>
            ))}
          </div>
        </FilterRow>
      </div>

      {/* 结果计数 */}
      <p className="text-sm text-muted-foreground">{t("home.results", { n: results.length })}</p>

      {/* 列表 */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          {t("home.results", { n: 0 })}
        </div>
      ) : (
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
            {results.map((r) => (
              <RelayRow key={r.id} relay={r} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <span className="w-24 shrink-0 pt-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground")
      }
    >
      {active && <Check className="h-3 w-3" />}
      {children}
    </button>
  );
}
