import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { SearchExplorer } from "@/components/search-explorer";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "供应商 · Relay Free-Quota DB",
  description: "提供免费额度的 LLM 中转站与聚合网关列表，可按免费类型、区域、厂商筛选。",
};

export default function ProvidersPage() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      <PageHeader titleKey="nav.providers" descKey="site.tagline" />
      <SearchExplorer catalog={catalog} />
    </main>
  );
}
