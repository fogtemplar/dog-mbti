"use client";

import { useRef, useState, useCallback } from "react";
import { toBlob } from "html-to-image";
import SocialShare from "@/components/SocialShare";
import type { ShareCardProps } from "./share/types";
import { premiumGradients } from "./share/utils";
import VerticalCard from "./share/VerticalCard";
import HorizontalCard from "./share/HorizontalCard";

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
  const [showSaveMenu, setShowSaveMenu] = useState(false);
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
      {/* 모드 토글 */}
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

      {/* 세로형 카드 */}
      <div style={{ display: mode === "vertical" ? "block" : "none" }}>
        <VerticalCard
          ref={verticalRef}
          dogName={dogName} nickname={nickname} code={code} emoji={emoji}
          summary={summary} photoUrl={photoUrl} percentages={percentages}
          breedName={breedName} ownerName={ownerName} ownerMbti={ownerMbti}
          colors={colors}
        />
      </div>

      {/* 가로형 카드 */}
      <div style={{ display: mode === "horizontal" ? "block" : "none", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <HorizontalCard
          ref={horizontalRef}
          dogName={dogName} nickname={nickname} code={code} emoji={emoji}
          summary={summary} photoUrl={photoUrl} percentages={percentages}
          breedName={breedName} ownerName={ownerName} ownerMbti={ownerMbti}
          colors={colors}
        />
      </div>

      {/* 액션 버튼 */}
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
