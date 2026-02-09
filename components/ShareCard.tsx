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
}

export default function ShareCard({
  dogName,
  nickname,
  code,
  emoji,
  summary,
  bgColor,
  photoUrl,
  percentages,
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

  return (
    <div>
      {/* === 캡처 대상 카드 === */}
      <div
        ref={cardRef}
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="p-6 pb-4">
          {/* 상단: 사진 + 타입 정보 */}
          <div className="flex items-center gap-4 mb-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={dogName}
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border-2 border-white/60"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl flex-shrink-0">
                {emoji}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">{dogName}의 성향 타입</p>
              <p className="text-2xl font-black tracking-wider text-[#6C63FF] leading-tight">
                {code}
              </p>
              <p className="text-base font-bold truncate">{nickname}</p>
            </div>
          </div>

          {/* 한줄 요약 */}
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            {summary}
          </p>

          {/* 축별 미니 바 */}
          <div className="space-y-2">
            {percentages.map((p) => (
              <div key={p.axis}>
                <div className="flex justify-between text-[10px] font-medium mb-0.5">
                  <span
                    className={
                      p.left.pct >= p.right.pct
                        ? "text-[#6C63FF] font-bold"
                        : "text-gray-400"
                    }
                  >
                    {p.left.label} {p.left.pct}%
                  </span>
                  <span
                    className={
                      p.right.pct > p.left.pct
                        ? "text-[#6C63FF] font-bold"
                        : "text-gray-400"
                    }
                  >
                    {p.right.pct}% {p.right.label}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#6C63FF] rounded-l-full"
                    style={{ width: `${p.left.pct}%` }}
                  />
                  <div
                    className="h-full bg-[#E0DDFF] rounded-r-full"
                    style={{ width: `${p.right.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 워터마크 */}
        <div className="px-6 py-3 bg-black/5 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-medium">
            멍BTI - 강아지 성향 테스트
          </span>
          <span className="text-[10px] text-gray-400">🐾</span>
        </div>
      </div>

      {/* === 액션 버튼 (캡처 밖) === */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 bg-[#6C63FF] text-white rounded-2xl text-sm font-bold hover:bg-[#5B54E6] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? "저장 중..." : "📥 카드 저장"}
        </button>
        <button
          onClick={handleShare}
          disabled={saving}
          className="flex-1 py-3 bg-white border-2 border-[#6C63FF] text-[#6C63FF] rounded-2xl text-sm font-bold hover:bg-[#6C63FF]/5 active:scale-[0.98] transition-all disabled:opacity-50"
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
