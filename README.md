# 中转站免费额度库 (Relay Free-Quota DB)

一个类似 [models.dev](https://models.dev/) 的站点，但**只收录提供免费额度的 LLM 中转站 / 聚合网关**。用来帮你快速找到：哪个中转站可以免费白嫖额度、哪个模型能在哪些中转站免费使用。

## 这里可以做什么

- **找免费中转站**：只收录有免费档的服务（注册赠送、每日签到、部分模型免费、无限免费等），首页即可对比各家的免费额度与赠送幅度。
- **按模型查免费渠道**：在模型库搜任意模型（如 DeepSeek、Kimi、Qwen、Claude、GPT…），一键看它能在哪些中转站免费使用。
- **看完整规格**：每个模型都给出上下文、输出上限、推理 / 工具调用 / 结构化输出、价格等，对齐 models.dev 的风格。

## 页面导航

| 页面 | 说明 |
| --- | --- |
| 首页 `/` | 全部中转站列表，突出免费额度与说明，可一键注册 |
| 模型库 `/models` | 全部模型规格表格，支持关键词搜索、按发布日期排序 |
| 模型详情 `/models/{厂商}/{模型}` | 单个模型的完整规格 + 可免费使用的中转站 |
| 厂商页 `/labs/{厂商}` | 某厂商（如 Anthropic、DeepSeek…）下全部模型 |
| 中转站详情 `/relay/{站点}` | 该站免费额度明细、支持的模型与注册入口 |
| 关于 `/about` | 站点说明与收录标准 |

中英双语、暗色默认，全站静态生成，打开即用，无需登录。

## 数据端点（可编程取用）

数据以静态 JSON 开放，形状对齐 models.dev，可直接用 `curl` 拉取：

```
curl https://models.jjc.fun/api.json        # 按中转站 id 为键
curl https://models.jjc.fun/models.json     # 按模型 id 为键
curl https://models.jjc.fun/catalog.json    # 二者合并，一次拉全
```

接口带一年不可变缓存头，适合被其他工具 / 脚本消费。

### 厂商 Logo

供应商 logo 使用 [models.dev](https://models.dev/) 官方提供的 SVG（`https://models.dev/logos/{provider}.svg`，如 `anthropic`、`openai`、`google`），找不到时自动回退为首字母标识。

## 给 AI / LLM 工具使用

- `/llms.txt` 与 `/llms-full.txt`（见 [llms.txt](https://llmstxt.org) 规范）为 LLM / AI 代理提供站点索引与全量数据，方便大模型直接读取。

## 技术栈

Next.js + TypeScript + Tailwind CSS + shadcn 风格组件，静态生成（SSG），前端仅内存检索，无后端请求。