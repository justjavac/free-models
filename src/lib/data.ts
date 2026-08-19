// 应用侧数据访问层：从 src/data/*.ts 构建内存目录。
// 服务端组件在 SSG 时直接调用，无需运行时网络请求。

import { relays as rawRelays } from "@/data/relays";
import { models as rawModels } from "@/data/models";
import type { ApiJson, CatalogJson, ModelsJson, Relay } from "@/lib/types";

function buildCatalog(): CatalogJson {
  const availableMap = new Map<string, string[]>();
  for (const m of rawModels) availableMap.set(m.id, []);

  const api: ApiJson = {};
  for (const relay of rawRelays) {
    const count = Object.keys(relay.models).length;
    const r: Relay = { ...relay, model_count: count };
    api[relay.id] = r;
    for (const modelId of Object.keys(relay.models)) {
      availableMap.get(modelId)?.push(relay.id);
    }
  }

  const models: ModelsJson = {};
  for (const m of rawModels) {
    models[m.id] = { ...m, available_on: availableMap.get(m.id) ?? [] };
  }

  return { api, models };
}

// 模块级 memo（构建期一次）
let _catalog: CatalogJson | null = null;
export function getCatalog(): CatalogJson {
  if (!_catalog) _catalog = buildCatalog();
  return _catalog;
}

export function getRelays(): Relay[] {
  return Object.values(getCatalog().api);
}

export function getRelay(id: string): Relay | undefined {
  return getCatalog().api[id];
}

export function getModel(id: string) {
  return getCatalog().models[id];
}
