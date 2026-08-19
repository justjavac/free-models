import { getCatalog } from "@/lib/data";
import { ModelsExplorer } from "@/components/models-explorer";

export default function Home() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      <ModelsExplorer catalog={catalog} />
    </main>
  );
}
