# 中转站免费额度库 (Relay Free-Quota DB)

一个类似 [models.dev](https://github.com/anomalyco/models.dev) 的站点，但**只收录提供免费额度的 LLM 中转站 / 聚合网关**。

技术栈：Next.js 16（App Router）+ TypeScript + Tailwind CSS v4 + shadcn 风格组件，全站静态生成（SSG），中英双语，暗色默认。

## 特性

- **免费额度导向**：仅收录有免费档的中转站（AnyRouter、AgentRouter、硅基流动、OpenRouter、火山方舟…），标注免费类型（赠送额度 / token / 每日签到 / 部分免费 / 无限）。
- **模型库**（`/`）：对齐 models.dev 的模型表格——上下文 / 输出长度 / 推理 / 工具调用 / 开放权重 / 价格，支持模糊搜索、厂商筛选与「最新 / 名称 / 上下文」排序，行内复制模型 ID。
- **模型详情页**（`/models/{provider}/{slug}`）：完整规格（上下文、输出、多模态、价格、发布日期）+ 可免费使用的中转站列表。
- **厂商页**（`/labs/[id]`）：每个模型厂商的独立页，列出其全部模型。
- **供应商页**（`/providers`）：模型厂商 logo 网格 + 中转站即时搜索与多维筛选（免费类型 / 区域 / 厂商 / OpenAI 兼容 / 状态）。
- **中转站详情页**（`/relay/[id]`）：规格、免费额度明细、模型表、OpenAI SDK / curl / AI SDK 接入示例与一键复制。
- **开放 JSON 端点**（形状对齐 models.dev，可被 `curl` 直接取数）：
  - `GET /api.json` —— 按中转站 id 为键
  - `GET /models.json` —— 按模型 id 为键
  - `GET /catalog.json` —— 二者合并
  - 均带 `Cache-Control: public, max-age=31536000, immutable`
- **高性能**：全站 SSG（55 个静态页），前端仅内存检索，无后端请求；`/` 快捷键聚焦搜索。

## 数据来源

数据集中在 `src/data/`（详见 [CONTRIBUTING.md](./CONTRIBUTING.md)）：`relays.ts` 为中转站，`models.ts` 为模型规格（含 `max_output`、`price`、`reasoning`、`open_weights` 等）。`model_count` 与模型 `available_on` 由 `scripts/generate.ts` 在构建期自动计算，生成 `public/*.json`。

## 本地开发

```bash
npm install
npm run dev      # 自动生成 JSON 并启动 → http://localhost:3000
npm run gen      # 仅重新生成 public/*.json
npm run lint     # ESLint 检查
npm run build    # 生成 JSON + 生产构建（输出 SSG 静态页）
```

## 部署

标准 Next.js 项目，可直接部署到 Vercel（导入仓库即可，`npm run build` 会同时生成 JSON 端点）。站点级配置（源码仓库地址等）见 `src/lib/site.ts`。
