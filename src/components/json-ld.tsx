// 服务端组件：注入 JSON-LD 结构化数据（搜索引擎 / AI 解析用）
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
