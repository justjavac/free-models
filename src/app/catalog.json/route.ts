import { getCatalog } from "@/lib/data";
import { serializeCatalog } from "@/lib/serialize";

export const dynamic = "force-static";

export function GET() {
  return Response.json(serializeCatalog(getCatalog()));
}
