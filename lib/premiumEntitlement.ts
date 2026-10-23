"use client";

import { IAP } from "@apps-in-toss/web-framework";
import { apiUrl } from "@/lib/apiUrl";
import { authHeaders, setSessionToken } from "@/lib/authClient";
import { clearPremiumCache, unlockPremium } from "@/lib/premiumStore";

async function updateSession(path: string, orderId?: string) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(orderId ? { orderId } : {}),
  });
  if (!response.ok) return false;
  const body = await response.json();
  if (typeof body.sessionToken === "string") setSessionToken(body.sessionToken);
  return true;
}

export async function readServerPremium(): Promise<boolean> {
  const response = await fetch(apiUrl("/api/auth/me"), {
    credentials: "include",
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const body = await response.json();
  return body?.loggedIn === true && body?.premium === true;
}

export async function syncPremiumEntitlement(resultCode: string, dogName: string, ownerMbti?: string) {
  const serverPremium = await readServerPremium();
  try {
    const config = await fetch(apiUrl("/api/iap/config"), { cache: "no-store" }).then((r) => r.json());
    if (!config?.sku) return serverPremium;

    const matching: Array<{ orderId: string; status: "COMPLETED" | "REFUNDED"; date: string }> = [];
    let key: string | null | undefined;
    do {
      const page = await IAP.getCompletedOrRefundedOrders(key ? { key } : undefined);
      matching.push(...page.orders.filter((order) => order.sku === config.sku));
      key = page.hasNext ? page.nextKey : null;
    } while (key);

    const latest = matching.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
    if (!latest) return serverPremium;
    if (latest.status === "REFUNDED") {
      await updateSession("/api/iap/revoke");
      clearPremiumCache();
      return false;
    }
    if (await updateSession("/api/iap/grant", latest.orderId)) {
      unlockPremium(resultCode, dogName, ownerMbti);
      return true;
    }
  } catch {
    // 일반 브라우저 미리보기에서는 네이티브 주문 내역을 조회할 수 없습니다.
  }
  return serverPremium;
}
