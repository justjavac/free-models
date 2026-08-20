import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "中转站免费额度库 · Relay Free-Quota DB",
    template: "%s · Relay Free-Quota DB",
  },
  description:
    "只收录提供免费额度的 LLM 中转站 / 聚合网关。OpenAI 兼容、免费额度明细、模型规格，数据以 JSON 开放可被 curl 取用，支持 LLM 与 AI 工具读取。",
  applicationName: "Relay Free-Quota DB",
  keywords: [
    "LLM",
    "中转站",
    "API",
    "免费额度",
    "OpenAI 兼容",
    "聚合网关",
    "大模型",
    "models.dev",
    "llms.txt",
  ],
  authors: [{ name: "Relay Free-Quota DB" }],
  creator: "Relay Free-Quota DB",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "中转站免费额度库 · Relay Free-Quota DB",
    title: "中转站免费额度库 · Relay Free-Quota DB",
    description:
      "只收录提供免费额度的 LLM 中转站 / 聚合网关，数据以 JSON 开放，可被 curl 取用。",
  },
  twitter: {
    card: "summary_large_image",
    title: "中转站免费额度库 · Relay Free-Quota DB",
    description: "只收录提供免费额度的 LLM 中转站 / 聚合网关，数据以 JSON 开放。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#09090b" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme')||'dark';var l=localStorage.getItem('locale')||'zh';document.documentElement.lang=l;document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
