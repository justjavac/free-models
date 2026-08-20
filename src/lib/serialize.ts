// JSON 端点序列化：输出与 models.dev 兼容的字段命名。
// - 顶层仍为 { [id]: ... }（models.dev 同构）
// - 模型字段：models.dev 用 limit:{context,output} / cost:{input,output}
//   本站保留 context/max_output/price（前端读取），同时补充 limit/cost（下游兼容）
// - relay.models 从 { [id]: ModelRef } 展开为完整模型对象（models.dev 的做法）

import type { ApiJson, CatalogJson, Model, ModelsJson } from "@/lib/types";

function toCompatModel(m: Model): Model & { limit?: { context?: number; output?: number }; cost?: { input?: number; output?: number } } {
  return {
    ...m,
    // models.dev 命名（下游工具可读）
    limit:
      m.context != null || m.max_output != null
        ? { context: m.context, output: m.max_output }
        : undefined,
    cost: m.price ? { input: m.price.input, output: m.price.output } : undefined,
  };
}

/** api.json：models.dev 兼容（models 展开为完整模型对象，含 limit/cost） */
export function serializeApi(catalog: CatalogJson): ApiJson {
  const out: ApiJson = {};
  for (const [id, r] of Object.entries(catalog.api)) {
    const models: Record<string, unknown> = {};
    for (const [mid, ref] of Object.entries(r.models)) {
      const m = catalog.models[mid];
      models[mid] = m ? toCompatModel(m) : ref;
    }
    out[id] = {
      ...r,
      // models.dev 顶层用 env 数组（本站权威值在 auth.env）
      env: r.env?.length ? r.env : r.auth.env,
      models: models as Record<string, Model>,
    };
  }
  return out;
}

/** models.json：模型条目含 limit/cost 兼容字段 */
export function serializeModels(catalog: CatalogJson): ModelsJson {
  const out: ModelsJson = {};
  for (const [id, m] of Object.entries(catalog.models)) {
    out[id] = toCompatModel(m);
  }
  return out;
}

/** catalog.json：api/models 均按兼容形状输出 */
export function serializeCatalog(catalog: CatalogJson): CatalogJson {
  return { api: serializeApi(catalog), models: serializeModels(catalog) };
}
