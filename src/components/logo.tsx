// 品牌 logo（内联 SVG，零外部依赖；也支持中转站提供真实 logo 图片，加载失败回退内联标识）。
// 中转站/厂商无真实 logo 资产时，用品牌色渐变 + 缩写/首字母生成统一风格的标识，
// 视觉接近 models.dev 的纯色 logo 风格；不依赖 public 文件（免疫外部删除）。

"use client";

import { useState } from "react";
import { hashHue, initial } from "@/lib/visual";

// 站点 Logo：路由/中转标记（两个输入节点汇向一个输出节点），
// 用品牌色 --brand 填充（与 favicon 一致），不随主题反色。
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--brand))" />
      <circle cx="9" cy="10" r="2.6" fill="hsl(var(--brand-foreground))" />
      <circle cx="9" cy="22" r="2.6" fill="hsl(var(--brand-foreground))" />
      <circle cx="23" cy="16" r="2.6" fill="hsl(var(--brand-foreground))" />
      <path
        d="M9 10h5a4 4 0 0 1 4 4v0M9 22h5a4 4 0 0 0 4-4v0"
        fill="none"
        stroke="hsl(var(--brand-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 14h5.2M14 18h5.2"
        stroke="hsl(var(--brand-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 知名模型厂商的品牌色（主色 → 深色），用于 ProviderLogo */
const BRAND_COLORS: Record<string, [string, string]> = {
  openai: ["#10a37f", "#0d8a6a"],
  anthropic: ["#d97757", "#c25e3d"],
  google: ["#4285f4", "#1a73e8"],
  deepseek: ["#4d6bfe", "#3b4fdb"],
  qwen: ["#615ced", "#4f49d9"],
  meta: ["#0668e1", "#044da6"],
  mistral: ["#fa520f", "#d4410a"],
  xai: ["#1f1f1f", "#000000"],
  zhipu: ["#3859ff", "#2743d6"],
  moonshot: ["#2b2b2b", "#111111"],
  minimax: ["#0055ff", "#0040c0"],
  tencent: ["#0052d9", "#003da6"],
  volcengine: ["#325ab4", "#24448c"],
  xiaomi: ["#ff6900", "#d95500"],
  nvidia: ["#76b900", "#5c9400"],
  groq: ["#f97316", "#ea580c"],
  together: ["#f43f5e", "#e11d48"],
  cloudflare: ["#f6821f", "#d96a12"],
};

/** 品牌色查询：有表用表，无表按 id 色相生成 */
function brandColors(seed: string): [string, string] {
  const known = BRAND_COLORS[seed];
  if (known) return known;
  const hue = hashHue(seed);
  return [`hsl(${hue} 70% 55%)`, `hsl(${(hue + 40) % 360} 70% 45%)`];
}

function LogoBox({
  id,
  ch,
  size,
  className,
  radius,
  fontSize,
}: {
  id: string;
  ch: string;
  size: number;
  className?: string;
  radius: number;
  fontSize: number;
}) {
  const [c1, c2] = brandColors(id);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={id}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx={radius} fill={`url(#lg-${id})`} />
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="#fff"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        {ch}
      </text>
    </svg>
  );
}

/** 厂商 logo（如 openai / anthropic / google ...） */
export function ProviderLogo({
  id,
  size = 20,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  return (
    <LogoBox id={id} ch={initial(id)} size={size} className={className} radius={9} fontSize={19} />
  );
}

/** 中转站 logo：优先真实图片（relay.logo），加载失败回退内联标识 */
export function RelayLogo({
  id,
  name,
  size = 40,
  className,
  logo,
}: {
  id: string;
  name: string;
  size?: number;
  className?: string;
  logo?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      // 外部 logo 需 onError 回退内联标识，用原生 img（禁用 next/image 提示）
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
        style={{ flexShrink: 0, objectFit: "contain", borderRadius: size * 0.25 }}
      />
    );
  }

  return (
    <LogoBox
      id={id}
      ch={initial(name)}
      size={size}
      className={className}
      radius={10}
      fontSize={18}
    />
  );
}
