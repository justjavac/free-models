import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { RelayList } from "@/components/relay-list";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "中转站（供应商）· Relay Free-Quota DB",
  description: "提供免费额度的 LLM 中转站 / 聚合网关列表，含免费额度与说明。",
};

export default function ProvidersPage() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <PageHeader titleKey="nav.providers" descKey="site.tagline" />
      <RelayList catalog={catalog} />
    </main>
  );
}
