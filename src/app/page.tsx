import { getCatalog } from "@/lib/data";
import { Hero } from "@/components/hero";
import { SearchExplorer } from "@/components/search-explorer";

export default function Home() {
  const catalog = getCatalog();
  const relayCount = Object.keys(catalog.api).length;
  const modelCount = Object.keys(catalog.models).length;

  return (
    <>
      <Hero relayCount={relayCount} modelCount={modelCount} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <SearchExplorer catalog={catalog} />
      </main>
    </>
  );
}
