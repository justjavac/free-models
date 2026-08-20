# 中转站免费额度库

一个**只收录提供免费额度的 LLM 中转站 / 聚合网关**。用来帮你快速找到：哪个中转站可以免费白嫖额度、哪个模型能在哪些中转站免费使用。

## 这里可以做什么

- **找免费中转站**：只收录有免费档的服务，注册赠送、每日签到、部分模型免费、无限免费等。
- **按模型查免费渠道**：在模型库搜任意模型（如 DeepSeek、Kimi、Qwen、Claude、GPT…），一键看它能在哪些中转站免费使用。
- **看完整规格**：每个模型都给出上下文、输出上限、推理 / 工具调用 / 结构化输出、价格等。

## 数据端点（可编程取用）

数据以静态 JSON 开放，可直接用 `curl` 拉取：

```
curl https://models.jjc.fun/api.json        # 按中转站 id 为键
curl https://models.jjc.fun/models.json     # 按模型 id 为键
curl https://models.jjc.fun/catalog.json    # 二者合并，一次拉全
```

这些 JSON 为每次部署时静态生成、随构建更新，采用短时缓存（JSON 浏览器 1h / CDN 边缘 1d，llms 短时 1d），适合被其他工具 / 脚本消费。

## 给 AI / LLM 工具使用

- `/llms.txt` 与 `/llms-full.txt`（见 [llms.txt](https://llmstxt.org) 规范）为 LLM / AI 代理提供站点索引与全量数据，方便大模型直接读取。

## 技术栈

Next.js + TypeScript + Tailwind CSS + shadcn 风格组件，静态生成（SSG），前端仅内存检索，无后端请求。
