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

const gradients: Record<string, string> = {
  "#FFF3E0": "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)",
  "#FFF8E1": "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFD54F 100%)",
  "#E8EAF6": "linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 50%, #9FA8DA 100%)",
  "#FFFDE7": "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 50%, #FFF176 100%)",
  "#E0F7FA": "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)",
  "#E8F5E9": "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)",
  "#F3E5F5": "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)",
  "#E3F2FD": "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
  "#E0F2F1": "linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 50%, #80CBC4 100%)",
  "#FCE4EC": "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 50%, #F48FB1 100%)",
  "#EDE7F6": "linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 50%, #B39DDB 100%)",
  "#F1F8E9": "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 50%, #C5E1A5 100%)",
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const blob = await captureCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dogName}_멍BTI_${code}.png`;
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

  const bg = gradients[bgColor] || `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`;

  return (
    <div>
      {/* === 캡처 대상 카드 === */}
      <div
        ref={cardRef}
        className="rounded-3xl overflow-hidden"
        style={{ background: bg, boxShadow: "0 8px 32px rgba(232,121,164,0.15)" }}
      >
        {/* 히어로 이미지 / 이모지 영역 */}
        {photoUrl ? (
          <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
            <img
              src={photoUrl}
              alt={dogName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[11px] text-white/80 font-medium">{dogName}의 성향 타입</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[28px] font-black tracking-[0.15em] text-white leading-tight drop-shadow-md">
                    {code}
                  </p>
                  <p className="text-[15px] font-bold text-white/90 truncate drop-shadow-sm">{nickname}</p>
                </div>
                <span className="text-3xl drop-shadow-md">{emoji}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative px-6 pt-8 pb-4 text-center">
            <div className="absolute top-3 right-5 text-4xl opacity-[0.12]">🐾</div>
            <div className="text-7xl mb-3">{emoji}</div>
            <p className="text-[11px] text-gray-500 font-medium">{dogName}의 성향 타입</p>
            <p className="text-[28px] font-black tracking-[0.15em] text-[#E879A4] leading-tight">
              {code}
            </p>
            <p className="text-[15px] font-bold text-gray-800">{nickname}</p>
          </div>
        )}

        {/* 카드 콘텐츠 */}
        <div className="px-5 pt-4 pb-0">
          {/* 한줄 요약 */}
          <div className="bg-white/50 rounded-xl px-3 py-2.5 mb-4">
            <p className="text-[11px] text-gray-700 leading-relaxed">{summary}</p>
          </div>

          {/* 축별 바 */}
          <div className="space-y-2 mb-4">
            {percentages.map((p) => {
              const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
              return (
                <div key={p.axis} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 w-10 text-right">
                    {dominant.label}
                  </span>
                  <div className="flex-1 h-3 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${dominant.pct}%`,
                        background: "linear-gradient(90deg, #E879A4, #C084FC)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#E879A4] w-9">
                    {dominant.pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* 견주 + 태그 */}
          {(ownerName || ownerMbti || breedName) && (
            <div className="bg-white/40 rounded-xl px-3 py-2.5 mb-4">
              {(ownerName || ownerMbti) && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px]">👤</span>
                  <span className="text-[11px] font-bold text-gray-700">
                    {ownerName || "견주님"}
                    {ownerMbti && (
                      <span className="ml-1 text-purple-500 font-black">({ownerMbti})</span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-400">×</span>
                  <span className="text-[11px] font-bold text-[#E879A4]">
                    {dogName}
                    <span className="ml-1 font-black">({code})</span>
                  </span>
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                {breedName && (
                  <span className="px-2 py-0.5 bg-white/60 rounded-full text-[10px] font-semibold text-gray-600">
                    🐕 {breedName}
                  </span>
                )}
                {ownerMbti && (
                  <span className="px-2 py-0.5 bg-white/60 rounded-full text-[10px] font-semibold text-purple-500">
                    💜 궁합 케미
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 하단 */}
        <div className="px-6 py-2.5 flex items-center justify-between" style={{ background: "rgba(0,0,0,0.04)" }}>
          <span className="text-[11px] text-gray-500 font-black tracking-wider">
            멍BTI
          </span>
          <span className="text-[9px] text-gray-400">강아지 성향 테스트 🐾</span>
        </div>
      </div>

      {/* === 액션 버튼 === */}
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

      {/* === SNS 공유 패널 === */}
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
