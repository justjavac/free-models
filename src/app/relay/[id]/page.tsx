import { notFound } from "next/navigation";
import { getCatalog, getRelay, getRelays } from "@/lib/data";
import { RelayDetail } from "@/components/relay-detail";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return getRelays().map((r) => ({ id: r.id }));
}

export const dynamicParams = false;

export default async function RelayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const relay = getRelay(id);
  if (!relay) notFound();
  const catalog = getCatalog();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "模型库", item: "https://models.jjc.fun/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "供应商",
        item: "https://models.jjc.fun/providers",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: relay.name,
        item: `https://models.jjc.fun/relay/${relay.id}`,
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
