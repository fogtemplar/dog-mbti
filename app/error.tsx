"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 향후 Sentry 등 모니터링 서비스 연동 지점
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center" role="alert">
      <div className="text-5xl mb-4">😢</div>
      <h2 className="text-lg font-bold mb-2">앗, 문제가 생겼어요</h2>
      <p className="text-sm text-gray-500 mb-6">
        일시적인 오류가 발생했어요. 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        aria-label="페이지 다시 시도"
        className="px-6 py-3 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-sm active:scale-[0.98] transition-transform"
      >
        다시 시도하기
      </button>
    </div>
  );
}
