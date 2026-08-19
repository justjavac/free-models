import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "中转站免费额度库 · Relay Free-Quota DB",
  description:
    "只收录提供免费额度的 LLM 中转站 / 聚合网关。OpenAI 兼容、可检索、数据以 JSON 开放可被 curl 取用。",
  metadataBase: new URL("https://models.jjc.fun"),
  openGraph: {
    title: "中转站免费额度库",
    description: "只收录提供免费额度的 LLM 中转站 / 聚合网关。",
    type: "website",
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
