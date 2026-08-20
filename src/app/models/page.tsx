import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { ModelList } from "@/components/model-list";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "模型库",
  description: "收录各中转站提供的模型规格，查看可在哪些中转站免费使用。",
};

export default function ModelsPage() {
  const catalog = getCatalog();
  const models = Object.values(catalog.models);

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
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <JsonLd data={itemList} />
      <ModelList catalog={catalog} />
    </main>
  );
}
