"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Locale, type DictKey, translate } from "@/lib/i18n";

type Theme = "dark" | "light";

interface AppCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  theme: Theme;
  toggleTheme: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

function readStorage<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (localStorage.getItem(key) as T) || fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // 惰性初始化读取偏好（SSR 时返回默认值，避免 effect 内 setState）
  const [locale, setLocaleState] = useState<Locale>(() =>
    readStorage("locale", "zh" as Locale),
  );
  const [theme, setThemeState] = useState<Theme>(() =>
    readStorage("theme", "dark" as Theme),
  );

  // 与 <html> 同步（layout 的防闪烁脚本已处理首帧，这里跟随后续切换）
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#09090b" : "#ffffff");
    }
  }, [locale, theme]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
    } catch {
      /* 忽略 */
    }
  };
  const toggleLocale = () => setLocale(locale === "zh" ? "en" : "zh");
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* 忽略 */
    }
  };

  const t = (key: DictKey, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);

  return (
    <Ctx.Provider value={{ locale, setLocale, toggleLocale, t, theme, toggleTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
