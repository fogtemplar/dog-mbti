"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { premiumReportData } from "@/data/premiumReport";
import { resultData } from "@/data/results";
import {
  generateDeepSynergyGoodPoints,
  generateDeepSynergyCautions,
  generateRecommendedActivities,
  generateLivingTips,
} from "@/data/premiumSynergy";
import { isPremiumUnlocked, unlockPremium } from "@/lib/premiumStore";
import { fillName } from "@/lib/calculate";
import { decodeSharePayload, pctArrayToPercentages } from "@/lib/sharePayload";
import ShareCard from "@/components/ShareCard";
import { breeds } from "@/data/breeds";
import { useQuizStore } from "@/store/quizStore";
import { premiumExtraData } from "@/data/premiumExtra";

export default function PremiumPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-dvh">
          <div className="text-4xl animate-bounce-slow">🐾</div>
        </div>
      }
    >
      <PremiumContent />
    </Suspense>
  );
}

function PremiumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dParam = searchParams.get("d") || "";
  const payload = decodeSharePayload(dParam);

  const code = payload?.type || "";
  const dogName = payload?.dogName || "강아지";
  const ownerName = payload?.ownerName;
  const ownerMbti = payload?.ownerMbti;

  const storePhotoUrl = useQuizStore((s) => s.photoUrl);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    setUnlocked(isPremiumUnlocked(code));
  }, [code]);

  useEffect(() => {
    if (storePhotoUrl) {
      setPhotoUrl(storePhotoUrl);
      return;
    }
    try {
      const saved = localStorage.getItem("mungbti-photo");
      if (saved) setPhotoUrl(saved);
    } catch {}
  }, [storePhotoUrl]);

  const report = premiumReportData[code];
  const result = resultData[code];

  if (!report || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <div className="text-5xl mb-4">🚫</div>
        <p className="text-lg font-bold mb-2">리포트를 찾을 수 없어요</p>
        <button
          onClick={() => router.push("/")}
          className="text-[#E879A4] underline mt-4"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  const handleUnlock = () => {
    setUnlocking(true);
    // MVP: 즉시 잠금해제 (추후 실 결제 연동)
    setTimeout(() => {
      unlockPremium(code, dogName, ownerMbti);
      setUnlocked(true);
      setUnlocking(false);
    }, 800);
  };

  // ─── 페이월 ───
  if (!unlocked) {
    return (
      <div className="flex flex-col min-h-dvh px-6 py-8">
        {/* 헤더 */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 mb-6"
        >
          ← 결과로 돌아가기
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-black mb-2">
            <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
              {dogName}
            </span>
            의 심층 리포트
          </h1>
          <p className="text-sm text-gray-500">
            {result.nickname} ({code})
          </p>
        </div>

        {/* 미리보기 */}
        <div className="space-y-3 mb-8">
          {[
            { icon: "📊", label: "축별 상세 분석", count: "4가지" },
            { icon: "🔮", label: "상황별 행동 예측", count: "5가지" },
            { icon: "🎯", label: "맞춤 훈련 팁", count: "3가지" },
            { icon: "🎾", label: "추천 놀이법", count: "3가지" },
            { icon: "🐕", label: "다른 강아지와의 궁합", count: "3가지" },
            { icon: "🚨", label: "스트레스 시그널 가이드", count: "4가지" },
            { icon: "🚶", label: "산책 스타일 가이드", count: "맞춤형" },
            { icon: "🏠", label: "생활환경 체크리스트", count: "5가지" },
            ...(ownerMbti
              ? [
                  { icon: "🤝", label: "함께 잘 지내는 법", count: "4가지" },
                  { icon: "💕", label: "궁합 심층 분석", count: "8가지" },
                ]
              : []),
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl px-4 py-3 border border-pink-100"
            >
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <span className="text-sm font-semibold flex-1">
                {item.label}
              </span>
              <span className="text-xs text-[#E879A4] font-bold">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* 블러 미리보기 */}
        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <div className="bg-white p-5 filter blur-[6px] select-none pointer-events-none">
            <h3 className="text-sm font-bold text-gray-500 mb-3">
              사교성 분석
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {fillName(
                report.axisInterpretations[0].detail,
                dogName,
              )}
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
            <span className="text-3xl">🔒</span>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] rounded-2xl p-6 text-white text-center">
          <p className="text-2xl font-black mb-1">990원</p>
          <p className="text-xs opacity-80 mb-4">
            {dogName}만을 위한 맞춤 리포트
          </p>
          <button
            onClick={handleUnlock}
            disabled={unlocking}
            className="w-full py-3.5 bg-white text-[#E879A4] rounded-xl font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {unlocking ? "잠금 해제 중..." : "잠금 해제하기"}
          </button>
          <p className="text-[10px] opacity-60 mt-3">
            * MVP 테스트 버전으로 실제 결제 없이 잠금 해제됩니다
          </p>
        </div>
      </div>
    );
  }

  // ─── 잠금 해제된 콘텐츠 ───
  const extra = premiumExtraData[code];
  const percentages = pctArrayToPercentages(payload?.pcts || [50, 50, 50, 50]);
  const breedName = payload?.breedId
    ? breeds.find((b) => b.id === payload.breedId)?.name
    : undefined;
  const resultShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result?d=${dParam}`
      : "";

  const goodPoints = ownerMbti
    ? generateDeepSynergyGoodPoints(code, ownerMbti, dogName, ownerName)
    : [];
  const cautions = ownerMbti
    ? generateDeepSynergyCautions(code, ownerMbti, dogName, ownerName)
    : [];
  const activities = ownerMbti
    ? generateRecommendedActivities(code, ownerMbti, dogName, ownerName)
    : [];
  const livingTips = ownerMbti
    ? generateLivingTips(code, ownerMbti, dogName, ownerName)
    : [];

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      {/* 헤더 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-4"
      >
        ← 결과로 돌아가기
      </button>

      <div className="text-center mb-8 animate-scale-in">
        <div className="text-4xl mb-2">{result.emoji}</div>
        <h1 className="text-xl font-black">
          <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
            {dogName}
          </span>
          의 심층 리포트
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {result.nickname} ({code})
        </p>
      </div>

      {/* ── 카드 ── */}
      <div className="mb-6 animate-scale-in">
        <ShareCard
          dogName={dogName}
          nickname={result.nickname}
          code={result.code}
          emoji={result.emoji}
          summary={fillName(result.summary, dogName)}
          bgColor={result.bgColor}
          photoUrl={photoUrl}
          percentages={percentages}
          breedName={breedName}
          ownerName={ownerName}
          ownerMbti={ownerMbti}
          shareUrl={resultShareUrl}
        />
      </div>

      {/* ── 1. 축별 상세 해석 ── */}
      <div className="mb-6 animate-slide-up">
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
          <span>📊</span> 축별 상세 분석
        </h2>
        <div className="space-y-3">
          {report.axisInterpretations.map((axis, i) => (
            <div
              key={axis.axis}
              className="bg-white rounded-2xl p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-sm font-bold text-[#E879A4] mb-2">
                {axis.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {fillName(axis.detail, dogName)}
              </p>
              <div className="bg-pink-50 rounded-xl p-3">
                <p className="text-xs text-pink-700 leading-relaxed">
                  <span className="font-bold">💡 TIP </span>
                  {fillName(axis.tip, dogName)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 상황별 행동 예측 ── */}
      <div
        className="mb-6 animate-slide-up"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
          <span>🔮</span> 상황별 행동 예측
        </h2>
        <div className="space-y-3">
          {report.situations.map((sit, i) => (
            <div key={i} className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#E879A4] mb-3">
                {sit.scenario}
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-2">
                <p className="text-[11px] font-bold text-blue-600 mb-1">
                  예상 행동
                </p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {fillName(sit.prediction, dogName)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                <p className="text-[11px] font-bold text-green-600 mb-1">
                  이렇게 해주세요
                </p>
                <p className="text-xs text-green-800 leading-relaxed">
                  {fillName(sit.advice, dogName)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. 맞춤 훈련 팁 ── */}
      <div
        className="mb-6 animate-slide-up"
        style={{ animationDelay: "0.5s" }}
      >
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
          <span>🎯</span> 맞춤 훈련 팁
        </h2>
        <div className="space-y-3">
          {report.trainingTips.map((tip, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5"
            >
              <h3 className="text-sm font-bold text-purple-700 mb-2">
                {fillName(tip.title, dogName)}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {fillName(tip.description, dogName)}
              </p>
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-xs text-purple-600 leading-relaxed">
                  <span className="font-bold">방법: </span>
                  {fillName(tip.method, dogName)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. 추천 놀이법 ── */}
      <div
        className="mb-6 animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
          <span>🎾</span> 추천 놀이법
        </h2>
        <div className="space-y-3">
          {report.playStyles.map((play, i) => (
            <div key={i} className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#E879A4] mb-2">
                {fillName(play.activity, dogName)}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {fillName(play.reason, dogName)}
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                <p className="text-xs text-green-700 leading-relaxed">
                  <span className="font-bold">이렇게 해보세요: </span>
                  {fillName(play.howTo, dogName)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. 다른 강아지와의 궁합 ── */}
      {extra && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>🐕</span> 다른 강아지와의 궁합
          </h2>
          <div className="space-y-3">
            {[
              { label: "최고의 궁합", color: "green", data: extra.dogCompatibility.bestMatch },
              { label: "좋은 궁합", color: "blue", data: extra.dogCompatibility.goodMatch },
              { label: "주의할 궁합", color: "amber", data: extra.dogCompatibility.cautionMatch },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-${item.color}-50 border border-${item.color}-100 rounded-2xl p-4`}
                style={{
                  backgroundColor: item.color === "green" ? "#f0fdf4" : item.color === "blue" ? "#eff6ff" : "#fffbeb",
                  borderColor: item.color === "green" ? "#bbf7d0" : item.color === "blue" ? "#bfdbfe" : "#fde68a",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    backgroundColor: item.color === "green" ? "#dcfce7" : item.color === "blue" ? "#dbeafe" : "#fef3c7",
                    color: item.color === "green" ? "#15803d" : item.color === "blue" ? "#1d4ed8" : "#b45309",
                  }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {item.data.nickname} ({item.data.code})
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {fillName(item.data.reason, dogName)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. 스트레스 시그널 가이드 ── */}
      {extra && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>🚨</span> 스트레스 시그널 가이드
          </h2>
          <div className="space-y-3">
            {extra.stressSignals.map((sig, i) => (
              <div key={i} className="bg-white rounded-2xl p-5">
                <p className="text-sm font-bold text-red-500 mb-2">
                  {fillName(sig.signal, dogName)}
                </p>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-2">
                  <p className="text-[11px] font-bold text-orange-600 mb-1">의미</p>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    {fillName(sig.meaning, dogName)}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-green-600 mb-1">이렇게 해주세요</p>
                  <p className="text-xs text-green-800 leading-relaxed">
                    {fillName(sig.response, dogName)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. 산책 스타일 가이드 ── */}
      {extra && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>🚶</span> 산책 스타일 가이드
          </h2>
          <div className="bg-white rounded-2xl p-5 mb-3">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "시간", value: extra.walkStyle.duration },
                { label: "횟수", value: extra.walkStyle.frequency },
                { label: "강도", value: extra.walkStyle.intensity },
              ].map((stat) => (
                <div key={stat.label} className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-blue-500 font-bold mb-1">{stat.label}</p>
                  <p className="text-xs font-black text-blue-700">{stat.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {fillName(extra.walkStyle.idealCourse, dogName)}
            </p>
            <div className="space-y-2">
              {extra.walkStyle.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#E879A4] mt-0.5 text-xs">●</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {fillName(tip, dogName)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 8. 생활환경 체크리스트 ── */}
      {extra && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "1.0s" }}>
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>🏠</span> 생활환경 체크리스트
          </h2>
          <div className="space-y-3">
            {extra.environmentChecks.map((check, i) => (
              <div key={i} className="bg-white rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#E879A4] mb-3">
                  {check.category}
                </h3>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-2">
                  <p className="text-[11px] font-bold text-green-600 mb-1">이상적인 환경</p>
                  <p className="text-xs text-green-800 leading-relaxed">
                    {fillName(check.ideal, dogName)}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-red-500 mb-1">주의</p>
                  <p className="text-xs text-red-700 leading-relaxed">
                    {fillName(check.warning, dogName)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. 함께 잘 지내는 법 ── */}
      {ownerMbti && livingTips.length > 0 && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "1.1s" }}>
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>🤝</span> {ownerName || "견주님"}와 {dogName}, 함께 잘 지내는 법
          </h2>
          <div className="space-y-3">
            {livingTips.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {tip.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-indigo-600 mb-2">
                  {tip.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. 궁합 심층 분석 ── */}
      {ownerMbti && (
        <div
          className="mb-6 animate-slide-up"
          style={{ animationDelay: "0.7s" }}
        >
          <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
            <span>💕</span> 궁합 심층 분석
          </h2>

          {/* 페어링 헤더 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-md">
              <span className="text-lg font-black text-purple-600">
                {ownerMbti}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {ownerName || "견주님"}
              </span>
            </div>
            <div className="text-2xl animate-wiggle">💕</div>
            <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-md">
              <span className="text-lg font-black text-[#E879A4]">
                {code}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {dogName}
              </span>
            </div>
          </div>

          {/* 잘 맞는 점 */}
          {goodPoints.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-green-600 mb-2">
                잘 맞는 점
              </p>
              <div className="space-y-2">
                {goodPoints.map((p, i) => (
                  <div
                    key={i}
                    className="bg-green-50 border border-green-100 rounded-2xl p-4"
                  >
                    <h4 className="text-sm font-bold text-green-700 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-green-800 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주의할 점 */}
          {cautions.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-amber-600 mb-2">
                주의할 점
              </p>
              <div className="space-y-2">
                {cautions.map((c, i) => (
                  <div
                    key={i}
                    className="bg-amber-50 border border-amber-100 rounded-2xl p-4"
                  >
                    <h4 className="text-sm font-bold text-amber-700 mb-1">
                      {c.title}
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 함께 하면 좋은 활동 */}
          {activities.length > 0 && (
            <div>
              <p className="text-xs font-bold text-purple-600 mb-2">
                함께 하면 좋은 활동
              </p>
              <div className="space-y-2">
                {activities.map((a, i) => (
                  <div
                    key={i}
                    className="bg-purple-50 border border-purple-100 rounded-2xl p-4"
                  >
                    <h4 className="text-sm font-bold text-purple-700 mb-1">
                      {a.activity}
                    </h4>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      {a.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-3 mb-4 animate-slide-up" style={{ animationDelay: "0.8s" }}>
        <button
          onClick={() => router.back()}
          className="flex-1 py-3.5 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all"
        >
          결과로 돌아가기
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 py-3.5 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          처음으로
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 leading-relaxed pb-8">
        이 리포트는 보호자가 관찰한 {dogName}의 행동을 기반으로 한
        <br />
        재미 해석이며, 의학적 진단이 아닙니다.
      </p>
    </div>
  );
}

