"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, Copy, Check, CheckCircle2, Minus } from "lucide-react";
import type { CatalogJson, Model } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Input } from "@/components/ui/input";
import { formatTokens } from "@/lib/format";
import type { DictKey } from "@/lib/i18n";

type SortKey = "latest" | "name" | "context";

function sortModels(list: Model[], sort: SortKey): Model[] {
  const arr = [...list];
  switch (sort) {
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "context":
      return arr.sort((a, b) => (b.context ?? 0) - (a.context ?? 0));
    case "latest":
    default:
      // 对齐 models.dev：默认按发布日期倒序（最新在前）
      return arr.sort((a, b) => {
        if (a.release_date && b.release_date)
          return b.release_date.localeCompare(a.release_date);
        if (a.release_date) return -1;
        if (b.release_date) return 1;
        return a.name.localeCompare(b.name);
      });
  }
}

export function ModelsExplorer({ catalog }: { catalog: CatalogJson }) {
  const { t } = useApp();
  const models = useMemo(() => Object.values(catalog.models), [catalog]);

  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
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
    return sortModels(list, sort);
  }, [q, fuse, models, provider, sort]);

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
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("nav.search")}
          className="h-12 pl-11 pr-10 text-base"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 排序 + 厂商筛选 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{t("models.sortBy")}:</span>
          <Chip active={sort === "latest"} onClick={() => setSort("latest")}>
            {t("models.sortLatest")}
          </Chip>
          <Chip active={sort === "name"} onClick={() => setSort("name")}>
            {t("models.sortName")}
          </Chip>
          <Chip active={sort === "context"} onClick={() => setSort("context")}>
            {t("models.sortContext")}
          </Chip>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <span className="shrink-0 text-xs text-muted-foreground">
            {t("models.providerFilter")}:
          </span>
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
      </div>

      {/* 模型表格（对齐 models.dev 列结构） */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden border-b border-border bg-card/60 px-3 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[2fr_0.8fr_0.7fr_1.4fr] xl:grid-cols-[2fr_0.8fr_0.7fr_0.8fr_0.55fr_0.55fr_0.7fr_1.2fr] md:gap-2">
          <span>{t("models.title")}</span>
          <span>{t("models.provider")}</span>
          <span>{t("models.context")}</span>
          <span className="hidden xl:block">{t("models.output")}</span>
          <span className="hidden xl:block">{t("models.reasoning")}</span>
          <span className="hidden xl:block">{t("models.toolCall")}</span>
          <span className="hidden xl:block">{t("models.weights")}</span>
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
                  className="grid grid-cols-1 gap-1 px-3 py-2.5 transition-colors hover:bg-accent/40 md:grid-cols-[2fr_0.8fr_0.7fr_1.4fr] md:items-center md:gap-2 xl:grid-cols-[2fr_0.8fr_0.7fr_0.8fr_0.55fr_0.55fr_0.7fr_1.2fr]"
                >
                  {/* 模型名称 + ID */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/models/${m.id.split("/").join("/")}`}
                        className="truncate font-medium text-foreground hover:underline"
                      >
                        {m.name}
                      </Link>
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
                    <div className="truncate text-xs text-muted-foreground">{m.id}</div>
                  </div>

                  {/* 厂商（链接到 labs 页） */}
                  <div className="hidden text-sm capitalize text-muted-foreground md:block">
                    <Link
                      href={`/labs/${m.provider}`}
                      className="hover:text-foreground hover:underline"
                    >
                      {m.provider}
                    </Link>
                  </div>

                  {/* 上下文 */}
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {formatTokens(m.context)}
                  </div>

                  {/* 输出长度 */}
                  <div className="hidden text-sm text-muted-foreground xl:block">
                    {formatTokens(m.max_output)}
                  </div>

                  {/* 推理 */}
                  <div className="hidden xl:block">
                    {m.reasoning ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* 工具调用 */}
                  <div className="hidden xl:block">
                    {m.tool_call ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* 权重 */}
                  <div className="hidden xl:block">
                    {m.open_weights ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/25">
                        {t("models.open")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/70">{t("models.closed")}</span>
                    )}
                  </div>

                  {/* 可免费使用的中转站 */}
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
                          <span className="px-1 py-0.5 text-xs text-muted-foreground">
                            +{extra}
                          </span>
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
