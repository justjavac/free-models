"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, Check } from "lucide-react";
import type { CatalogJson, FreeQuotaType, Region, Relay, RelayStatus } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

function RelayCard({ relay }: { relay: Relay }) {
  const { t, locale } = useApp();
  const fq = relay.free_quota;
  const fType = fq.type as FreeType | undefined;
  const providers = relay.providers.slice(0, 4);
  const extra = relay.providers.length - providers.length;

  return (
    <Card className="group flex flex-col transition-all hover:border-foreground/30 hover:shadow-md">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
          style={monogramStyle(relay.id)}
        >
          {initial(relay.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
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
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {relay.url.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {fq.available && fType && (
          <Badge variant={FREE_VARIANT[fType]} className="w-fit">
            {t(`free.${fType}` as DictKey)}
          </Badge>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {fq.amount ?? (locale === "zh" ? "查看详情" : "See details")}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{t("card.models", { n: relay.model_count })}</Badge>
          {relay.openai_compatible && (
            <Badge variant="info">OpenAI</Badge>
          )}
          {relay.region.includes("cn") && (
            <Badge variant="outline">{t("region.cn")}</Badge>
          )}
        </div>

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

        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/relay/${relay.id}`}>{t("card.viewDetail")}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={relay.auth.signup} target="_blank" rel="noreferrer">
              {t("card.signup")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
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
  const [freeTypes, setFreeTypes] = useState<Set<string>>(new Set());
  const [regions, setRegions] = useState<Set<string>>(new Set());
  const [providers, setProviders] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Set<string>>(new Set());
  const [openaiOnly, setOpenaiOnly] = useState(false);

  // URL 同步（仅写回浏览器历史，不做状态初始化）
  useEffect(() => {
    const url = q ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [q]);

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

      {/* 网格 */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          {t("home.results", { n: 0 })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {results.map((r) => (
            <RelayCard key={r.id} relay={r} />
          ))}
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
