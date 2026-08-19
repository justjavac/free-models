import { getCatalog } from "@/lib/data";
import { ModelList } from "@/components/model-list";

export default function Home() {
  const catalog = getCatalog();
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      <ModelList catalog={catalog} />
    </main>
  );
}
