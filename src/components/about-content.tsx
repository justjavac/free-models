"use client";

import { type ReactNode } from "react";
import { GithubIcon } from "@/components/github-icon";
import { REPO_URL, SITE_URL } from "@/lib/site";
import { useApp } from "@/components/providers";
import { CopyButton } from "@/components/copy-button";
import type { DictKey } from "@/lib/i18n";
import { Target, Database, Box, Layers, HandHeart, Scale } from "lucide-react";

const ENDPOINTS: { path: string; shapeKey: DictKey; icon: ReactNode }[] = [
  { path: "/api.json", shapeKey: "about.shape.api", icon: <Database className="h-4 w-4" /> },
  { path: "/models.json", shapeKey: "about.shape.models", icon: <Box className="h-4 w-4" /> },
  { path: "/catalog.json", shapeKey: "about.shape.catalog", icon: <Layers className="h-4 w-4" /> },
];

const STEPS = ["about.contribute.step1", "about.contribute.step2", "about.contribute.step3"] as const;

export function AboutContent({
  relayCount,
  modelCount,
}: {
  relayCount: number;
  modelCount: number;
}) {
  const { t } = useApp();
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      {/* 收录标准 */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
          <Target className="h-4 w-4 text-emerald-500" />
          {t("about.criteria.title")}
        </h2>
        <p>{t("about.criteria.body")}</p>
        <p className="mt-3 font-medium text-foreground">
          {t("about.count", { n: relayCount, m: modelCount })}
        </p>
      </section>

      {/* JSON 端点 */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <Database className="h-4 w-4 text-violet-500" />
          {t("about.endpoints.title")}
        </h2>
        <p className="mb-4">{t("about.endpoints.body")}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ENDPOINTS.map((e) => (
            <div
              key={e.path}
              className="flex flex-col rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-foreground/20"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                  {e.icon}
                  {e.path}
                </div>
                <CopyButton value={`${SITE_URL}${e.path}`} size="icon" className="h-7 w-7" />
              </div>
              <p className="mb-3 text-xs">{t(e.shapeKey)}</p>
              <code className="mt-auto block overflow-x-auto rounded-md bg-secondary/60 px-2.5 py-1.5 font-mono text-xs text-secondary-foreground">
                {t("about.curl", { base: SITE_URL, url: e.path })}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* 贡献 */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <HandHeart className="h-4 w-4 text-rose-500" />
          {t("about.contribute.title")}
        </h2>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              <span>{t(step)}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 开源 */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
          <GithubIcon className="h-4 w-4" />
          {t("about.source.title")}
        </h2>
        <p className="flex flex-wrap items-center gap-1.5">
          {t("about.source.body")}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
          >
            <GithubIcon className="h-4 w-4" />
            free-models
          </a>
        </p>
      </section>

      {/* 免责声明 */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
          <Scale className="h-4 w-4 text-amber-500" />
          {t("about.disclaimer.title")}
        </h2>
        <p>{t("about.disclaimer.body")}</p>
      </section>
    </div>
  );
}
