"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="text-5xl mb-4">😢</div>
      <h2 className="text-lg font-bold mb-2">앗, 문제가 생겼어요</h2>
      <p className="text-sm text-gray-500 mb-6">
        일시적인 오류가 발생했어요. 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-sm active:scale-[0.98] transition-transform"
      >
        다시 시도하기
      </button>
    </div>
  );
}
