// JSON-LD 结构化数据构建器（schema.org）
// 用于提升搜索引擎与 AI 引擎（GEO）对站点数据的理解。
// 站点已有：首页 WebSite+ItemList、/models ItemList、详情页 BreadcrumbList。
// 这里补充最能代表「数据目录」本体的 Dataset，以及每个中转站的 Organization 实体。

import type { CatalogJson, Relay } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

/**
 * 全站 Dataset：描述整个免费额度目录数据集，
 * 并把机器可读端点（api.json / models.json / catalog.json / llms*.txt）作为 distribution 暴露。
 * 在 layout 中全站注入，对 AI 引擎识别「这是一个结构化 LLM 数据集」最有价值。
 */
export function datasetLd(catalog: CatalogJson) {
  const relayCount = Object.keys(catalog.api).length;
  const modelCount = Object.keys(catalog.models).length;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Relay Free-Quota DB",
    alternateName: "中转站免费额度库",
    description:
      "收录提供免费额度的 LLM 中转站 / 聚合网关的开放数据集：免费额度、鉴权、计费与模型规格，数据以 JSON 开放可被 AI 工具直接取用。",
    url: SITE_URL,
    sameAs: "https://github.com/justjavac/free-models",
    keywords: ["LLM", "中转站", "免费额度", "API gateway", "relay", "openai-compatible", "free tier"],
    creator: { "@type": "Organization", name: "Relay Free-Quota DB" },
    variableMeasured: [
      { "@type": "PropertyValue", name: "relayCount", value: relayCount },
      { "@type": "PropertyValue", name: "modelCount", value: modelCount },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/api.json`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/models.json`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/catalog.json`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl: `${SITE_URL}/llms.txt`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl: `${SITE_URL}/llms-full.txt`,
      },
    ],
  };
}

/**
 * 单个中转站的 Organization 实体（详情页注入），
 * 让搜索引擎 / AI 把「某中转站」当作一个可识别组织，并带出免费额度与注册入口。
 */
export function relayOrgLd(relay: Relay) {
  const fq = relay.free_quota;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: relay.name,
    url: relay.url,
    mainEntityOfPage: `${SITE_URL}/relay/${relay.id}`,
    description:
      fq.available && fq.amount
        ? `${relay.name} 提供免费额度：${fq.amount}`
        : `${relay.name} 的免费额度、支持模型与注册方式。`,
    sameAs: [relay.url, relay.doc].filter(Boolean) as string[],
  };
}
