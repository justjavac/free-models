import { getCatalog } from "@/lib/data";
import { RelayList } from "@/components/relay-list";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";

export default function Home() {
  const catalog = getCatalog();
  const relays = Object.values(catalog.api);

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "中转站免费额度库",
    alternateName: "Relay Free-Quota DB",
    url: "https://models.jjc.fun",
    description: "只收录提供免费额度的 LLM 中转站 / 聚合网关，数据以 JSON 开放。",
  };
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "中转站列表",
    itemListElement: relays.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name,
      url: `https://models.jjc.fun/relay/${r.id}`,
    })),
  };

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      <JsonLd data={webSite} />
      <JsonLd data={itemList} />
      <PageHeader titleKey="nav.providers" descKey="site.tagline" />
      <RelayList catalog={catalog} />
    </main>
  );
}
