"use client";

import { useEffect, useRef, useState } from "react";
import { IAP } from "@apps-in-toss/web-framework";
import { unlockPremium } from "@/lib/premiumStore";
import { apiUrl } from "@/lib/apiUrl";
import { authHeaders, setSessionToken } from "@/lib/authClient";

type Props = {
  resultCode: string;
  dogName: string;
  ownerMbti?: string;
  onUnlocked: () => void;
};

export default function PremiumPurchase({ resultCode, dogName, ownerMbti, onUnlocked }: Props) {
  const [sku, setSku] = useState<string | null>(null);
  const [price, setPrice] = useState("990원");
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const cleanupRef = useRef<(() => void) | null>(null);
  const purchaseTimeoutRef = useRef<number | null>(null);

  function finishPurchase() {
    if (purchaseTimeoutRef.current !== null) window.clearTimeout(purchaseTimeoutRef.current);
    purchaseTimeoutRef.current = null;
    setBuying(false);
    cleanupRef.current?.();
    cleanupRef.current = null;
  }

  async function grant(orderId: string) {
    const response = await fetch(apiUrl("/api/iap/grant"), {
      method: "POST",
      credentials: "include",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ orderId }),
    });
    if (!response.ok) return false;
    const body = await response.json();
    if (typeof body.sessionToken === "string") setSessionToken(body.sessionToken);
    unlockPremium(resultCode, dogName, ownerMbti);
    onUnlocked();
    return true;
  }

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      const config = await fetch(apiUrl("/api/iap/config"), { cache: "no-store", credentials: "include" }).then((r) => r.json());
      if (!config.sku || cancelled) return;
      setSku(config.sku);
      try {
        const catalog = await IAP.getProductItemList();
        const product = catalog?.products.find((item) => item.sku === config.sku);
        if (product) setPrice(product.displayAmount);

        const pending = await IAP.getPendingOrders();
        for (const order of pending?.orders ?? []) {
          if (order.sku === config.sku && (await grant(order.orderId))) {
            await IAP.completeProductGrant({ params: { orderId: order.orderId } });
            return;
          }
        }

        const completed = await IAP.getCompletedOrRefundedOrders();
        const owned = completed?.orders.find(
          (order) => order.sku === config.sku && order.status === "COMPLETED",
        );
        if (owned) await grant(owned.orderId);
      } catch {
        // 네이티브 SDK를 사용할 수 없는 웹 미리보기에서는 구매 버튼만 비활성 안내합니다.
      }
    }
    prepare();
    return () => {
      cancelled = true;
      if (purchaseTimeoutRef.current !== null) window.clearTimeout(purchaseTimeoutRef.current);
      cleanupRef.current?.();
    };
  }, [resultCode]);

  async function buy() {
    if (!sku) {
      setMessage("상품 ID가 연결되면 토스 앱에서 구매할 수 있어요.");
      return;
    }
    try {
      const me = await fetch(apiUrl("/api/auth/me"), { credentials: "include", headers: authHeaders(), cache: "no-store" }).then((r) => r.json());
      if (!me?.loggedIn) {
        setMessage("구매 내역을 안전하게 보관하려면 먼저 홈에서 토스 로그인을 해주세요.");
        return;
      }
    } catch {
      setMessage("로그인 상태를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setBuying(true);
    setMessage("");
    purchaseTimeoutRef.current = window.setTimeout(() => {
      finishPurchase();
      setMessage("결제 화면을 열지 못했어요. 토스 앱을 최신 버전으로 업데이트한 뒤 다시 시도해 주세요.");
    }, 15_000);
    cleanupRef.current = IAP.createOneTimePurchaseOrder({
      options: {
        sku,
        processProductGrant: async ({ orderId }) => grant(orderId),
      },
      onEvent: () => {
        finishPurchase();
      },
      onError: (error) => {
        const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
        setMessage(code === "USER_CANCELED" ? "구매를 취소했어요." : "결제를 완료하지 못했어요. 다시 시도해 주세요.");
        finishPurchase();
      },
    });
  }

  return (
    <>
      <p className="text-xs opacity-90 mb-1">{dogName}가 왜 그런 행동을 하는지 속마음을 알아봐요</p>
      <p className="mb-4 text-[11px] leading-4 opacity-80">놀이·훈련·산책 팁까지 {dogName}에게 꼭 맞게 알려드려요. 한 번 열면 언제든 다시 볼 수 있어요.</p>
      <button
        onClick={buy}
        disabled={buying}
        className="relative w-full overflow-hidden rounded-2xl border border-white/70 px-3 py-4 text-[15px] font-black tracking-[-0.01em] text-white shadow-[0_0_0_3px_rgba(255,255,255,0.18),0_10px_28px_rgba(91,33,119,0.48)] transition-all active:scale-[0.98] active:shadow-[0_0_0_2px_rgba(255,255,255,0.16),0_5px_16px_rgba(91,33,119,0.38)] disabled:opacity-50"
        style={{ background: "linear-gradient(110deg, #9D174D 0%, #DB2777 46%, #7C3AED 100%)" }}
      >
        <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(61,20,58,0.45)]">
          {buying ? "구매 확인 중..." : `${price}으로 ${dogName} 마음 더 알아보기`}
        </span>
      </button>
      {message && <p className="mt-3 text-xs text-white/90" role="status">{message}</p>}
      {!sku && <p className="mt-3 text-[10px] opacity-70">상품 SKU 연결 대기 중</p>}
    </>
  );
}
