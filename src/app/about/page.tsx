import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "关于 · Relay Free-Quota DB",
  description: "关于本站：只收录提供免费额度的 LLM 中转站与聚合网关，数据以 JSON 开放。",
};

export default function AboutPage() {
  const catalog = getCatalog();
  const relayCount = Object.keys(catalog.api).length;
  const modelCount = Object.keys(catalog.models).length;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader titleKey="about.title" />
      <AboutContent relayCount={relayCount} modelCount={modelCount} />
    </main>
  );
}
