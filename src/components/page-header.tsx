"use client";

import { useApp } from "@/components/providers";
import type { DictKey } from "@/lib/i18n";
import type { ReactNode } from "react";

export function PageHeader({
  titleKey,
  descKey,
  icon,
  children,
}: {
  titleKey: DictKey;
  descKey?: DictKey;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const { t } = useApp();
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground text-balance">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {t(titleKey)}
        </h1>
        {descKey && <p className="mt-1.5 text-base text-muted-foreground">{t(descKey)}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
