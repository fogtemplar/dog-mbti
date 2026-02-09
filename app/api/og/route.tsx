import { ImageResponse } from "next/og";
import { decodeSharePayload } from "@/lib/share";
import { resultData } from "@/data/results";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("d");
  const payload = decodeSharePayload(raw);
  const result = payload ? resultData[payload.t] : null;

  const dogName = payload?.d || "강아지";
  const code = result?.code || "----";
  const nickname = result?.nickname || "멍BTI 결과";
  const emoji = result?.emoji || "🐾";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #FFE8F1 0%, #F3E8FF 60%, #E0F2FF 100%)",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#8B5CF6" }}>멍BTI 결과</div>
            <div style={{ fontSize: "44px", fontWeight: 800, color: "#111827" }}>
              {dogName}의 성향은
            </div>
            <div style={{ fontSize: "36px", fontWeight: 700, color: "#E879A4" }}>
              {nickname}
            </div>
          </div>
          <div style={{ fontSize: "88px" }}>{emoji}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(232,121,164,0.15)",
              color: "#E879A4",
              fontWeight: 800,
              letterSpacing: "0.25em",
              fontSize: "28px",
            }}
          >
            {code}
          </div>
          <div style={{ fontSize: "20px", color: "#6B7280" }}>강아지 성향 테스트</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
