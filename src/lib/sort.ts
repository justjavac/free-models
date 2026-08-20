// 共享排序：按发布日期倒序（最新在前），对齐 models.dev 默认行为。

import type { Model } from "@/lib/types";

export function sortByReleaseDate(list: Model[]): Model[] {
  return [...list].sort((a, b) => {
    if (a.release_date && b.release_date)
      return b.release_date.localeCompare(a.release_date);
    if (a.release_date) return -1;
    if (b.release_date) return 1;
    return a.name.localeCompare(b.name);
  });
}
