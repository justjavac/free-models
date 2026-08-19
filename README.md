# 中转站免费额度库 (Relay Free-Quota DB)

一个类似 [models.dev](https://github.com/anomalyco/models.dev) 的站点，但**只收录提供免费额度的 LLM 中转站 / 聚合网关**。

技术栈：Next.js 16（App Router）+ TypeScript + Tailwind CSS v4 + shadcn 风格组件，全站静态生成（SSG），中英双语，暗色默认。

## 特性

- **免费额度导向**：仅收录有免费档的中转站（AnyRouter、AgentRouter、硅基流动、OpenRouter、火山方舟…），标注免费类型（赠送额度 / token / 每日签到 / 部分免费 / 无限）。
- **模型库**（`/`）：对齐 models.dev 的模型表格——上下文 / 输出长度 / 推理 / 工具调用 / 开放权重 / 价格，默认按发布日期倒序，行内复制模型 ID。
- **模型详情页**（`/models/{provider}/{slug}`）：完整规格（上下文、输出、多模态、价格、发布日期）+ 可免费使用的中转站列表。
- **厂商页**（`/labs/[id]`）：每个模型厂商的独立页，列出其全部模型。
- **中转站（供应商）页**（`/providers`）：中转站列表，突出免费额度与说明。
- **中转站详情页**（`/relay/[id]`）：规格、免费额度明细、模型表、一键复制 API 地址。
- **开放数据端点**（形状对齐 models.dev，构建期静态生成，可被 `curl` 直接取数）：
  - `GET /api.json` —— 按中转站 id 为键
  - `GET /models.json` —— 按模型 id 为键
  - `GET /catalog.json` —— 二者合并
  - 均带 `Cache-Control: public, max-age=31536000, immutable`
- **SEO 友好**：JSON-LD 结构化数据（WebSite / ItemList / BreadcrumbList）、自动生成的 OG/Twitter 品牌图（1200×630）、canonical、sitemap、robots。
- **LLM 友好**：`GET /llms.txt` 与 `GET /llms-full.txt`（[llms.txt 规范](https://llmstxt.org)）供 LLM / AI 工具读取站点索引与全量数据。
- **高性能**：全站 SSG，前端仅内存检索，无后端请求。

## 数据来源

数据集中在 `src/data/`（详见 [CONTRIBUTING.md](./CONTRIBUTING.md)）：`relays.ts` 为中转站，`models.ts` 为模型规格（含 `max_output`、`price`、`reasoning`、`open_weights` 等）。`model_count` 与模型 `available_on` 由 `src/lib/data.ts` 在构建期自动计算；JSON 与 LLM 文本端点由 `src/app/*/route.ts` 路由静态生成（`src/lib/llms.ts` 负责 llms 文本），无需手动同步。

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器 → http://localhost:3000
npm run lint     # ESLint 检查
npm run build    # 生产构建（输出 SSG 静态页 + 数据端点）
npm run start    # 运行生产构建
```

## 部署

标准 Next.js 项目，可直接部署到 Vercel（导入仓库即可，`npm run build` 会同时生成数据端点）。站点级配置（源码仓库地址等）见 `src/lib/site.ts`。
