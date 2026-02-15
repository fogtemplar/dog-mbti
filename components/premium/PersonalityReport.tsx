"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { toBlob } from "html-to-image";
import type { AxisPercentage } from "@/lib/calculate";
import RadarChart from "./RadarChart";
import AxisGauge from "./AxisGauge";
import SocialShare from "../SocialShare";

interface PersonalityReportProps {
  percentages: AxisPercentage[];
  ownerMbti?: string;
  ownerName?: string;
  dogName: string;
  nickname: string;
  typeCode?: string;
  photoUrl?: string | null;
}

const AXIS_NAMES = ["사교성", "활동성", "호기심", "주도성"];

/* ── 1. 키워드 뱃지 ── */
export function generateKeywords(pcts: AxisPercentage[]): string[] {
  const tags: string[] = [];
  const [sl, hc, xg, ba] = pcts.map((p) => p.left.pct);

  if (sl >= 75) tags.push("#인싸견");
  else if (sl >= 60) tags.push("#사교왕");
  else if (sl <= 25) tags.push("#독립왕");
  else if (sl <= 40) tags.push("#마이웨이");
  else tags.push("#밸런스사교");

  if (hc >= 75) tags.push("#에너지폭발");
  else if (hc >= 60) tags.push("#활발이");
  else if (hc <= 25) tags.push("#힐링메이트");
  else if (hc <= 40) tags.push("#차분이");
  else tags.push("#적당한활동성");

  if (xg >= 75) tags.push("#호기심대장");
  else if (xg >= 60) tags.push("#탐험가");
  else if (xg <= 25) tags.push("#루틴왕");
  else if (xg <= 40) tags.push("#안정파");
  else tags.push("#적당한호기심");

  if (ba >= 75) tags.push("#대장견");
  else if (ba >= 60) tags.push("#리더십");
  else if (ba <= 25) tags.push("#순둥이");
  else if (ba <= 40) tags.push("#따라쟁이");
  else tags.push("#주도밸런스");

  return tags;
}

/* ── 3. 성향 순위 ── */
export function getRanking(pcts: AxisPercentage[]) {
  return pcts
    .map((p, i) => ({
      name: AXIS_NAMES[i],
      pct: Math.max(p.left.pct, p.right.pct),
      label: p.left.pct >= 50 ? p.left.label : p.right.label,
      rawPct: p.left.pct,
    }))
    .sort((a, b) => b.pct - a.pct);
}

/* ── 4. 밸런스 지수 ── */
export function calculateBalance(pcts: AxisPercentage[]) {
  const deviations = pcts.map((p) => Math.abs(p.left.pct - 50));
  const avg = deviations.reduce((s, d) => s + d, 0) / 4;
  const score = Math.round(100 - avg * 2);
  let label: string;
  if (score >= 85) label = "완벽한 균형파";
  else if (score >= 70) label = "균형잡힌 성격";
  else if (score >= 55) label = "적당히 개성있는";
  else if (score >= 40) label = "뚜렷한 개성파";
  else label = "극강의 개성파";
  return { score, label };
}

/* ── 5. 유사 견종 ── */
const SIMILAR_BREEDS: Record<string, string[]> = {
  SH: ["골든리트리버", "래브라도 리트리버", "사모예드"],
  SC: ["카발리에 킹찰스", "시츄", "말티즈"],
  LH: ["시바이누", "보더콜리", "시베리안 허스키"],
  LC: ["바셋하운드", "차우차우", "그레이하운드"],
};

export function getSimilarBreeds(pcts: AxisPercentage[]): string[] {
  const sl = pcts[0].left.pct >= 50 ? "S" : "L";
  const hc = pcts[1].left.pct >= 50 ? "H" : "C";
  return SIMILAR_BREEDS[sl + hc] || ["골든리트리버", "푸들", "비글"];
}

/* ══════════════════════════════════════════
   메인 컴포넌트
   ══════════════════════════════════════════ */

export default function PersonalityReport({
  percentages,
  ownerMbti,
  ownerName,
  dogName,
  nickname,
  typeCode,
  photoUrl,
}: PersonalityReportProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const keywords = useMemo(() => generateKeywords(percentages), [percentages]);
  const ranking = useMemo(() => getRanking(percentages), [percentages]);
  const balance = useMemo(() => calculateBalance(percentages), [percentages]);
  const breeds = useMemo(() => getSimilarBreeds(percentages), [percentages]);

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch { /* ignore */ }
    }
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    const scale = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 2)));
    const blob = await toBlob(captureRef.current, {
      pixelRatio: scale,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });
    return blob;
  }, []);

  const handleDownload = async () => {
    setSaving(true);
    setShowMenu(false);
    try {
      const blob = await captureCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `너는내운멍_${dogName}_종합진단표.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyImage = async () => {
    setSaving(true);
    setShowMenu(false);
    try {
      const blob = await captureCard();
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("진단표 이미지가 클립보드에 복사되었어요!");
    } catch {
      alert("이미지 복사에 실패했어요. 저장을 이용해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  const [showSharePanel, setShowSharePanel] = useState(false);

  return (
    <div className="mb-6 animate-slide-up">
      <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
        <span>🩺</span> {dogName}의 성향 진단표
      </h2>

      {/* ── 카드 (캡처 대상) ── */}
      <div ref={captureRef} className="bg-white rounded-2xl p-5" style={{ overflow: "hidden" }}>
        <div className="text-center mb-3">
          {photoUrl && (
            <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", border: "3px solid #F5A3C4" }}>
              <img src={photoUrl} alt={dogName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <p className="text-lg font-extrabold text-gray-700 mb-1">
            우리 {dogName}은(는) 어떤 성격일까?
          </p>
          <p className="text-base font-bold bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
            {nickname}{typeCode && ` (${typeCode})`}
          </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {keywords.map((kw) => (
            <span key={kw} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF0F5] text-[#E879A4]">
              {kw}
            </span>
          ))}
        </div>

        <RadarChart percentages={percentages} ownerMbti={ownerMbti} ownerName={ownerName} dogName={dogName} typeCode={typeCode} />
        <div className="h-px bg-gray-100 my-5" />
        <div className="space-y-5">
          {percentages.map((p, i) => (
            <AxisGauge key={p.axis} axisName={AXIS_NAMES[i]} leftLabel={p.left.label} rightLabel={p.right.label} leftPct={p.left.pct} />
          ))}
        </div>

        <div className="h-px bg-gray-100 my-5" />

        {/* 순위 / 밸런스 / 유사견종 */}
        <div className="grid grid-cols-3 gap-2">
          {/* Ranking */}
          <div className="bg-[#FFF5F9] rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-500 mb-2">📊 성향 순위</p>
            <div className="space-y-1">
              {ranking.map((r, i) => (
                <div key={r.name} className="flex items-center gap-1 text-[10px]">
                  <span className="font-bold text-[#E879A4]">{i + 1}.</span>
                  <span className="text-gray-600">{r.name}</span>
                  <span className="ml-auto font-bold text-gray-500">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Balance */}
          <div className="bg-[#FFF5F9] rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-500 mb-2">⚖️ 밸런스</p>
            <div className="text-center">
              <p className="text-xl font-black text-[#E879A4]">{balance.score}</p>
              <p className="text-[9px] text-gray-400">/ 100</p>
              <p className="text-[10px] font-medium text-gray-600 mt-1">{balance.label}</p>
            </div>
          </div>

          {/* Similar breeds */}
          <div className="bg-[#FFF5F9] rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-500 mb-2">🐕 유사 견종</p>
            <div className="space-y-1">
              {breeds.map((b) => (
                <p key={b} className="text-[10px] text-gray-600">{b}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-center gap-1.5">
          <span className="text-[10px] text-[#D4C0D8]">너는내운멍</span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#D4C0D8]" />
          <span className="text-[10px] text-[#D4C0D8]">Daeng.me</span>
        </div>
      </div>

      {/* ── 저장 / 공유 버튼 ── */}
      <div className="mt-3 flex gap-2 relative">
        <div className="flex-1 relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            disabled={saving}
            className="w-full py-3 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ boxShadow: "0 4px 14px rgba(232,121,164,0.3)" }}
          >
            {saving ? "처리 중..." : "📥 진단표 저장"}
          </button>
          {showMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <button onClick={handleCopyImage} className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 transition-colors text-left">
                📋 이미지 복사
              </button>
              <div className="h-px bg-gray-100" />
              <button onClick={handleDownload} className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 transition-colors text-left">
                💾 이미지 저장
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowSharePanel((v) => !v)}
          disabled={saving}
          className="flex-1 py-3 bg-white border-2 border-[#E879A4] text-[#E879A4] rounded-2xl text-sm font-bold hover:bg-[#E879A4]/5 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          📤 공유하기
        </button>
      </div>

      {/* ── SNS 공유 패널 ── */}
      {showSharePanel && (
        <SocialShare
          url="https://www.daeng.me"
          title={`우리 ${dogName} 성향 분석 완료! "${nickname}" 타입이래 🐾 너도 해봐!`}
          description={`강아지 성향 테스트 너는내운멍에서 확인해봐!`}
          dogName={dogName}
          captureCard={captureCard}
        />
      )}

    </div>
  );
}
