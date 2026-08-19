"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import type { CatalogJson } from "@/lib/types";
import { useApp } from "@/components/providers";
import { Input } from "@/components/ui/input";
import type { DictKey } from "@/lib/i18n";

export function ModelsExplorer({ catalog }: { catalog: CatalogJson }) {
  const { t, locale } = useApp();
  const models = useMemo(() => Object.values(catalog.models), [catalog]);

  const [q, setQ] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("q");
    if (p) setQ(p);
  }, []);
  useEffect(() => {
    const url = q ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [q]);

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
    const list = q.trim() ? fuse.search(q.trim()).map((x) => x.item) : models;
    return list;
  }, [q, fuse, models]);

  return (
    <div className="space-y-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("models.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("models.desc")}</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("nav.search")}
          className="h-11 pl-10 text-base"
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

      <p className="text-sm text-muted-foreground">{t("models.results", { n: results.length })}</p>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden grid-cols-[1.5fr_0.8fr_0.7fr_1.4fr] gap-2 border-b border-border bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>{t("models.title")}</span>
          <span>{t("models.provider")}</span>
          <span>{t("models.context")}</span>
          <span className="text-right">{t("models.availableOn")}</span>
        </div>
        <ul className="divide-y divide-border">
          {results.map((m) => {
            const shown = m.available_on.slice(0, 3);
            const extra = m.available_on.length - shown.length;
            return (
              <li key={m.id} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1.5fr_0.8fr_0.7fr_1.4fr] sm:items-center sm:gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{m.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {m.id}
                    {m.description ? ` · ${m.description}` : ""}
                  </div>
                </div>
                <div className="hidden text-sm capitalize text-muted-foreground sm:block">
                  {m.provider}
                </div>
                <div className="hidden text-sm text-muted-foreground sm:block">
                  {m.context ? m.context.toLocaleString() : "—"}
                </div>
                <div className="flex flex-wrap justify-start gap-1 sm:justify-end">
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
      </div>
    </div>
  );
}
