"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers";

export function CopyButton({
  value,
  className,
  size = "sm",
}: {
  value: string;
  className?: string;
  size?: "sm" | "icon";
}) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 退化方案
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (size === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={onCopy}
        aria-label={t("detail.copy")}
      >
        {copied ? <Check className="text-emerald-400" /> : <Copy />}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" className={className} onClick={onCopy}>
      {copied ? <Check className="text-emerald-400" /> : <Copy />}
      {copied ? t("detail.copied") : t("detail.copy")}
    </Button>
  );
}
