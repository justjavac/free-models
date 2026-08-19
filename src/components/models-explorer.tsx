"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, Copy, Check } from "lucide-react";
import type { CatalogJson } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Input } from "@/components/ui/input";
import type { DictKey } from "@/lib/i18n";

// 上下文长度友好格式化：128000 → 128K，8000000 → 8M
function formatContext(n?: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export function ModelsExplorer({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const models = useMemo(() => Object.values(catalog.models), [catalog]);

  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化与 URL 同步（?q= &provider=）
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("q")) setQ(p.get("q")!);
    if (p.get("provider")) setProvider(p.get("provider")!);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (provider) params.set("provider", provider);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, provider]);

  // `/` 快捷键聚焦搜索
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const providers = useMemo(
    () => Array.from(new Set(models.map((m) => m.provider))).sort(),
    [models],
  );

  const fuse = useMemo(
    () =>
      new Fuse(models, {
        keys: ["name", "id", "provider", "description"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [models],
  );

  const results = useMemo(() => {
    let list = q.trim() ? fuse.search(q.trim()).map((x) => x.item) : models;
    if (provider) list = list.filter((m) => m.provider === provider);
    return list;
  }, [q, fuse, models, provider]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      /* 忽略剪贴板失败 */
    }
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("models.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("models.desc")}</p>
        </div>
        <p className="text-sm text-muted-foreground">{t("models.results", { n: results.length })}</p>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("nav.search")}
          className="h-10 pl-10 pr-9 text-base"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 厂商筛选 chips（横向滚动） */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="shrink-0 text-xs text-muted-foreground">{t("models.providerFilter")}:</span>
        <Chip active={!provider} onClick={() => setProvider("")}>
          {t("models.all")}
        </Chip>
        {providers.map((p) => (
          <Chip
            key={p}
            active={provider === p}
            onClick={() => setProvider(provider === p ? "" : p)}
          >
            {p}
          </Chip>
        ))}
      </div>

      {/* 模型表格 */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden grid-cols-[2fr_0.9fr_0.6fr_1.4fr] gap-2 border-b border-border bg-card/60 px-3 py-2 text-xs font-medium text-muted-foreground md:grid">
          <span>{t("models.title")}</span>
          <span>{t("models.provider")}</span>
          <span>{t("models.context")}</span>
          <span className="text-right">{t("models.availableOn")}</span>
        </div>
        {results.length === 0 ? (
          <div className="py-14 text-center text-sm text-muted-foreground">
            {t("models.noResults")}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {results.map((m) => {
              const shown = m.available_on.slice(0, 3);
              const extra = m.available_on.length - shown.length;
              return (
                <li
                  key={m.id}
                  className="grid grid-cols-1 gap-1 px-3 py-2 md:grid-cols-[2fr_0.9fr_0.6fr_1.4fr] md:items-center md:gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium text-foreground">{m.name}</span>
                      <button
                        type="button"
                        onClick={() => copyId(m.id)}
                        title={t("models.copyId")}
                        aria-label={t("models.copyId")}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copied === m.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {m.id}
                      {m.description ? ` · ${m.description}` : ""}
                    </div>
                  </div>
                  <div className="hidden text-sm capitalize text-muted-foreground md:block">
                    {m.provider}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {formatContext(m.context)}
                  </div>
                  <div className="flex flex-wrap justify-start gap-1 md:justify-end">
                    {m.available_on.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <>
                        {shown.map((rid) => (
                          <Link
                            key={rid}
                            href={`/relay/${rid}`}
                            className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20"
                          >
                            {rid}
                          </Link>
                        ))}
                        {extra > 0 && (
                          <span className="px-1 py-0.5 text-xs text-muted-foreground">+{extra}</span>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
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
      type="button"
      onClick={onClick}
      className={
        "shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
