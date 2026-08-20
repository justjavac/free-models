"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";
import { GithubIcon } from "@/components/github-icon";
import { REPO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n";

const NAV: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.providers" },
  { href: "/models", key: "nav.models" },
  { href: "/about", key: "nav.about" },
];

export function Header() {
  const { t, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // `/` 快捷键聚焦桌面搜索框（输入中不触发；避开系统快捷键）
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/models?q=${encodeURIComponent(term)}` : "/models");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-7 w-7" />
          <span className="text-foreground">{t("site.title")}</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors",
                isActive(item.href)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <form onSubmit={onSearch} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("nav.search")}
              aria-label={t("nav.search")}
              inputMode="search"
              className="h-9 w-56 rounded-md border border-border bg-transparent pl-8 pr-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:w-72 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </form>

          <LanguageSelect />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t("nav.theme")}
            title={t("nav.theme")}
            className="h-11 w-11"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label={t("nav.source")}
            title={t("nav.source")}
            className="hidden h-11 w-11 sm:inline-flex"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <GithubIcon className="h-4 w-4" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 md:hidden"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.menu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-b border-border/70 bg-background/95 backdrop-blur md:hidden"
        >
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 p-4">
            <form onSubmit={onSearch} className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("nav.search")}
                aria-label={t("nav.search")}
                inputMode="search"
                className="h-10 w-full rounded-md border border-border bg-transparent pl-8 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
