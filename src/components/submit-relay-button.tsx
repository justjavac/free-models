"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers";
import { REPO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const SUBMIT_RELAY_URL = `${REPO_URL}/issues/new?template=submit-relay.yml`;

export function SubmitRelayButton({
  iconOnly = false,
  className,
}: {
  iconOnly?: boolean;
  className?: string;
}) {
  const { t } = useApp();
  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        asChild
        aria-label={t("submitRelay")}
        title={t("submitRelay")}
        className={cn("h-11 w-11", className)}
      >
        <a href={SUBMIT_RELAY_URL} target="_blank" rel="noreferrer">
          <Plus className="h-4 w-4" />
        </a>
      </Button>
    );
  }
  return (
    <Button asChild size="sm" className={className}>
      <a href={SUBMIT_RELAY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
        <Plus className="h-4 w-4" />
        {t("submitRelay")}
      </a>
    </Button>
  );
}
