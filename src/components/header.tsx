"use client";

import Link from "next/link";
import { Moon, Sun, Languages, Code } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { monogramStyle, initial } from "@/lib/visual";

export function Header() {
  const { t, locale, toggleLocale, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={monogramStyle("relaydb")}
          >
            {initial("R")}
          </span>
          <span className="text-foreground">{t("site.title")}</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
          <Link href="/" className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground">
            {t("nav.home")}
          </Link>
          <a
            href="/catalog.json"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            {t("nav.api")}
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleLocale} aria-label="language">
            <Languages />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="github">
            <a href="https://github.com/anomalyco/models.dev" target="_blank" rel="noreferrer">
              <Code />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
