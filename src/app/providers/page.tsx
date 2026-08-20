import { redirect } from "next/navigation";

// 中转站列表已移至首页（/），此路由保持兼容跳转
export default function ProvidersPage() {
  redirect("/");
}
