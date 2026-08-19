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

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("dark");

  // 挂载后从 localStorage 恢复偏好
  useEffect(() => {
    const savedLocale = (localStorage.getItem("locale") as Locale) || "zh";
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
    setLocaleState(savedLocale);
    setTheme(savedTheme);
    document.documentElement.lang = savedLocale;
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  };
  const toggleLocale = () => setLocale(locale === "zh" ? "en" : "zh");
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
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
