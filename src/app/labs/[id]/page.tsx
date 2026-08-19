import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/data";
import { LabDetail } from "@/components/lab-detail";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  const catalog = getCatalog();
  const providers = Array.from(
    new Set(Object.values(catalog.models).map((m) => m.provider)),
  );
  return providers.map((p) => ({ id: p }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} · Relay Free-Quota DB`,
    description: `${id} 的模型列表与可免费使用的中转站。`,
  };
}

export default async function LabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = getCatalog();
  const models = Object.values(catalog.models).filter((m) => m.provider === id);
  if (models.length === 0) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "模型库", item: "https://models.jjc.fun/" },
      {
        "@type": "ListItem",
        position: 2,
        name: id,
        item: `https://models.jjc.fun/labs/${id}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={breadcrumb} />
      <LabDetail provider={id} models={models} />
    </main>
  );
}
