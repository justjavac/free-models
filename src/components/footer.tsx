"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { GithubIcon } from "@/components/github-icon";
import { Logo } from "@/components/logo";
import { REPO_URL } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/", key: "nav.providers" },
  { href: "/models", key: "nav.models" },
  { href: "/about", key: "nav.about" },
];

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-border/70 bg-card/30">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Logo className="h-6 w-6" />
            <span>{t("site.title")}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">{t("site.tagline")}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {t(item.key as Parameters<typeof t>[0])}
            </Link>
          ))}
          <a
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            {t("footer.source")}
          </a>
        </nav>

        <div className="text-xs text-muted-foreground">
          {t("api.note")}
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            <a className="underline hover:text-foreground" href="/api.json">
              /api.json
            </a>
            <a className="underline hover:text-foreground" href="/models.json">
              /models.json
            </a>
            <a className="underline hover:text-foreground" href="/catalog.json">
              /catalog.json
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.text")}</p>
          <p>
            © {new Date().getFullYear()} {t("site.title")}
          </p>
        </div>
      </div>
    </footer>
  );
}
