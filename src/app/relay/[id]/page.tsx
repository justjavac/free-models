import { notFound } from "next/navigation";
import { getCatalog, getRelay, getRelays } from "@/lib/data";
import { RelayDetail } from "@/components/relay-detail";

export function generateStaticParams() {
  return getRelays().map((r) => ({ id: r.id }));
}

export const dynamicParams = false;

export default async function RelayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const relay = getRelay(id);
  if (!relay) notFound();
  const catalog = getCatalog();
  return <RelayDetail relay={relay} catalog={catalog} />;
}
