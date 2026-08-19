"use client";

import { useApp } from "@/components/providers";
import type { DictKey } from "@/lib/i18n";

export function PageHeader({
  titleKey,
  descKey,
}: {
  titleKey: DictKey;
  descKey?: DictKey;
}) {
  const { t } = useApp();
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{t(titleKey)}</h1>
      {descKey && <p className="mt-1 text-sm text-muted-foreground">{t(descKey)}</p>}
    </div>
  );
}
