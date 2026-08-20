import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/data";
import { ModelDetail } from "@/components/model-detail";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return Object.keys(getCatalog().models).map((id) => ({ id: id.split("/") }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = getCatalog().models[id.join("/")];
  return {
    title: model?.name ?? "模型",
    description: model?.description,
    alternates: { canonical: `https://models.jjc.fun/models/${id.join("/")}` },
  };
}

export default async function ModelPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const catalog = getCatalog();
  const model = catalog.models[id.join("/")];
  if (!model) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "模型库", item: "https://models.jjc.fun/models" },
      {
        "@type": "ListItem",
        position: 2,
        name: model.provider,
        item: `https://models.jjc.fun/labs/${model.provider}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: model.name,
        item: `https://models.jjc.fun/models/${model.id}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={breadcrumb} />
      <ModelDetail model={model} catalog={catalog} />
    </main>
  );
}
