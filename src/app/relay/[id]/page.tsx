import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog, getRelay, getRelays } from "@/lib/data";
import { RelayDetail } from "@/components/relay-detail";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getRelays().map((r) => ({ id: r.id }));
}

export const dynamicParams = false;

const BASE = SITE_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const relay = getRelay(id);
  if (!relay) return {};
  const fq = relay.free_quota;
  const desc = fq.available && fq.amount
    ? `${relay.name}：${fq.amount}${fq.notes ? `，${fq.notes}` : ""}`
    : `${relay.name} 的免费额度、支持的模型与注册方式。`;
  const url = `${BASE}/relay/${relay.id}`;
  return {
    title: relay.name,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${relay.name} · Relay Free-Quota DB`,
      description: desc,
      url,
      type: "website",
    },
  };
}

export default async function RelayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const relay = getRelay(id);
  if (!relay) notFound();
  const catalog = getCatalog();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "中转站", item: `${BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: relay.name,
        item: `${BASE}/relay/${relay.id}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <RelayDetail relay={relay} catalog={catalog} />
    </>
  );
}
