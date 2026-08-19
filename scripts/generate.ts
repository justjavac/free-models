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

// 5) 生成 LLM 友好文件（llms.txt 规范：https://llmstxt.org）
const base = "https://models.jjc.fun";
const freeText = (r: (typeof relays)[number]) =>
  `${r.free_quota.type ?? ""}${r.free_quota.amount ? ` · ${r.free_quota.amount}` : ""}`;

const llms: string[] = [];
llms.push("# 中转站免费额度库 (Relay Free-Quota DB)");
llms.push("");
llms.push("> 只收录提供免费额度的 LLM 中转站 / 聚合网关。OpenAI 兼容，数据以 JSON 开放，可被 curl 与 AI 工具直接取用。");
llms.push("");
llms.push("## 页面");
llms.push("");
llms.push("- [模型库](https://models.jjc.fun/)：全部模型规格（上下文/输出/推理/工具/权重/价格）与可免费使用的中转站");
llms.push("- [供应商](https://models.jjc.fun/providers)：模型厂商与中转站列表（免费额度、说明）");
llms.push("- [关于](https://models.jjc.fun/about)：站点说明与数据端点文档");
llms.push("");
llms.push("## 数据端点（JSON，可 GET）");
llms.push("");
llms.push(`- ${base}/api.json —— 按中转站 id 为键：免费额度、鉴权、计费、模型子集`);
llms.push(`- ${base}/models.json —— 按模型 id 为键：规格与自动计算的 available_on`);
llms.push(`- ${base}/catalog.json —— 两者合并`);
llms.push("");
llms.push(`## 模型（${models.length}）`);
llms.push("");
for (const m of models) {
  const on = (availableMap.get(m.id) ?? []).join("、") || "暂无";
  const price = m.price ? `$${m.price.input ?? "?"}/$${m.price.output ?? "?"}/1M` : "—";
  llms.push(`- [${m.name}](${base}/models/${m.id}) — ${m.provider}，上下文 ${m.context ?? "?"}，价格 ${price}，免费中转站：${on}`);
}
llms.push("");
llms.push(`## 中转站（${relays.length}）`);
llms.push("");
for (const r of relays) {
  llms.push(`- [${r.name}](${base}/relay/${r.id}) — API ${r.api}；免费额度：${freeText(r) || "—"}`);
}
llms.push("");
writeFileSync(resolve(outDir, "llms.txt"), llms.join("\n") + "\n");

// llms-full.txt：全量规格文本（供需要完整上下文的 LLM 读取）
const full: string[] = [];
full.push("# 中转站免费额度库 (Relay Free-Quota DB) — 全量数据");
full.push("");
full.push(`> 收录 ${relays.length} 家中转站、${models.length} 个模型。数据由社区人工维护，价格与免费额度可能变化，请以官方为准。`);
full.push("> 机器可读端点：/api.json、/models.json、/catalog.json（JSON）；本文件与 /llms.txt 为 LLM 友好文本。");
full.push("");
full.push(`## 模型规格（${models.length}）`);
full.push("");
for (const m of models) {
  full.push(`### ${m.id}`);
  full.push(`- 名称：${m.name}`);
  full.push(`- 厂商：${m.provider}`);
  if (m.description) full.push(`- 描述：${m.description}`);
  full.push(`- 上下文：${m.context ?? "?"}`);
  full.push(`- 最大输出：${m.max_output ?? "?"}`);
  full.push(`- 输入模态：${m.modalities.input.join(", ")}`);
  full.push(`- 输出模态：${m.modalities.output.join(", ")}`);
  full.push(`- 推理：${m.reasoning ? "是" : "否"}`);
  full.push(`- 工具调用：${m.tool_call ? "是" : "否"}`);
  full.push(`- 开放权重：${m.open_weights ? "是" : "否"}`);
  if (m.release_date) full.push(`- 发布：${m.release_date}`);
  if (m.price) full.push(`- 价格（$/1M tokens）：输入 $${m.price.input ?? "?"}，输出 $${m.price.output ?? "?"}`);
  full.push(`- 可免费使用的中转站：${(availableMap.get(m.id) ?? []).join(", ") || "暂无"}`);
  full.push("");
}
full.push(`## 中转站（${relays.length}）`);
full.push("");
for (const r of relays) {
  full.push(`### ${r.name}（${r.id}）`);
  full.push(`- 官网：${r.url}`);
  full.push(`- API：${r.api}`);
  full.push(`- OpenAI 兼容：${r.openai_compatible ? "是" : "否"}`);
  full.push(`- 免费额度：${freeText(r) || "—"}`);
  if (r.free_quota.notes) full.push(`- 免费额度说明：${r.free_quota.notes}`);
  full.push(`- 计费：${r.pricing.notes ?? r.pricing.model}`);
  full.push(`- 支持厂商：${r.providers.join(", ")}`);
  full.push(`- 模型数：${Object.keys(r.models).length}`);
  full.push(`- 区域：${r.region.join(", ")}`);
  full.push(`- 状态：${r.status}`);
  full.push(`- 更新时间：${r.updated_at}`);
  full.push("");
}
writeFileSync(resolve(outDir, "llms-full.txt"), full.join("\n") + "\n");

const totalModels = Object.keys(modelsJson).length;
const totalRefs = Object.values(api).reduce((n, r) => n + r.model_count, 0);
console.log(
  `[generate] 已写入 public/api.json(${Object.keys(api).length} 家中转站) ` +
    `public/models.json(${totalModels} 个模型) public/catalog.json(引用 ${totalRefs} 条)`,
);
