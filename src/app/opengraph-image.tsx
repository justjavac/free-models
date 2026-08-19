import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "中转站免费额度库 · Relay Free-Quota DB";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="#ffffff" />
          <g fill="#6366f1">
            <circle cx="9" cy="10" r="2.6" />
            <circle cx="9" cy="22" r="2.6" />
            <circle cx="23" cy="16" r="2.6" />
          </g>
          <g fill="none" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round">
            <path d="M9 10h5a4 4 0 0 1 4 4v0M9 22h5a4 4 0 0 0 4-4v0" />
            <path d="M14 14h5.2M14 18h5.2" />
          </g>
        </svg>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 32, letterSpacing: 2 }}>
          中转站免费额度库
        </div>
        <div style={{ fontSize: 30, opacity: 0.9, marginTop: 12 }}>
          Relay Free-Quota DB · 只收录提供免费额度的 LLM 中转站
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.75,
            marginTop: 24,
            display: "flex",
            gap: 16,
          }}
        >
          <span>OpenAI 兼容</span>·<span>数据 JSON 开放</span>·<span>可 curl 取用</span>
        </div>
      </div>
    ),
    size,
  );
}
