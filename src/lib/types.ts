// 中转站数据库 —— 核心类型定义
// 设计目标：与 models.dev 的 api.json / models.json / catalog.json 形状同构
// （顶层按 id 为键的对象 + 嵌套 models），并在 Relay 上扩展中转站专用字段。

export type FreeQuotaType =
  | "credit" // 赠送额度（美元等）
  | "token" // 赠送 token
  | "daily_checkin" // 每日签到送额度
  | "free_models" // 部分模型永久免费
  | "unlimited"; // 公测/研究无限免费

export type PricingModel = "no_markup" | "retail" | "markup" | "free";
export type AuthType = "api_key" | "oauth" | "none";
export type RelayStatus = "operational" | "degraded" | "down";
export type Region = "global" | "cn";

/** 免费额度信息 */
export interface FreeQuota {
  available: boolean;
  type?: FreeQuotaType;
  /** 人类可读的额度描述，如 "$2 / 月"、"200 万 token"、"每日签到 $25" */
  amount?: string;
  /** 近似美元金额，用于排序（可选） */
  amount_usd?: number;
  /** 免费额度覆盖的模型 id 列表（可选） */
  models?: string[];
  /** 有效期 / 过期说明（可选） */
  expires?: string;
  notes?: string;
}

/** 鉴权方式 */
export interface Auth {
  type: AuthType;
  /** 环境变量名，如 ["ANYROUTER_API_KEY"]（与 models.dev 的 env 同义） */
  env: string[];
  /** 注册 / 获取 key 的链接 */
  signup: string;
}

/** 中转站提供的某个模型的引用（含该站特有的成本/备注） */
export interface ModelRef {
  id: string;
  name: string;
  /** 该站此模型的每百万 token 成本（可选，覆盖全局模型价） */
  cost?: { input?: number; output?: number; cache_read?: number };
  notes?: string;
}

/** 中转站（聚合网关） */
export interface Relay {
  id: string; // "anyrouter"
  name: string; // "AnyRouter"
  url: string; // 官网
  api: string; // API base，如 https://anyrouter.dev/api/v1
  npm?: string; // 兼容 AI SDK 的包，如 "@ai-sdk/openai-compatible"
  env?: string[]; // 与 models.dev 同名字段，指向鉴权环境变量
  openai_compatible: boolean;
  auth: Auth;
  free_quota: FreeQuota;
  pricing: { model: PricingModel; notes?: string };
  features: string[]; // "load_balancing" | "failover" | "prompt_caching" ...
  providers: string[]; // "openai" | "anthropic" | "google" | "deepseek" ...
  model_count: number;
  region: Region[];
  status: RelayStatus;
  doc?: string;
  logo?: string; // /logos/<id>.svg
  updated_at: string; // ISO 日期
  models: Record<string, ModelRef>;
}

/** 模型规格（跨中转站共享） */
export interface Model {
  id: string; // "anthropic/claude-sonnet-4.6"
  name: string;
  provider: string; // "anthropic"
  description?: string;
  modalities: { input: string[]; output: string[] };
  context?: number; // 上下文窗口（token）
  max_output?: number; // 最大输出长度（token）
  /** 每百万 token 价格（USD），可选 */
  price?: { input?: number; output?: number };
  reasoning?: boolean;
  tool_call?: boolean;
  structured_output?: boolean;
  open_weights?: boolean;
  release_date?: string;
  /** 提供该模型的中转站 id 列表（由生成脚本自动计算填充） */
  available_on: string[];
}

/** api.json 输出形状 */
export type ApiJson = Record<string, Relay>;
/** models.json 输出形状 */
export type ModelsJson = Record<string, Model>;
/** catalog.json 输出形状 */
export interface CatalogJson {
  api: ApiJson;
  models: ModelsJson;
}
