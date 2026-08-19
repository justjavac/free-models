import { getCatalog } from "@/lib/data";
import { generateLlmsFull } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateLlmsFull(getCatalog()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
