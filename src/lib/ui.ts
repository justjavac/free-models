// 共享 UI 常量：免费额度类型 → Badge 变体。
// 抽自 relay-list / relay-detail / model-detail，避免三处重复定义。

import type { FreeQuotaType } from "@/lib/types";

export const FREE_VARIANT: Record<
  FreeQuotaType,
  "success" | "info" | "purple" | "warning"
> = {
  credit: "success",
  token: "info",
  daily_checkin: "purple",
  free_models: "warning",
  unlimited: "success",
};
