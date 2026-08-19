import * as React from "react";

// 站点 Logo：路由/中转标记（两个输入节点汇向一个输出节点），
// 用主题 primary 色填充，自动适配暗/亮。
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <circle cx="9" cy="10" r="2.6" fill="hsl(var(--primary-foreground))" />
      <circle cx="9" cy="22" r="2.6" fill="hsl(var(--primary-foreground))" />
      <circle cx="23" cy="16" r="2.6" fill="hsl(var(--primary-foreground))" />
      <path
        d="M9 10h5a4 4 0 0 1 4 4v0M9 22h5a4 4 0 0 0 4-4v0"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 14h5.2M14 18h5.2"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
