"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useApp } from "@/components/providers";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

// 可扩展的语言列表：后续新增语言只需在此追加一项。
const LOCALES: { code: Locale; labelKey: "lang.zh" | "lang.en" }[] = [
  { code: "zh", labelKey: "lang.zh" },
  { code: "en", labelKey: "lang.en" },
];

export function LanguageSelect() {
  const { locale, setLocale, t } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        title={t(current.labelKey)}
      >
        <Languages className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 z-50 mt-1 w-32 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === locale}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                l.code === locale && "bg-accent font-medium",
              )}
            >
              {t(l.labelKey)}
              {l.code === locale && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
