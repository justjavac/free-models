// 由字符串生成稳定的色相，用于字母徽标/标签配色（无外部图片，保证性能）。
import type { CSSProperties } from "react";

export function hashHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % 360;
}

export function monogramStyle(seed: string): CSSProperties {
  const hue = hashHue(seed);
  return {
    background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 45%))`,
  };
}

export function initial(name: string): string {
  const ch = name.trim()[0] ?? "?";
  return /[a-zA-Z]/.test(ch) ? ch.toUpperCase() : ch;
}
