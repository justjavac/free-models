import { getCatalog } from "@/lib/data";
import { ModelsExplorer } from "@/components/models-explorer";

export default function Home() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <ModelsExplorer catalog={catalog} />
    </main>
  );
}
