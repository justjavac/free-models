"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { GithubIcon } from "@/components/github-icon";
import { REPO_URL } from "@/lib/site";
import { useApp } from "@/components/providers";
import { CopyButton } from "@/components/copy-button";
import type { DictKey } from "@/lib/i18n";

const ENDPOINTS: { path: string; shapeKey: DictKey }[] = [
  { path: "/api.json", shapeKey: "about.shape.api" },
  { path: "/models.json", shapeKey: "about.shape.models" },
  { path: "/catalog.json", shapeKey: "about.shape.catalog" },
];

export function AboutContent({
  relayCount,
  modelCount,
}: {
  relayCount: number;
  modelCount: number;
}) {
  const { t } = useApp();
  return (
    <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
      {/* 定位 */}
      <section>
        <p>{t("about.body")}</p>
        <p className="mt-2 font-medium text-foreground">
          {t("about.count", { n: relayCount, m: modelCount })}
        </p>
      </section>

      {/* 收录标准 */}
      <Section title={t("about.criteria.title")}>
        <p>{t("about.criteria.body")}</p>
      </Section>

      {/* JSON 端点 */}
      <Section title={t("about.endpoints.title")}>
        <p>{t("about.endpoints.body")}</p>
        <div className="mt-3 space-y-2">
          {ENDPOINTS.map((e) => (
            <div key={e.path} className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <Link href={e.path} className="font-mono text-xs text-foreground hover:underline">
                  {e.path}
                </Link>
                <CopyButton value={`https://models.jjc.fun${e.path}`} size="icon" className="h-7 w-7" />
              </div>
              <p className="mt-1 text-xs">{t(e.shapeKey)}</p>
              <code className="mt-2 block overflow-x-auto rounded-md bg-secondary/60 px-2.5 py-1.5 font-mono text-[11px] text-secondary-foreground">
                {t("about.curl", { url: e.path })}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* 贡献 */}
      <Section title={t("about.contribute.title")}>
        <ol className="list-decimal space-y-1 pl-5">
          <li>{t("about.contribute.step1")}</li>
          <li>{t("about.contribute.step2")}</li>
          <li>{t("about.contribute.step3")}</li>
        </ol>
      </Section>

      {/* 开源 */}
      <Section title={t("about.source.title")}>
        <p className="flex flex-wrap items-center gap-1.5">
          {t("about.source.body")}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
          >
            <GithubIcon className="h-4 w-4" />
            relaydb
          </a>
        </p>
      </Section>

      {/* 免责声明 */}
      <Section title={t("about.disclaimer.title")}>
        <p>{t("about.disclaimer.body")}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card/40 p-4">
      <h2 className="mb-2 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
