"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas-pro";
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

  const activeRef = mode === "vertical" ? verticalRef : horizontalRef;

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!activeRef.current) return null;
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
      },
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }, [activeRef]);

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
   세로형 카드 (트레이딩 카드 스타일)
   ═══════════════════════════════════════════ */
import { forwardRef } from "react";

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

const VerticalCard = forwardRef<HTMLDivElement, CardInnerProps>(function VerticalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  return (
    <div
      ref={ref}
      data-capture-root
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        textRendering: "geometricPrecision",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* 홀로그램 테두리 효과 */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          border: "2px solid rgba(255,255,255,0.4)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(232,121,164,0.15) 25%, rgba(192,132,252,0.15) 50%, rgba(255,255,255,0.3) 75%, rgba(232,121,164,0.15) 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "2px",
          zIndex: 10,
        }}
      />

      {/* 장식 패턴 */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.06] pointer-events-none" style={{
        background: `radial-gradient(circle at 70% 30%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      {/* 히어로 섹션 */}
      {photoUrl ? (
        <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
          <img src={photoUrl} alt={dogName} className="w-full h-full object-cover" />
          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)",
          }} />
          {/* 상단 배지 */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <div className="px-2.5 py-1 rounded-full text-[10px] font-black text-white/90 tracking-wider"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              멍BTI
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              {emoji}
            </div>
          </div>
          {/* 하단 타이포 */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <p className="text-[10px] text-white/70 font-bold tracking-widest uppercase mb-0.5">
              Dog Personality Type
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[32px] font-black tracking-[0.2em] text-white leading-none drop-shadow-lg">
                  {code}
                </p>
                <p className="text-base font-bold text-white/90 leading-snug mt-0.5 drop-shadow-md">
                  {nickname}
                </p>
              </div>
              {breedName && (
                <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  {breedName}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative px-5 pt-8 pb-5 text-center">
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider"
            style={{ color: colors.accent, background: "rgba(255,255,255,0.6)" }}>
            멍BTI
          </div>
          <div className="text-7xl mb-3 drop-shadow-sm">{emoji}</div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: colors.accent, opacity: 0.7 }}>
            Dog Personality Type
          </p>
          <p className="text-[32px] font-black tracking-[0.2em] leading-none" style={{ color: colors.accent }}>
            {code}
          </p>
          <p className="text-base font-bold text-gray-800 leading-snug mt-1">{nickname}</p>
          {breedName && (
            <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ color: colors.accent, background: "rgba(255,255,255,0.6)" }}>
              🐕 {breedName}
            </span>
          )}
        </div>
      )}

      {/* 카드 바디 */}
      <div className="px-5 pt-4 pb-1">
        {/* 이름 + 한줄 요약 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: `${colors.accent}20` }}>
              {emoji}
            </div>
            <span className="text-sm font-black text-gray-800">{dogName}</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/70">
            <p className="text-[11px] text-gray-600 leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
              {summary}
            </p>
          </div>
        </div>

        {/* 축별 스탯 바 */}
        <div className="space-y-2 mb-4">
          {percentages.map((p) => {
            const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
            return (
              <div key={p.axis} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 w-10 text-right shrink-0">
                  {dominant.label}
                </span>
                <div className="flex-1 h-2.5 bg-white/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{
                      width: `${dominant.pct}%`,
                      background: `linear-gradient(90deg, ${colors.accent}, #C084FC)`,
                    }} />
                </div>
                <span className="text-[10px] font-black w-9 shrink-0" style={{ color: colors.accent }}>
                  {dominant.pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* 견주 정보 */}
        {(ownerName || ownerMbti) && (
          <div className="bg-white/50 rounded-xl px-3.5 py-2.5 mb-4 border border-white/60 flex items-center gap-2">
            <span className="text-[10px]">👤</span>
            <span className="text-[11px] font-bold text-gray-700">
              {ownerName || "견주님"}
              {ownerMbti && <span className="ml-1 font-black" style={{ color: colors.accent }}>({ownerMbti})</span>}
            </span>
            <span className="text-[10px] text-gray-300">×</span>
            <span className="text-[11px] font-bold" style={{ color: colors.accent }}>
              {dogName} <span className="font-black">({code})</span>
            </span>
          </div>
        )}
      </div>

      {/* 하단 브랜딩 */}
      <div className="px-5 pb-4">
        <div className="h-9 rounded-full bg-white/50 border border-white/60 px-4 flex items-center justify-between">
          <span className="text-[11px] font-black tracking-wider" style={{ color: colors.accent }}>
            멍BTI
          </span>
          <span className="text-[9px] text-gray-400 font-medium">강아지 성향 테스트 🐾</span>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════
   가로형 카드 (ID 카드 / 인증서 스타일)
   ═══════════════════════════════════════════ */
const HorizontalCard = forwardRef<HTMLDivElement, CardInnerProps>(function HorizontalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  return (
    <div
      ref={ref}
      data-capture-root
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        textRendering: "geometricPrecision",
        WebkitFontSmoothing: "antialiased",
        aspectRatio: "16 / 9",
      }}
    >
      {/* 홀로 테두리 */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: "2px solid rgba(255,255,255,0.4)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(232,121,164,0.15) 25%, rgba(192,132,252,0.15) 50%, rgba(255,255,255,0.3) 75%, rgba(232,121,164,0.15) 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "2px",
          zIndex: 10,
        }} />

      {/* 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.05] pointer-events-none"
        style={{ background: `radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 80%, ${colors.accent} 0%, transparent 70%)` }} />

      <div className="flex h-full">
        {/* 좌측: 사진 or 이모지 */}
        <div className="w-[38%] relative shrink-0">
          {photoUrl ? (
            <>
              <img src={photoUrl} alt={dogName} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.08) 100%)",
              }} />
              {/* 이름 오버레이 */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
                  <p className="text-[10px] font-bold text-white/90 truncate">{dogName}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: `${colors.accent}10` }}>
              <span className="text-5xl mb-1">{emoji}</span>
              <span className="text-xs font-bold text-gray-600">{dogName}</span>
            </div>
          )}
        </div>

        {/* 우측: 정보 */}
        <div className="flex-1 flex flex-col justify-between py-3 px-4 min-w-0">
          {/* 상단 */}
          <div>
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0">
                <p className="text-[8px] font-bold tracking-widest uppercase mb-0.5" style={{ color: colors.accent, opacity: 0.7 }}>
                  Dog Personality
                </p>
                <p className="text-xl font-black tracking-[0.15em] leading-none" style={{ color: colors.accent }}>
                  {code}
                </p>
              </div>
              <div className="px-2 py-0.5 rounded-full text-[8px] font-black tracking-wider shrink-0 ml-1"
                style={{ color: colors.accent, background: "rgba(255,255,255,0.5)" }}>
                멍BTI
              </div>
            </div>
            <p className="text-xs font-bold text-gray-800 truncate">{emoji} {nickname}</p>
            {breedName && (
              <span className="inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ color: colors.accent, background: `${colors.accent}15` }}>
                {breedName}
              </span>
            )}
          </div>

          {/* 축별 미니 바 */}
          <div className="space-y-1 my-1.5">
            {percentages.map((p) => {
              const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
              return (
                <div key={p.axis} className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold text-gray-500 w-7 text-right shrink-0">{dominant.label}</span>
                  <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{
                        width: `${dominant.pct}%`,
                        background: `linear-gradient(90deg, ${colors.accent}, #C084FC)`,
                      }} />
                  </div>
                  <span className="text-[8px] font-black w-7 shrink-0" style={{ color: colors.accent }}>{dominant.pct}%</span>
                </div>
              );
            })}
          </div>

          {/* 하단: 요약 + 견주 */}
          <div>
            <p className="text-[9px] text-gray-500 leading-snug mb-1 line-clamp-2">{summary}</p>
            {(ownerName || ownerMbti) && (
              <div className="flex items-center gap-1 text-[8px]">
                <span>👤</span>
                <span className="font-bold text-gray-600">
                  {ownerName || "견주님"}
                  {ownerMbti && <span className="ml-0.5 font-black" style={{ color: colors.accent }}>({ownerMbti})</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
