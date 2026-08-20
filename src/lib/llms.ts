// LLM 友好文本生成（llms.txt 规范，https://llmstxt.org）
// 由 /llms.txt、/llms-full.txt 路由调用，构建期静态化；不再依赖 public 静态文件。

import type { CatalogJson, Relay } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

function freeText(r: Relay): string {
  const fq = r.free_quota;
  return `${fq.type ?? ""}${fq.amount ? ` · ${fq.amount}` : ""}`.trim();
}

/** /llms.txt：站点索引（页面 + 数据端点 + 模型/中转站一句话列表） */
export function generateLlms(catalog: CatalogJson): string {
  const relays = Object.values(catalog.api);
  const models = Object.values(catalog.models);
  const lines: string[] = [];

  lines.push("# 中转站免费额度库 (Relay Free-Quota DB)");
  lines.push("");
  lines.push("> 只收录提供免费额度的 LLM 中转站 / 聚合网关。OpenAI 兼容，数据以 JSON 开放，可被 curl 与 AI 工具直接取用。");
  lines.push("");
  lines.push("## 页面");
  lines.push("");
  lines.push(`- [模型库](${BASE}/)：全部模型规格（上下文/输出/推理/工具/权重/价格）与可免费使用的中转站`);
  lines.push(`- [中转站（供应商）](${BASE}/providers)：中转站列表（免费额度、说明）`);
  lines.push(`- [关于](${BASE}/about)：站点说明与数据端点文档`);
  lines.push("");
  lines.push("## 数据端点（JSON，可 GET）");
  lines.push("");
  lines.push(`- ${BASE}/api.json —— 按中转站 id 为键：免费额度、鉴权、计费、模型子集`);
  lines.push(`- ${BASE}/models.json —— 按模型 id 为键：规格与自动计算的 available_on`);
  lines.push(`- ${BASE}/catalog.json —— 两者合并`);
  lines.push("");
  lines.push(`## 模型（${models.length}）`);
  lines.push("");
  for (const m of models) {
    const on = m.available_on.join("、") || "暂无";
    const price = m.price ? `$${m.price.input ?? "?"}/$${m.price.output ?? "?"}/1M` : "—";
    lines.push(
      `- [${m.name}](${BASE}/models/${m.id}) — ${m.provider}，上下文 ${m.context ?? "?"}，价格 ${price}，免费中转站：${on}`,
    );
  }
  lines.push("");
  lines.push(`## 中转站（${relays.length}）`);
  lines.push("");
  for (const r of relays) {
    lines.push(`- [${r.name}](${BASE}/relay/${r.id}) — API ${r.api}；免费额度：${freeText(r) || "—"}`);
  }
  lines.push("");

  return lines.join("\n") + "\n";
}

/** /llms-full.txt：全量规格文本（供需要完整上下文的 LLM 读取） */
export function generateLlmsFull(catalog: CatalogJson): string {
  const relays = Object.values(catalog.api);
  const models = Object.values(catalog.models);
  const lines: string[] = [];

  lines.push("# 中转站免费额度库 (Relay Free-Quota DB) — 全量数据");
  lines.push("");
  lines.push(
    `> 收录 ${relays.length} 家中转站、${models.length} 个模型。数据由社区人工维护，价格与免费额度可能变化，请以官方为准。`,
  );
  lines.push("> 机器可读端点：/api.json、/models.json、/catalog.json（JSON）；本文件与 /llms.txt 为 LLM 友好文本。");
  lines.push("");
  lines.push(`## 模型规格（${models.length}）`);
  lines.push("");
  for (const m of models) {
    lines.push(`### ${m.id}`);
    lines.push(`- 名称：${m.name}`);
    lines.push(`- 厂商：${m.provider}`);
    if (m.description) lines.push(`- 描述：${m.description}`);
    lines.push(`- 上下文：${m.context ?? "?"}`);
    lines.push(`- 最大输出：${m.max_output ?? "?"}`);
    lines.push(`- 输入模态：${m.modalities.input.join(", ")}`);
    lines.push(`- 输出模态：${m.modalities.output.join(", ")}`);
    lines.push(`- 推理：${m.reasoning ? "是" : "否"}`);
    lines.push(`- 工具调用：${m.tool_call ? "是" : "否"}`);
    lines.push(`- 开放权重：${m.open_weights ? "是" : "否"}`);
    lines.push(`- 结构化输出：${m.structured_output ? "是" : "否"}`);
    if (m.release_date) lines.push(`- 发布：${m.release_date}`);
    if (m.price) {
      lines.push(`- 价格（$/1M tokens）：输入 $${m.price.input ?? "?"}，输出 $${m.price.output ?? "?"}`);
    }
    lines.push(`- 可免费使用的中转站：${m.available_on.join(", ") || "暂无"}`);
    lines.push("");
  }
  lines.push(`## 中转站（${relays.length}）`);
  lines.push("");
  for (const r of relays) {
    lines.push(`### ${r.name}（${r.id}）`);
    lines.push(`- 官网：${r.url}`);
    lines.push(`- API：${r.api}`);
    lines.push(`- OpenAI 兼容：${r.openai_compatible ? "是" : "否"}`);
    lines.push(`- 特性：${r.features.join(", ")}`);
    if (r.doc) lines.push(`- 文档：${r.doc}`);
    lines.push(`- 免费额度：${freeText(r) || "—"}`);
    if (r.free_quota.notes) lines.push(`- 免费额度说明：${r.free_quota.notes}`);
    lines.push(`- 注册 / 获取 Key：${r.auth.signup}`);
    lines.push(`- 计费：${r.pricing.notes ?? r.pricing.model}`);
    lines.push(`- 支持厂商：${r.providers.join(", ")}`);
    lines.push(`- 模型数：${r.model_count}`);
    lines.push(`- 区域：${r.region.join(", ")}`);
    lines.push(`- 状态：${r.status}`);
    lines.push(`- 更新时间：${r.updated_at}`);
    lines.push("");
  }

  return lines.join("\n") + "\n";
}
