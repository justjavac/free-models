import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 三套 JSON 端点：长期不可变缓存，便于 curl 直取与 CDN 边缘缓存
        source: "/:file(api|models|catalog).json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
