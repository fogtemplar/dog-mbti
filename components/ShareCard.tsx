"use client";

import { useRef, useState, useCallback, forwardRef } from "react";
import { toBlob } from "html-to-image";
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
}

/** 한국어 받침 여부 → "우리 콩이의 성격은?" vs "우리 초코의 성격은?" */
function nameWithUi(name: string): string {
  if (!name) return "의";
  const last = name.charCodeAt(name.length - 1);
  if (last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28 !== 0) {
    return `${name}이의`;
  }
  return `${name}의`;
}

/** 견주 MBTI + 강아지 성향 코드 → 관계 한줄 요약 */
function getRelationshipLine(ownerMbti: string, dogCode: string): string {
  if (!ownerMbti || ownerMbti.length !== 4 || !dogCode || dogCode.length !== 4) {
    return "함께하는 모든 순간이 특별한 사이";
  }
  const oE = ownerMbti[0] === "E";
  const dS = dogCode[0] === "S";
  const dH = dogCode[1] === "H";
  if (oE && dS && dH) return "함께라면 어디든 신나는 에너지 폭발 소울메이트";
  if (oE && dS && !dH) return "서로의 사교성이 빛나는 여유로운 베스트 파트너";
  if (oE && !dS && dH) return "밝은 보호자와 독립적인 아이의 활기찬 밸런스";
  if (oE && !dS && !dH) return "보호자의 에너지가 차분한 아이에게 활력을 주는 관계";
  if (!oE && dS && dH) return "사교적인 아이 덕분에 세상이 더 넓어지는 관계";
  if (!oE && dS && !dH) return "서로의 페이스를 존중하며 함께하는 따뜻한 관계";
  if (!oE && !dS && dH) return "조용한 보호자와 활발한 아이의 의외의 케미";
  return "조용히 곁에 있는 것만으로 충분한 힐링 파트너";
}

/** 밝은 accent 색상을 텍스트용으로 어둡게 조정 (배경과 충분한 대비 확보) */
function readableAccent(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (brightness <= 0.4) return hex;
  const factor = 0.4 / brightness;
  const d = (c: number) => Math.round(c * factor).toString(16).padStart(2, "0");
  return `#${d(r)}${d(g)}${d(b)}`;
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
}: ShareCardProps) {
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [saving, setSaving] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const activeRef = mode === "vertical" ? verticalRef : horizontalRef;

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!activeRef.current) return null;

    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch { /* ignore */ }
    }
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const scale = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 2)));

    const blob = await toBlob(activeRef.current, {
      pixelRatio: scale,
      cacheBust: true,
    });
    return blob;
  }, [activeRef]);

  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const handleDownload = async () => {
    setSaving(true);
    setShowSaveMenu(false);
    try {
      const blob = await captureCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `너는내운멍_${dogName}_${mode === "vertical" ? "세로" : "가로"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyImage = async () => {
    setSaving(true);
    setShowSaveMenu(false);
    try {
      const blob = await captureCard();
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      alert("카드 이미지가 클립보드에 복사되었어요!");
    } catch {
      alert("이미지 복사에 실패했어요. 저장을 이용해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://www.daeng.me");
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

        />
      </div>

      {/* ── 가로형 카드 ── */}
      <div style={{ display: mode === "horizontal" ? "block" : "none", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
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

        />
      </div>

      {/* ── 액션 버튼 ── */}
      <div className="mt-4 flex gap-2 relative">
        <div className="flex-1 relative">
          <button
            onClick={() => setShowSaveMenu((v) => !v)}
            disabled={saving}
            className="w-full py-3.5 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px rgba(232,121,164,0.3)" }}
          >
            {saving ? "처리 중..." : "📥 카드 저장"}
          </button>
          {showSaveMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <button
                onClick={handleCopyImage}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 transition-colors text-left"
              >
                📋 이미지 복사
              </button>
              <div className="h-px bg-gray-100" />
              <button
                onClick={handleDownload}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 transition-colors text-left"
              >
                💾 이미지 저장
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => { setShowSharePanel((v) => !v); setShowSaveMenu(false); }}
          className="flex-1 py-3.5 bg-white border-2 border-[#E879A4] text-[#E879A4] rounded-2xl text-sm font-bold hover:bg-[#E879A4]/5 active:scale-[0.98] transition-all"
        >
          {showSharePanel ? "✕ 닫기" : "📤 공유하기"}
        </button>
      </div>

      {showSharePanel && (
        <div className="animate-slide-up">
          <SocialShare
            url="https://www.daeng.me"
            title={`우리 ${dogName}는 ${nickname}! 🐾 너네 강아지도 테스트 해봐!`}
            description={`강아지 성향 테스트 너는내운멍에서 확인해봐!`}
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
}

/* ── 스탯 바 (공통) ── */
function StatBar({ label, pct, accent, barHeight = 10, fontSize = 10, labelWidth = 40, pctWidth = 36 }: {
  label: string; pct: number; accent: string;
  barHeight?: number; fontSize?: number; labelWidth?: number; pctWidth?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{
        fontSize: `${fontSize}px`, fontWeight: 700, color: "#4b5563",
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
        width: `${pctWidth}px`, flexShrink: 0, color: readableAccent(accent),
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
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  const textAccent = readableAccent(colors.accent);
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
          {/* 하단 타이포 */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 16px" }}>
            <div style={{
              fontSize: "16px", fontWeight: 700, color: "#fff",
              marginBottom: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}>
              우리 {nameWithUi(dogName)} 성격은?
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
                  {nickname} {emoji}
                </div>
              </div>
              {breedName && (
                <div style={{
                  padding: "4px 10px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: 900, color: "#fff",
                  background: "rgba(0,0,0,0.35)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}>
                  {breedName}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "32px 20px 20px", textAlign: "center" as const, position: "relative" }}>
          {/* 너는내운멍 뱃지 (사진 없을 때만) */}
          <div style={{
            position: "absolute", top: "12px", left: "16px",
            padding: "4px 10px", borderRadius: "999px",
            fontSize: "10px", fontWeight: 900, color: textAccent,
            background: "rgba(255,255,255,0.6)",
          }}>
            너는내운멍
          </div>
          <div style={{
            fontSize: "16px", fontWeight: 700, color: textAccent,
            marginBottom: "4px",
          }}>
            우리 {nameWithUi(dogName)} 성격은?
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "0.2em", lineHeight: 1, color: textAccent }}>
            {code}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginTop: "4px" }}>
            {nickname} {emoji}
          </div>
          {breedName && (
            <div style={{
              display: "inline-block", marginTop: "10px",
              padding: "4px 12px", borderRadius: "999px",
              fontSize: "11px", fontWeight: 900, color: textAccent,
              background: "rgba(255,255,255,0.6)",
            }}>
              {breedName}
            </div>
          )}
        </div>
      )}

      {/* 카드 바디 */}
      <div style={{ padding: "16px 20px 0" }}>
        {/* 축별 스탯 바 */}
        <div style={{ marginBottom: "14px" }}>
          {percentages.map((p, i) => {
            const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
            return (
              <div key={p.axis} style={{ marginBottom: i < percentages.length - 1 ? "8px" : "0" }}>
                <StatBar label={dominant.label} pct={dominant.pct} accent={colors.accent} />
              </div>
            );
          })}
        </div>

        {/* 한줄 요약 */}
        <div style={{
          borderRadius: "12px", padding: "12px 16px", marginBottom: "14px",
          background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
        }}>
          <p style={{ fontSize: "11px", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
            {summary}
          </p>
        </div>

        {/* 관계 박스 */}
        <div style={{
          borderRadius: "12px", padding: "12px 16px", marginBottom: "14px",
          background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
          textAlign: "center" as const,
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
            {ownerName && (
              <>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#4b5563" }}>
                  👤 {ownerName}{ownerMbti ? ` (${ownerMbti})` : ""}
                </span>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>×</span>
              </>
            )}
            <span style={{ fontSize: "12px", fontWeight: 800, color: textAccent }}>
              🐾 {dogName} ({code})
            </span>
          </div>
          {ownerName && ownerMbti && (
            <p style={{
              fontSize: "10px", color: "#6b7280", margin: "6px 0 0",
              fontWeight: 600, fontStyle: "italic" as const,
            }}>
              &ldquo;{getRelationshipLine(ownerMbti, code)}&rdquo;
            </p>
          )}
        </div>

      </div>

      {/* 하단 브랜딩 */}
      <div style={{
        padding: "10px 20px 16px",
        textAlign: "center" as const,
      }}>
        <span style={{
          fontSize: "15px", fontWeight: 900, letterSpacing: "0.08em",
          color: "#fff",
          textShadow: `1px 1px 0 ${colors.accent}40, -1px -1px 0 ${colors.accent}40, 1px -1px 0 ${colors.accent}40, -1px 1px 0 ${colors.accent}40, 0 1px 0 ${colors.accent}40, 0 -1px 0 ${colors.accent}40, 1px 0 0 ${colors.accent}40, -1px 0 0 ${colors.accent}40`,
        }}>
          Daeng.me
        </span>
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
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  const textAccent = readableAccent(colors.accent);
  return (
    <div
      ref={ref}
      data-capture-root
      style={{
        width: "100%",
        maxWidth: "600px",
        minWidth: "340px",
        flexShrink: 0,
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      {/* 장식 */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "140px", height: "140px",
        opacity: 0.06, pointerEvents: "none" as const,
        background: `radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      <div style={{ display: "flex" }}>
        {/* 좌측: 사진 */}
        <div data-photo-container style={{
          width: "35%", position: "relative", flexShrink: 0, minHeight: "180px",
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
            </>
          ) : (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
              background: `${colors.accent}10`,
            }}>
              <span style={{ fontSize: "48px", marginBottom: "4px" }}>{emoji}</span>
              <span style={{
                fontSize: "9px", fontWeight: 900, color: textAccent,
                background: "rgba(255,255,255,0.6)",
                padding: "3px 8px", borderRadius: "999px",
                marginTop: "4px",
              }}>
                너는내운멍
              </span>
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
                  fontSize: "12px", fontWeight: 700, color: textAccent,
                  marginBottom: "2px",
                }}>
                  우리 {nameWithUi(dogName)} 성격은?
                </div>
                <div style={{
                  fontSize: "22px", fontWeight: 900, letterSpacing: "0.15em",
                  lineHeight: 1, color: textAccent,
                }}>
                  {code}
                </div>
              </div>
              {breedName && (
                <div style={{
                  padding: "3px 8px", borderRadius: "999px",
                  fontSize: "9px", fontWeight: 900,
                  color: textAccent, background: "rgba(255,255,255,0.5)", flexShrink: 0,
                }}>
                  {breedName}
                </div>
              )}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1f2937" }}>
              {nickname} {emoji}
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
              borderRadius: "10px", padding: "8px 12px", marginBottom: "8px",
              background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
            }}>
              <p style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                {summary}
              </p>
            </div>
            {/* 관계 박스 */}
            <div style={{
              borderRadius: "10px", padding: "8px 10px", marginBottom: "8px",
              background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
              textAlign: "center" as const,
            }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap" as const }}>
                {ownerName && (
                  <>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#4b5563" }}>
                      👤 {ownerName}{ownerMbti ? ` (${ownerMbti})` : ""}
                    </span>
                    <span style={{ fontSize: "9px", color: "#9ca3af" }}>×</span>
                  </>
                )}
                <span style={{ fontSize: "10px", fontWeight: 800, color: textAccent }}>
                  🐾 {dogName} ({code})
                </span>
              </div>
              {ownerName && ownerMbti && (
                <p style={{
                  fontSize: "9px", color: "#6b7280", margin: "4px 0 0",
                  fontWeight: 600, fontStyle: "italic" as const,
                }}>
                  &ldquo;{getRelationshipLine(ownerMbti, code)}&rdquo;
                </p>
              )}
            </div>
            {/* 하단 브랜딩 */}
            <div style={{
              textAlign: "center" as const,
            }}>
              <span style={{
                fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em",
                color: "#fff",
                textShadow: `1px 1px 0 ${colors.accent}40, -1px -1px 0 ${colors.accent}40, 1px -1px 0 ${colors.accent}40, -1px 1px 0 ${colors.accent}40, 0 1px 0 ${colors.accent}40, 0 -1px 0 ${colors.accent}40, 1px 0 0 ${colors.accent}40, -1px 0 0 ${colors.accent}40`,
              }}>
                Daeng.me
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
