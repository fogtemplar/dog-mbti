"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas-pro";

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
  ownerMbti?: string;
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
  ownerMbti,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

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

  const handleShare = async () => {
    setSaving(true);
    try {
      const blob = await captureCard();
      if (!blob) return;
      const file = new File([blob], `${dogName}_멍BTI.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${dogName}는 ${nickname} 타입!`,
          text: `${dogName}의 강아지 MBTI 결과를 확인해 보세요!`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${dogName}는 ${nickname} 타입!`,
          text: `${dogName}의 강아지 MBTI 결과를 확인해 보세요!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었어요!");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
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
        style={{ background: bg, boxShadow: "0 8px 32px rgba(108,99,255,0.15)" }}
      >
        {/* 상단 장식 패턴 */}
        <div className="relative px-6 pt-6 pb-0">
          <div className="absolute top-3 right-5 text-4xl opacity-[0.12]">🐾</div>
          <div className="absolute top-10 right-14 text-2xl opacity-[0.08]">🐾</div>

          {/* 프로필 영역 */}
          <div className="flex items-center gap-4 mb-4">
            {photoUrl ? (
              <div className="relative">
                <div className="w-[76px] h-[76px] rounded-2xl overflow-hidden border-[3px] border-white/80" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <img
                    src={photoUrl}
                    alt={dogName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                  {emoji}
                </div>
              </div>
            ) : (
              <div className="w-[76px] h-[76px] rounded-2xl bg-white/50 flex items-center justify-center text-4xl border-2 border-white/60" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                {emoji}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-500 font-medium">{dogName}의 성향 타입</p>
              <p className="text-[26px] font-black tracking-[0.15em] text-[#6C63FF] leading-tight">
                {code}
              </p>
              <p className="text-[15px] font-bold text-gray-800 truncate">{nickname}</p>
            </div>
          </div>

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
                        background: "linear-gradient(90deg, #6C63FF, #A78BFA)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#6C63FF] w-9">
                    {dominant.pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* 태그 */}
          <div className="flex gap-1.5 flex-wrap pb-4">
            {breedName && (
              <span className="px-2.5 py-1 bg-white/60 rounded-full text-[10px] font-semibold text-gray-600">
                🐕 {breedName}
              </span>
            )}
            {ownerMbti && (
              <span className="px-2.5 py-1 bg-white/60 rounded-full text-[10px] font-semibold text-gray-600">
                💜 찰떡 견주 {ownerMbti}
              </span>
            )}
          </div>
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
          className="flex-1 py-3.5 bg-[#6C63FF] text-white rounded-2xl text-sm font-bold hover:bg-[#5B54E6] active:scale-[0.98] transition-all disabled:opacity-50"
          style={{ boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}
        >
          {saving ? "저장 중..." : "📥 카드 저장"}
        </button>
        <button
          onClick={handleShare}
          disabled={saving}
          className="flex-1 py-3.5 bg-white border-2 border-[#6C63FF] text-[#6C63FF] rounded-2xl text-sm font-bold hover:bg-[#6C63FF]/5 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? "준비 중..." : "📤 공유하기"}
        </button>
      </div>
      <button
        onClick={handleCopyLink}
        className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        🔗 링크 복사
      </button>
    </div>
  );
}
