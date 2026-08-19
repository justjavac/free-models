# 贡献指南 (Contributing)

本站只收录**提供免费额度**的 LLM 中转站 / 聚合网关（OpenAI 兼容优先）。

## 数据来源

所有数据集中在 `src/data/`：

- `src/data/relays.ts` —— 中转站清单（含 API base、鉴权、免费额度、支持的厂商/模型）
- `src/data/models.ts` —— 共享模型目录（跨中转站复用的模型规格）

`model_count` 与每个模型的 `available_on`（在哪些中转站可用）由 `scripts/generate.ts` 在构建期**自动计算**，请勿手填。

## 新增 / 修正一家中转站

1. 在 `src/data/relays.ts` 的 `relays` 数组追加一项，使用下方模板：

```ts
{
  id: "example",                       // 唯一 slug，作为 api.json 的键
  name: "Example Relay",
  url: "https://example.com",
  api: "https://example.com/v1",       // OpenAI 兼容 base
  env: ["EXAMPLE_API_KEY"],
  openai_compatible: true,
  auth: { type: "api_key", env: ["EXAMPLE_API_KEY"], signup: "https://example.com/register" },
  free_quota: {
    available: true,
    type: "credit",                    // credit | token | daily_checkin | free_models | unlimited
    amount: "新用户赠送 $5",
    amount_usd: 5,
    notes: "需核实具体数额",
  },
  pricing: { model: "no_markup" },     // no_markup | retail | markup | free
  features: ["openai_compatible", "failover"],
  providers: ["openai", "anthropic"],
  model_count: 0,                      // 自动计算，写 0 即可
  region: ["global"],                  // global | cn
  status: "operational",               // operational | degraded | down
  updated_at: "2026-08-19",
  models: {
    "openai/gpt-4o": { id: "openai/gpt-4o", name: "GPT-4o" },
  },
}
```

2. 若模型不在 `models.ts` 中，先在 `models.ts` 补充模型规格。
3. 运行 `npm run gen` 重新生成 `public/*.json`，确认无误后提交 PR。

## 本地开发

```bash
npm install
npm run dev        # 自动生成 JSON 并启动，访问 http://localhost:3000
npm run build      # 生成 JSON + 生产构建
```

## 校验

CI 会自动执行 `npm run build`（包含类型检查与 JSON 生成）。PR 需通过 CI。
