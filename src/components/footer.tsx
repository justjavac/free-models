"use client";

import { useApp } from "@/components/providers";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.text")}</p>
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
    </footer>
  );
}
