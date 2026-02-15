"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ backgroundColor: "#FFF5F9", margin: 0 }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100dvh", padding: "24px", textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>😢</div>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
            앗, 문제가 생겼어요
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            일시적인 오류가 발생했어요. 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px", background: "linear-gradient(to right, #E879A4, #C084FC)",
              color: "white", border: "none", borderRadius: "9999px",
              fontWeight: "bold", fontSize: "14px", cursor: "pointer",
            }}
          >
            다시 시도하기
          </button>
        </div>
      </body>
    </html>
  );
}
