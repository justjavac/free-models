"use client";

import { useSyncExternalStore } from "react";

const EVENT = "querychange";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getSnapshot(key: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

/** 读取当前 URL 查询参数（客户端），不触发服务端动态渲染。 */
export function useQueryParam(key: string): string {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(key),
    getServerSnapshot,
  );
}

/** 同步更新 URL 查询参数并通知订阅者，不离开当前页面。 */
export function setQueryParam(key: string, value: string) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", url.toString());
  window.dispatchEvent(new Event(EVENT));
}
