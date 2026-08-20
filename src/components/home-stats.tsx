"use client";

import { Server, Cpu, Gift } from "lucide-react";
import { useApp } from "@/components/providers";

export function HomeStats({
  relayCount,
  modelCount,
  freeRelayCount,
}: {
  relayCount: number;
  modelCount: number;
  freeRelayCount: number;
}) {
  const { t } = useApp();

  const stats = [
    {
      icon: <Server className="h-5 w-5 text-indigo-500" />,
      label: t("home.stats.relays"),
      value: relayCount,
    },
    {
      icon: <Cpu className="h-5 w-5 text-violet-500" />,
      label: t("home.stats.models"),
      value: modelCount,
    },
    {
      icon: <Gift className="h-5 w-5 text-emerald-500" />,
      label: t("home.stats.free"),
      value: freeRelayCount,
      accent: true,
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border p-4 shadow-sm ${
            s.accent
              ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent"
              : "border-border/60 bg-card"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {s.icon}
            <span>{s.label}</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {s.value.toLocaleString()}
          </div>
        </div>
      ))}
    </section>
  );
}
