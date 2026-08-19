// 构建期脚本：把 src/data/*.ts 转成 public/*.json
// 运行：node --import tsx scripts/generate.ts  (或 npm run gen)
// 输出严格对齐 models.dev 形状：api.json / models.json / catalog.json

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { relays } from "../src/data/relays";
import { models } from "../src/data/models";
import type { ApiJson, CatalogJson, ModelsJson } from "../src/lib/types";

const root = resolve(process.cwd());
const outDir = resolve(root, "public");
mkdirSync(outDir, { recursive: true });

// 1) 计算每个中转站的 model_count，并反查每个模型被哪些中转站提供
const availableMap = new Map<string, string[]>();
for (const model of models) availableMap.set(model.id, []);

const api: ApiJson = {};
for (const relay of relays) {
  const count = Object.keys(relay.models).length;
  const relayWithCount: typeof relay = { ...relay, model_count: count };
  api[relay.id] = relayWithCount;
  for (const modelId of Object.keys(relay.models)) {
    const list = availableMap.get(modelId);
    if (list) list.push(relay.id);
  }
}

// 2) 填充模型目录的 available_on
const modelsJson: ModelsJson = {};
for (const model of models) {
  modelsJson[model.id] = { ...model, available_on: availableMap.get(model.id) ?? [] };
}

// 3) 合并为 catalog.json
const catalog: CatalogJson = { api, models: modelsJson };

// 4) 写出（2 空格缩进，便于 diff 与人工校验）
writeFileSync(resolve(outDir, "api.json"), JSON.stringify(api, null, 2) + "\n");
writeFileSync(resolve(outDir, "models.json"), JSON.stringify(modelsJson, null, 2) + "\n");
writeFileSync(resolve(outDir, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");

const totalModels = Object.keys(modelsJson).length;
const totalRefs = Object.values(api).reduce((n, r) => n + r.model_count, 0);
console.log(
  `[generate] 已写入 public/api.json(${Object.keys(api).length} 家中转站) ` +
    `public/models.json(${totalModels} 个模型) public/catalog.json(引用 ${totalRefs} 条)`,
);
