import { getCatalog } from "@/lib/data";
import { generateLlms } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateLlms(getCatalog()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
