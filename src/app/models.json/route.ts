import { getCatalog } from "@/lib/data";
import { serializeModels } from "@/lib/serialize";

export const dynamic = "force-static";

export function GET() {
  return Response.json(serializeModels(getCatalog()));
}
