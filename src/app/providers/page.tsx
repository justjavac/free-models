import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { RelayList } from "@/components/relay-list";
import { ProviderGrid } from "@/components/provider-grid";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "供应商 · Relay Free-Quota DB",
  description: "模型厂商与提供免费额度的 LLM 中转站列表。",
};

export default function ProvidersPage() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <PageHeader titleKey="nav.providers" descKey="site.tagline" />
      <div className="space-y-10">
        <ProviderGrid catalog={catalog} />
        <RelayList catalog={catalog} />
      </div>
    </main>
  );
}
