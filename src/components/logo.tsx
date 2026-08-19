import * as React from "react";

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
