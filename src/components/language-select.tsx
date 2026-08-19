"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
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
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="language"
      >
        <Globe className="h-4 w-4" />
        <span>{current.code === "zh" ? "中文" : "EN"}</span>
      </button>

      {open && (
        <div
          role="listbox"
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
                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent",
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
