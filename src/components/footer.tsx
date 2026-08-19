"use client";

import { useApp } from "@/components/providers";
import { GithubIcon } from "@/components/github-icon";
import { REPO_URL } from "@/lib/site";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.text")}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            className="inline-flex items-center gap-1.5 underline hover:text-foreground"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            {t("footer.source")}
          </a>
          <p className="text-xs">
            {t("api.note")}
            <a className="underline hover:text-foreground" href="/api.json">
              /api.json
            </a>{" "}
            <a className="underline hover:text-foreground" href="/models.json">
              /models.json
            </a>{" "}
            <a className="underline hover:text-foreground" href="/catalog.json">
              /catalog.json
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
