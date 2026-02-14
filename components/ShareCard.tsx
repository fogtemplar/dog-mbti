"use client";

import { useRef, useState, useCallback, useEffect, forwardRef } from "react";
import html2canvas from "html2canvas-pro";
import QRCode from "qrcode";
import SocialShare from "@/components/SocialShare";

interface ShareCardProps {
  dogName: string;
  nickname: string;
  code: string;
  emoji: string;
  summary: string;
  bgColor: string;
  photoUrl: string | null;
  percentages: {
    axis: string;
    left: { label: string; pct: number };
    right: { label: string; pct: number };
  }[];
  breedName?: string;
  ownerName?: string;
  ownerMbti?: string;
  shareUrl?: string;
}

/* ── 타입별 프리미엄 그라디언트 ── */
const premiumGradients: Record<string, { bg: string; accent: string }> = {
  "#FFF3E0": { bg: "linear-gradient(145deg, #FFF3E0 0%, #FFE0B2 40%, #FFCC80 70%, #FFB74D 100%)", accent: "#FF9800" },
  "#FFF8E1": { bg: "linear-gradient(145deg, #FFF8E1 0%, #FFECB3 40%, #FFD54F 70%, #FFCA28 100%)", accent: "#FFC107" },
  "#E8EAF6": { bg: "linear-gradient(145deg, #E8EAF6 0%, #C5CAE9 40%, #9FA8DA 70%, #7986CB 100%)", accent: "#5C6BC0" },
  "#FFFDE7": { bg: "linear-gradient(145deg, #FFFDE7 0%, #FFF9C4 40%, #FFF176 70%, #FFEE58 100%)", accent: "#FDD835" },
  "#E0F7FA": { bg: "linear-gradient(145deg, #E0F7FA 0%, #B2EBF2 40%, #80DEEA 70%, #4DD0E1 100%)", accent: "#00BCD4" },
  "#E8F5E9": { bg: "linear-gradient(145deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 70%, #81C784 100%)", accent: "#4CAF50" },
  "#F3E5F5": { bg: "linear-gradient(145deg, #F3E5F5 0%, #E1BEE7 40%, #CE93D8 70%, #BA68C8 100%)", accent: "#9C27B0" },
  "#E3F2FD": { bg: "linear-gradient(145deg, #E3F2FD 0%, #BBDEFB 40%, #90CAF9 70%, #64B5F6 100%)", accent: "#2196F3" },
  "#E0F2F1": { bg: "linear-gradient(145deg, #E0F2F1 0%, #B2DFDB 40%, #80CBC4 70%, #4DB6AC 100%)", accent: "#009688" },
  "#FCE4EC": { bg: "linear-gradient(145deg, #FCE4EC 0%, #F8BBD0 40%, #F48FB1 70%, #EC407A 100%)", accent: "#E91E63" },
  "#EDE7F6": { bg: "linear-gradient(145deg, #EDE7F6 0%, #D1C4E9 40%, #B39DDB 70%, #9575CD 100%)", accent: "#673AB7" },
  "#F1F8E9": { bg: "linear-gradient(145deg, #F1F8E9 0%, #DCEDC8 40%, #C5E1A5 70%, #AED581 100%)", accent: "#8BC34A" },
};

export default function ShareCard({
  dogName,
  nickname,
  code,
  emoji,
  summary,
  bgColor,
  photoUrl,
  percentages,
  breedName,
  ownerName,
  ownerMbti,
  shareUrl,
}: ShareCardProps) {
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [saving, setSaving] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL("https://daeng.me", {
      width: 120,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrUrl).catch(() => {});
  }, []);

  const activeRef = mode === "vertical" ? verticalRef : horizontalRef;

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!activeRef.current) return null;

    // Pre-load photo and get natural dimensions for cover simulation
    let imgNatural: { w: number; h: number } | null = null;
    if (photoUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          imgNatural = { w: img.naturalWidth, h: img.naturalHeight };
          resolve();
        };
        img.onerror = () => resolve();
        img.src = photoUrl;
        if (img.complete && img.naturalWidth > 0) {
          imgNatural = { w: img.naturalWidth, h: img.naturalHeight };
          resolve();
        }
      });
    }

    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch { /* ignore */ }
    }
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    const scale = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 2)));
    const rect = activeRef.current.getBoundingClientRect();
    const computed = window.getComputedStyle(activeRef.current);
    const fixedWidth = Math.round(rect.width);
    const fixedHeight = Math.round(rect.height);
    const canvas = await html2canvas(activeRef.current, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      onclone: (doc) => {
        const root = doc.querySelector("[data-capture-root]") as HTMLElement | null;
        if (root) {
          root.style.fontFamily = "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
          root.style.textRendering = "geometricPrecision";
          (root.style as unknown as Record<string, string>)["-webkit-font-smoothing"] = "antialiased";
          root.style.width = `${fixedWidth}px`;
          root.style.height = `${fixedHeight}px`;
          root.style.boxSizing = "border-box";
          root.style.overflow = "hidden";
          root.style.borderRadius = computed.borderRadius;
          root.style.transform = "none";
        }
        doc.body.style.margin = "0";
        doc.querySelectorAll("*").forEach((el) => {
          const node = el as HTMLElement;
          node.style.animation = "none";
          node.style.transition = "none";
          node.style.boxSizing = "border-box";
        });

        // Fix photo: replace CSS backgroundImage with <img> using explicit cover dimensions
        // html2canvas often fails to render background-size:cover correctly → gray blocks
        if (imgNatural && photoUrl) {
          const containers = doc.querySelectorAll("[data-photo-container]");
          containers.forEach((el) => {
            const container = el as HTMLElement;
            const cw = container.offsetWidth;
            const ch = container.offsetHeight;
            if (cw === 0 || ch === 0) return;

            // Remove backgroundImage (source of gray blocks)
            container.style.backgroundImage = "none";

            // Calculate cover dimensions
            const containerRatio = cw / ch;
            const imgRatio = imgNatural!.w / imgNatural!.h;
            let drawW: number, drawH: number;
            if (imgRatio > containerRatio) {
              drawH = ch;
              drawW = Math.ceil(ch * imgRatio);
            } else {
              drawW = cw;
              drawH = Math.ceil(cw / imgRatio);
            }

            // Insert <img> with explicit pixel dimensions (html2canvas handles this reliably)
            const img = doc.createElement("img");
            img.src = photoUrl;
            img.style.position = "absolute";
            img.style.top = "50%";
            img.style.left = "50%";
            img.style.transform = "translate(-50%, -50%)";
            img.style.width = `${drawW}px`;
            img.style.height = `${drawH}px`;
            img.style.display = "block";
            container.insertBefore(img, container.firstChild);
          });
        }
      },
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }, [activeRef, photoUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const blob = await captureCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `멍BTI_${dogName}_${mode === "vertical" ? "세로" : "가로"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      alert("링크가 복사되었어요!");
    } catch {
      alert("링크 복사에 실패했어요. 주소창에서 직접 복사해 주세요.");
    }
  };

  const colors = premiumGradients[bgColor] || { bg: `linear-gradient(145deg, ${bgColor}, ${bgColor})`, accent: "#E879A4" };

  return (
    <div>
      {/* ── 모드 토글 ── */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setMode("vertical")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mode === "vertical"
              ? "bg-[#E879A4] text-white shadow-md"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          📱 세로형
        </button>
        <button
          onClick={() => setMode("horizontal")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mode === "horizontal"
              ? "bg-[#E879A4] text-white shadow-md"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          🖼️ 가로형
        </button>
      </div>

      {/* ── 세로형 카드 ── */}
      <div style={{ display: mode === "vertical" ? "block" : "none" }}>
        <VerticalCard
          ref={verticalRef}
          dogName={dogName}
          nickname={nickname}
          code={code}
          emoji={emoji}
          summary={summary}
          photoUrl={photoUrl}
          percentages={percentages}
          breedName={breedName}
          ownerName={ownerName}
          ownerMbti={ownerMbti}
          colors={colors}
          qrUrl={qrUrl}
        />
      </div>

      {/* ── 가로형 카드 ── */}
      <div style={{ display: mode === "horizontal" ? "block" : "none" }}>
        <HorizontalCard
          ref={horizontalRef}
          dogName={dogName}
          nickname={nickname}
          code={code}
          emoji={emoji}
          summary={summary}
          photoUrl={photoUrl}
          percentages={percentages}
          breedName={breedName}
          ownerName={ownerName}
          ownerMbti={ownerMbti}
          colors={colors}
          qrUrl={qrUrl}
        />
      </div>

      {/* ── 액션 버튼 ── */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3.5 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all disabled:opacity-50"
          style={{ boxShadow: "0 4px 14px rgba(232,121,164,0.3)" }}
        >
          {saving ? "저장 중..." : "📥 카드 저장"}
        </button>
        <button
          onClick={() => setShowSharePanel((v) => !v)}
          className="flex-1 py-3.5 bg-white border-2 border-[#E879A4] text-[#E879A4] rounded-2xl text-sm font-bold hover:bg-[#E879A4]/5 active:scale-[0.98] transition-all"
        >
          {showSharePanel ? "✕ 닫기" : "📤 공유하기"}
        </button>
      </div>

      {showSharePanel && (
        <div className="animate-slide-up">
          <SocialShare
            url={shareUrl || window.location.href}
            title={`${dogName}는 ${nickname} 타입! 🐾`}
            description={`${dogName}의 멍BTI 결과: ${code} (${nickname}) - 우리 강아지 성향 테스트`}
            dogName={dogName}
            captureCard={captureCard}
          />
          <button
            onClick={handleCopyLink}
            className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            🔗 링크 복사
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   카드 내부 Props
   ═══════════════════════════════════════════ */
interface CardInnerProps {
  dogName: string;
  nickname: string;
  code: string;
  emoji: string;
  summary: string;
  photoUrl: string | null;
  percentages: ShareCardProps["percentages"];
  breedName?: string;
  ownerName?: string;
  ownerMbti?: string;
  colors: { bg: string; accent: string };
  qrUrl?: string;
}

/* ── 스탯 바 (공통) ── */
function StatBar({ label, pct, accent, barHeight = 10, fontSize = 10, labelWidth = 40, pctWidth = 36 }: {
  label: string; pct: number; accent: string;
  barHeight?: number; fontSize?: number; labelWidth?: number; pctWidth?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{
        fontSize: `${fontSize}px`, fontWeight: 700, color: "#6b7280",
        width: `${labelWidth}px`, textAlign: "right" as const, flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{
        flex: 1, height: `${barHeight}px`, borderRadius: "999px",
        overflow: "hidden", background: "rgba(255,255,255,0.4)",
      }}>
        <div style={{
          height: "100%", borderRadius: "999px",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${accent}, #C084FC)`,
        }} />
      </div>
      <span style={{
        fontSize: `${fontSize}px`, fontWeight: 900,
        width: `${pctWidth}px`, flexShrink: 0, color: accent,
      }}>
        {pct}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   세로형 카드 (트레이딩 카드 스타일)
   - html2canvas 호환: aspect-ratio 대신 paddingBottom 사용
   - line-clamp/truncate 사용 안 함
   ═══════════════════════════════════════════ */
const VerticalCard = forwardRef<HTMLDivElement, CardInnerProps>(function VerticalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors, qrUrl },
  ref,
) {
  return (
    <div
      ref={ref}
      data-capture-root
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      {/* 장식 */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
        opacity: 0.06, pointerEvents: "none" as const,
        background: `radial-gradient(circle at 70% 30%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      {/* 히어로 섹션 */}
      {photoUrl ? (
        <div data-photo-container style={{
          position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden",
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          {/* 그라디언트 오버레이 */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)",
          }} />
          {/* 상단 좌 배지 */}
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            padding: "4px 10px", borderRadius: "999px",
            fontSize: "10px", fontWeight: 900, color: "#fff",
            letterSpacing: "0.05em", background: "rgba(0,0,0,0.35)",
          }}>
            멍BTI
          </div>
          {/* 상단 우 이모지 */}
          <div style={{
            position: "absolute", top: "12px", right: "12px",
            width: "32px", height: "32px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", background: "rgba(0,0,0,0.35)",
          }}>
            {emoji}
          </div>
          {/* 하단 타이포 */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 16px" }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "4px",
            }}>
              Dog Personality Type
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontSize: "32px", fontWeight: 900, letterSpacing: "0.2em",
                  color: "#fff", lineHeight: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}>
                  {code}
                </div>
                <div style={{
                  fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.9)",
                  marginTop: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}>
                  {nickname}
                </div>
              </div>
              {breedName && (
                <span style={{
                  fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                  color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.15)",
                }}>
                  {breedName}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "32px 20px 20px", textAlign: "center" as const, position: "relative" }}>
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            padding: "4px 10px", borderRadius: "999px",
            fontSize: "10px", fontWeight: 900, color: colors.accent,
            background: "rgba(255,255,255,0.6)", letterSpacing: "0.05em",
          }}>
            멍BTI
          </div>
          <div style={{ fontSize: "72px", marginBottom: "12px" }}>{emoji}</div>
          <div style={{
            fontSize: "10px", fontWeight: 700, color: colors.accent,
            opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "4px",
          }}>
            Dog Personality Type
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "0.2em", lineHeight: 1, color: colors.accent }}>
            {code}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginTop: "4px" }}>
            {nickname}
          </div>
          {breedName && (
            <span style={{
              display: "inline-block", marginTop: "8px",
              fontSize: "10px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px",
              color: colors.accent, background: "rgba(255,255,255,0.6)",
            }}>
              {breedName}
            </span>
          )}
        </div>
      )}

      {/* 카드 바디 */}
      <div style={{ padding: "16px 20px 4px" }}>
        {/* 이름 + 한줄 요약 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", background: `${colors.accent}20`,
            }}>
              {emoji}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 900, color: "#1f2937" }}>{dogName}</span>
          </div>
          <div style={{
            borderRadius: "12px", padding: "12px 16px",
            background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
          }}>
            <p style={{ fontSize: "11px", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
              {summary}
            </p>
          </div>
        </div>

        {/* 축별 스탯 바 */}
        <div style={{ marginBottom: "16px" }}>
          {percentages.map((p, i) => {
            const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
            return (
              <div key={p.axis} style={{ marginBottom: i < percentages.length - 1 ? "8px" : "0" }}>
                <StatBar label={dominant.label} pct={dominant.pct} accent={colors.accent} />
              </div>
            );
          })}
        </div>

        {/* 견주 정보 */}
        {(ownerName || ownerMbti) && (
          <div style={{
            borderRadius: "12px", padding: "10px 14px", marginBottom: "16px",
            background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" as const,
          }}>
            <span style={{ fontSize: "10px" }}>👤</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151" }}>
              {ownerName || "견주님"}
              {ownerMbti && <span style={{ marginLeft: "4px", fontWeight: 900, color: colors.accent }}>({ownerMbti})</span>}
            </span>
            <span style={{ fontSize: "10px", color: "#d1d5db" }}>×</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: colors.accent }}>
              {dogName} <span style={{ fontWeight: 900 }}>({code})</span>
            </span>
          </div>
        )}
      </div>

      {/* 하단 브랜딩 */}
      <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          flex: 1, height: "40px", borderRadius: "999px", padding: "0 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.6)",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.05em", color: colors.accent }}>
            멍BTI
          </span>
          <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>강아지 성향 테스트 🐾</span>
        </div>
        {qrUrl && (
          <div style={{
            width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden",
            flexShrink: 0, border: "1px solid rgba(255,255,255,0.6)",
            backgroundImage: `url(${qrUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        )}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════
   가로형 카드 (ID 카드 스타일)
   - html2canvas 호환: aspect-ratio 사용 안 함
   - 텍스트 잘림 없음 (truncate/line-clamp 없음)
   - 콘텐츠 기반 높이 (사진은 flex stretch)
   ═══════════════════════════════════════════ */
const HorizontalCard = forwardRef<HTMLDivElement, CardInnerProps>(function HorizontalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors, qrUrl },
  ref,
) {
  return (
    <div
      ref={ref}
      data-capture-root
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      {/* 장식 */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "140px", height: "140px",
        opacity: 0.05, pointerEvents: "none" as const,
        background: `radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      <div style={{ display: "flex" }}>
        {/* 좌측: 사진 */}
        <div data-photo-container style={{
          width: "38%", position: "relative", flexShrink: 0, minHeight: "240px",
          overflow: "hidden",
          ...(photoUrl ? {
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : {}),
        }}>
          {photoUrl ? (
            <>
              {/* 하단 그라디언트 */}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: "60px",
                background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
              }} />
              {/* 이름 오버레이 */}
              <div style={{
                position: "absolute", bottom: "8px", left: "8px", right: "8px",
                padding: "5px 8px", borderRadius: "8px",
                background: "rgba(0,0,0,0.45)",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{dogName}</div>
                {breedName && (
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>{breedName}</div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
              background: `${colors.accent}10`,
            }}>
              <span style={{ fontSize: "48px", marginBottom: "4px" }}>{emoji}</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#4b5563" }}>{dogName}</span>
              {breedName && (
                <span style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>{breedName}</span>
              )}
            </div>
          )}
        </div>

        {/* 우측: 정보 */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
          padding: "14px 16px", minWidth: 0,
        }}>
          {/* 상단: 코드 + 닉네임 */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2px" }}>
              <div>
                <div style={{
                  fontSize: "9px", fontWeight: 700, color: colors.accent,
                  opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "2px",
                }}>
                  Dog Personality
                </div>
                <div style={{
                  fontSize: "22px", fontWeight: 900, letterSpacing: "0.15em",
                  lineHeight: 1, color: colors.accent,
                }}>
                  {code}
                </div>
              </div>
              <div style={{
                padding: "3px 8px", borderRadius: "999px",
                fontSize: "9px", fontWeight: 900, letterSpacing: "0.05em",
                color: colors.accent, background: "rgba(255,255,255,0.5)", flexShrink: 0,
              }}>
                멍BTI
              </div>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1f2937" }}>
              {emoji} {nickname}
            </div>
          </div>

          {/* 중단: 스탯 바 */}
          <div style={{ margin: "10px 0" }}>
            {percentages.map((p, i) => {
              const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
              return (
                <div key={p.axis} style={{ marginBottom: i < percentages.length - 1 ? "5px" : "0" }}>
                  <StatBar
                    label={dominant.label}
                    pct={dominant.pct}
                    accent={colors.accent}
                    barHeight={7}
                    fontSize={10}
                    labelWidth={40}
                    pctWidth={32}
                  />
                </div>
              );
            })}
          </div>

          {/* 하단: 요약 + 견주 + 브랜딩 */}
          <div>
            <div style={{
              fontSize: "10px", color: "#6b7280", lineHeight: 1.5, marginBottom: "8px",
            }}>
              {summary}
            </div>
            {(ownerName || ownerMbti) && (
              <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "9px", marginBottom: "8px", flexWrap: "wrap" as const,
              }}>
                <span>👤</span>
                <span style={{ fontWeight: 700, color: "#4b5563" }}>
                  {ownerName || "견주님"}
                  {ownerMbti && <span style={{ marginLeft: "2px", fontWeight: 900, color: colors.accent }}>({ownerMbti})</span>}
                </span>
                <span style={{ color: "#d1d5db" }}>×</span>
                <span style={{ fontWeight: 700, color: colors.accent }}>
                  {dogName} ({code})
                </span>
              </div>
            )}
            {/* 하단 브랜딩 */}
            <div style={{
              paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.05em", color: colors.accent }}>
                멍BTI
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "8px", color: "#9ca3af", fontWeight: 500 }}>daeng.me</span>
                {qrUrl && (
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "4px", overflow: "hidden",
                    flexShrink: 0,
                    backgroundImage: `url(${qrUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
