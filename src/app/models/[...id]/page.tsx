import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/data";
import { ModelDetail } from "@/components/model-detail";

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
    title: model ? `${model.name} · Relay Free-Quota DB` : "模型 · Relay Free-Quota DB",
    description: model?.description,
  };
}

export default async function ModelPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const catalog = getCatalog();
  const model = catalog.models[id.join("/")];
  if (!model) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <ModelDetail model={model} catalog={catalog} />
    </main>
  );
}
