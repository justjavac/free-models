import { getCatalog } from "@/lib/data";
import { ModelList } from "@/components/model-list";
import { JsonLd } from "@/components/json-ld";

export default function Home() {
  const catalog = getCatalog();
  const models = Object.values(catalog.models);

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
    name: "LLM 模型列表",
    itemListElement: models.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.name,
      url: `https://models.jjc.fun/models/${m.id}`,
    })),
  };

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      <JsonLd data={webSite} />
      <JsonLd data={itemList} />
      <ModelList catalog={catalog} />
    </main>
  );
}
