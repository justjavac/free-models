import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { SearchExplorer } from "@/components/search-explorer";
import { ProviderGrid } from "@/components/provider-grid";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "供应商 · Relay Free-Quota DB",
  description: "模型厂商与提供免费额度的 LLM 中转站列表，可按免费类型、区域、厂商筛选。",
};

export default function ProvidersPage() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <PageHeader titleKey="nav.providers" descKey="site.tagline" />
      <div className="space-y-10">
        <ProviderGrid catalog={catalog} />
        <SearchExplorer catalog={catalog} />
      </div>
    </main>
  );
}
