import { getCatalog } from "@/lib/data";
import { serializeApi } from "@/lib/serialize";

export const dynamic = "force-static";

export function GET() {
  return Response.json(serializeApi(getCatalog()));
}
