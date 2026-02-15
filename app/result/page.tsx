"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { resultData } from "@/data/results";
import { breeds } from "@/data/breeds";
import { ownerMatches, generateSynergyMessage } from "@/data/ownerMbti";
import { computeScores, getAxisPercentages, fillName } from "@/lib/calculate";
import {
  decodeSharePayload,
  encodeSharePayload,
  pctArrayToPercentages,
  percentagesToPctArray,
} from "@/lib/sharePayload";
import ShareCard from "@/components/ShareCard";
import { isPremiumUnlocked } from "@/lib/premiumStore";

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-4xl animate-bounce-slow">🐾</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useQuizStore();

  // ?d= 파라미터에서 공유 데이터 디코드
  const dParam = searchParams.get("d");
  const selfParam = searchParams.get("self"); // 본인 테스트에서 온 경우
  const shared = useMemo(() => (dParam ? decodeSharePayload(dParam) : null), [dParam]);
  const isSharedView = !!shared && !selfParam;

  // 데이터 소스: 공유 링크 → store fallback
  const type = shared?.type || store.resultCode || "";
  const dogName = shared?.dogName || store.dogName;
  const ownerName = shared?.ownerName || store.ownerName;
  const breedId = shared?.breedId || store.breedId;
  const ownerMbti = shared?.ownerMbti || store.ownerMbti;
  // 사진: store → localStorage fallback (새로고침 시 store 초기화 대비)
  const [photoUrl, setLocalPhoto] = useState<string | null>(
    isSharedView ? null : store.photoUrl
  );
  useEffect(() => {
    if (!isSharedView && !photoUrl) {
      try {
        const saved = localStorage.getItem("mungbti-photo");
        if (saved) setLocalPhoto(saved);
      } catch { /* ignore */ }
    }
  }, [isSharedView, photoUrl]);

  const result = resultData[type];

  // 퍼센트: 공유 데이터 → store answers에서 계산
  const percentages = useMemo(() => {
    if (shared?.pcts) return pctArrayToPercentages(shared.pcts);
    if (store.answers.length > 0) {
      return getAxisPercentages(computeScores(store.answers));
    }
    return pctArrayToPercentages([50, 50, 50, 50]);
  }, [shared, store.answers]);

  const breed = breeds.find((b) => b.id === breedId);
  const ownerMatch = ownerMatches[type];

  const totalHintPages = result ? result.hints.length : 0;
  // 힌트 0~3 → 축별분석(H) → 타입공개(H+1) → 궁합(H+2) → 최종카드(H+3)
  const STEP_AXIS = totalHintPages;
  const STEP_TYPE = totalHintPages + 1;
  const STEP_SYNERGY = totalHintPages + 2;
  const STEP_FINAL = totalHintPages + 3;
  const [step, setStep] = useState(isSharedView ? STEP_FINAL : 0);

  // 공유 페이로드 인코딩 (공유 URL + 프리미엄 URL에서 재사용)
  const shareEncoded = useMemo(() => {
    if (typeof window === "undefined" || !type) return "";
    return encodeSharePayload({
      type,
      dogName: dogName || "강아지",
      ownerName: ownerName || undefined,
      breedId: breedId || undefined,
      ownerMbti: ownerMbti || undefined,
      pcts: percentagesToPctArray(percentages),
    });
  }, [type, dogName, ownerName, breedId, ownerMbti, percentages]);

  const shareUrl = useMemo(() => {
    if (!shareEncoded) return "";
    return `${window.location.origin}/result?d=${shareEncoded}`;
  }, [shareEncoded]);

  // 위변조된 공유 링크이거나 결과 없음
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        {dParam && !shared ? (
          <>
            <div className="text-5xl mb-4">🚫</div>
            <p className="text-lg font-bold mb-2">유효하지 않은 링크예요</p>
            <p className="text-sm text-gray-500 mb-4">링크가 변조되었거나 만료되었을 수 있어요.</p>
          </>
        ) : (
          <p className="text-lg font-bold mb-4">결과를 찾을 수 없어요</p>
        )}
        <button
          onClick={() => { store.reset(); router.push("/"); }}
          className="text-[#E879A4] underline"
        >
          처음부터 다시 하기
        </button>
      </div>
    );
  }

  const displayName = dogName || "강아지";
  const displayOwner = ownerName || "견주님";

  // 히스토리 저장 (최초 1회, 본인 테스트만)
  const savedRef = useRef(false);
  useEffect(() => {
    if (result && !isSharedView && !savedRef.current) {
      savedRef.current = true;
      store.saveToHistory();
    }
  }, [result, isSharedView, store.saveToHistory]);

  const breedTypicalResult = breed?.typicalType ? resultData[breed.typicalType] : null;
  const isSameAsBreed = breed?.typicalType === type;

  const nextStep = () => {
    setStep((s) => {
      // 궁합 단계 건너뛰기 (ownerMbti 없으면)
      if (s === STEP_TYPE && !ownerMbti) return STEP_FINAL;
      return s + 1;
    });
  };

  // ─── Step 0 ~ (totalHintPages-1): 성향 힌트 4페이지 ───
  if (step < totalHintPages) {
    const hintLines = result.hints[step];
    const isFirst = step === 0;
    const isLast = step === totalHintPages - 1;
    const headings = [
      `${displayName}의 숨은 성격은...`,
      `${displayName}에게서 이런 면이 보여요`,
      `그리고 또 하나!`,
      `거의 다 왔어요!`,
    ];

    return (
      <div className="flex flex-col items-center min-h-dvh px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-10 left-8 text-2xl animate-float opacity-20">🌸</div>
        <div className="absolute top-16 right-10 text-xl animate-sparkle opacity-15">✨</div>

        {/* 아이콘 영역 (고정 높이) */}
        <div className="h-28 flex items-center justify-center animate-scale-in">
          {isFirst && (photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#E879A4]/20"
            />
          ) : (
            <div className="text-6xl">{result.emoji}</div>
          ))}
          {!isFirst && (
            <div className="text-5xl">
              {["🐾", "💡", "✨", "🎯"][step] || "🐾"}
            </div>
          )}
        </div>

        {/* 서브타이틀 + 헤딩 */}
        <p className="text-sm text-gray-500 mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {isFirst ? "분석이 끝났어요!" : `${step + 1} / ${totalHintPages}`}
        </p>
        <h1 className="text-xl font-black mb-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
            {headings[step] || headings[0]}
          </span>
        </h1>

        {/* 컨텐츠 영역 */}
        <div className="w-full max-w-xs space-y-3 flex-1">
          {hintLines.map((line, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 text-sm text-gray-700 leading-relaxed animate-slide-up"
              style={{ animationDelay: `${0.6 + i * 0.2}s` }}
            >
              {fillName(line, displayName)}
            </div>
          ))}
        </div>

        {/* 하단 고정: 인디케이터 + 버튼 */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex gap-2 mb-5 animate-slide-up" style={{ animationDelay: "1s" }}>
            {Array.from({ length: totalHintPages }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? "bg-[#E879A4] w-6" : i < step ? "bg-[#E879A4]/40" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
            style={{ animationDelay: "1.1s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
          >
            {isLast ? "성향 분석 보기 →" : "다음 →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── 축별 성향 분석 ───
  if (step === STEP_AXIS) {
    const axisLabels = ["사교성", "감정표현", "탐험심", "행동패턴"];
    return (
      <div className="flex flex-col items-center min-h-dvh px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute bottom-20 right-6 text-xl animate-float opacity-15">💖</div>

        {/* 아이콘 영역 (고정 높이) */}
        <div className="h-28 flex items-center justify-center animate-scale-in">
          <div className="text-5xl">📊</div>
        </div>

        {/* 서브타이틀 + 헤딩 */}
        <p className="text-sm text-gray-500 mb-2 animate-slide-up">
          {displayName}의 성향 분석
        </p>
        <h2 className="text-xl font-black mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          이런 성향을 갖고 있어요
        </h2>

        {/* 컨텐츠 영역 */}
        <div className="w-full max-w-sm space-y-4 flex-1">
          {percentages.map((p, i) => {
            const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
            return (
              <div
                key={p.axis}
                className="bg-white rounded-2xl p-4 animate-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400">{axisLabels[i]}</span>
                  <span className="text-sm font-black text-[#E879A4]">{dominant.label} {dominant.pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${dominant.pct}%`,
                      background: "linear-gradient(90deg, #E879A4, #C084FC)",
                      transitionDelay: `${0.5 + i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 고정: 버튼 */}
        <div className="mt-8">
          <button
            onClick={nextStep}
            className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
            style={{ animationDelay: "1s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
          >
            결과 타입 보기 →
          </button>
        </div>
      </div>
    );
  }

  // ─── 타입 공개 ───
  if (step === STEP_TYPE) {
    return (
      <div className="flex flex-col items-center min-h-dvh px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-12 right-10 text-2xl animate-sparkle opacity-20">🌟</div>
        <div className="absolute bottom-28 left-8 text-xl animate-float opacity-15">🐾</div>

        {/* 아이콘 영역 (고정 높이) */}
        <div className="h-28 flex items-center justify-center animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-5xl font-black tracking-[0.2em] bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
            {result.code}
          </p>
        </div>

        {/* 서브타이틀 + 헤딩 */}
        <p className="text-sm text-gray-500 mb-2 animate-slide-up">
          {displayName}의 성향 타입은
        </p>
        <h2
          className="text-2xl font-black mb-2 animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          {result.emoji} {result.nickname}
        </h2>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col items-center">
          <p
            className="text-sm text-gray-600 leading-relaxed max-w-xs mb-6 animate-slide-up"
            style={{ animationDelay: "0.8s" }}
          >
            {fillName(result.summary, displayName)}
          </p>

          {breed && breed.id !== "other" && (
            <div
              className="w-full max-w-xs bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 animate-slide-up"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-xs font-bold text-gray-400 mb-1">🐕 {breed.name} 평균 성격</p>
              {isSameAsBreed ? (
                <p className="text-sm text-[#E879A4] font-medium">
                  {breed.name}의 전형적인 성격과 일치해요!
                </p>
              ) : breedTypicalResult ? (
                <p className="text-xs text-gray-500 leading-relaxed">
                  평균 타입은 {breed.typicalType}({breedTypicalResult.nickname})이지만,
                  {displayName}만의 개성이 돋보여요!
                </p>
              ) : (
                <p className="text-xs text-gray-500 leading-relaxed">{breed.personality}</p>
              )}
            </div>
          )}
        </div>

        {/* 하단 고정: 버튼 */}
        <div className="mt-8">
          <button
            onClick={nextStep}
            className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
            style={{ animationDelay: "1.2s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
          >
            {ownerMbti ? `${displayOwner}과의 궁합은? →` : "카드 확인하기 →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── 견주 궁합 ───
  if (step === STEP_SYNERGY && ownerMbti) {
    return (
      <div className="flex flex-col items-center min-h-dvh px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-14 left-6 text-2xl animate-float opacity-15">💜</div>

        {/* 서브타이틀 + 헤딩 */}
        <p className="text-sm text-gray-500 mb-2 animate-slide-up">
          견주 × 강아지 궁합
        </p>
        <h2 className="text-xl font-black mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          우리의 케미는?
        </h2>

        {/* 궁합 카드 */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-md">
            <span className="text-lg font-black text-purple-600">{ownerMbti}</span>
            <span className="text-xs text-gray-500 mt-0.5">{displayOwner}</span>
          </div>
          <div className="text-2xl animate-wiggle">💕</div>
          <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-md">
            <span className="text-lg font-black text-[#E879A4]">{result.code}</span>
            <span className="text-xs text-gray-500 mt-0.5">{displayName}</span>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1">
          <div
            className="w-full max-w-xs bg-white/80 backdrop-blur rounded-2xl p-5 mb-6 text-left animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              {generateSynergyMessage(type, ownerMbti, displayName, ownerName || undefined)}
            </p>
            {ownerMatch && ownerMbti === ownerMatch.mbti && (
              <div className="mt-3 bg-purple-50 rounded-xl p-3">
                <p className="text-sm text-purple-600 font-medium">
                  ✨ 최고의 궁합이에요!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 고정: 버튼 */}
        <div className="mt-8">
          <button
            onClick={nextStep}
            className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
            style={{ animationDelay: "0.8s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
          >
            카드 확인하기 →
          </button>
        </div>
      </div>
    );
  }

  // ─── Final: 카드 + 상세 정보 ───
  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      <div className="mb-6 animate-scale-in">
        <ShareCard
          dogName={displayName}
          nickname={result.nickname}
          code={result.code}
          emoji={result.emoji}
          summary={fillName(result.summary, displayName)}
          bgColor={result.bgColor}
          photoUrl={photoUrl}
          percentages={percentages}
          breedName={breed?.name}
          ownerName={ownerName || undefined}
          ownerMbti={ownerMbti || ownerMatch?.mbti}
          shareUrl={shareUrl}
        />
      </div>

      {!isSharedView && (
        <div className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] rounded-2xl p-6 text-white text-center mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-lg font-bold mb-2">
            {isPremiumUnlocked(type) ? "📖 심층 리포트" : "🔒 심층 리포트"}
          </p>
          <p className="text-sm opacity-90 mb-4">
            {displayName}에게 딱 맞는 놀이법, 산책 팁,
            <br />
            궁합 타입 분석이 준비되어 있어요!
          </p>
          <button
            onClick={() => router.push(`/premium?d=${shareEncoded}`)}
            className="px-6 py-3 bg-white text-[#E879A4] rounded-xl font-bold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            {isPremiumUnlocked(type) ? "심층 리포트 보기" : "990원으로 잠금 해제하기"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-sm font-bold text-gray-500 mb-3">
          {displayName}의 성향 특징
        </h3>
        <ul className="space-y-3">
          {result.traits.map((trait, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="text-[#E879A4] mt-0.5">●</span>
              {fillName(trait, displayName)}
            </li>
          ))}
        </ul>

        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
          <p className="text-[11px] font-bold text-amber-700 mb-2">💡 알아두면 좋은 점</p>
          <ul className="space-y-2">
            {result.cautions.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-amber-800 leading-relaxed">
                <span className="mt-0.5 text-amber-500">▸</span>
                {fillName(c, displayName)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <h3 className="text-sm font-bold text-purple-700 mb-3">
          🔍 왜 이 타입이 나왔을까?
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {fillName(result.reasoning, displayName)}
        </p>

        {breed && breed.id !== "other" && (
          <div className="mt-4 pt-4 border-t border-pink-200/50">
            <p className="text-[11px] font-bold text-purple-600 mb-2">
              🐕 {breed.name} 평균 성격과 비교
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              {breed.personality}
            </p>
            {breed.typicalType && breedTypicalResult && (
              <div className="bg-white/70 rounded-xl p-3 mt-2">
                {isSameAsBreed ? (
                  <p className="text-sm text-purple-600 font-medium">
                    ✨ {displayName}는 {breed.name}의 전형적인 성격과 일치해요! {breed.name}다운 매력이 가득한 아이네요.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-purple-600">
                      {breed.name}의 평균 타입은 {breed.typicalType} ({breedTypicalResult.nickname})
                    </span>
                    인데, {displayName}는 <span className="font-medium text-[#E879A4]">{type} ({result.nickname})</span>으로 나왔어요.
                    같은 {breed.name}라도 각자의 개성이 있답니다!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {ownerMbti ? (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-sm font-bold text-purple-700 mb-3">
            💜 {ownerMbti} {displayOwner} × {result.code} {displayName}
          </h3>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-sm">
              <span className="text-lg font-black text-purple-600">{ownerMbti}</span>
              <span className="text-xs text-gray-500 mt-0.5">{displayOwner}</span>
            </div>
            <div className="text-2xl">💕</div>
            <div className="w-24 bg-white rounded-2xl py-3 px-2 flex flex-col items-center shadow-sm">
              <span className="text-lg font-black text-[#E879A4]">{result.code}</span>
              <span className="text-xs text-gray-500 mt-0.5">{displayName}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {generateSynergyMessage(type, ownerMbti, displayName, ownerName || undefined)}
          </p>
          {ownerMatch && ownerMbti === ownerMatch.mbti && (
            <div className="mt-3 bg-white/70 rounded-xl p-3">
              <p className="text-sm text-purple-600 font-medium">
                ✨ {displayOwner}은(는) {displayName}에게 가장 이상적인 MBTI 타입이에요! 최고의 궁합이에요!
              </p>
            </div>
          )}
        </div>
      ) : ownerMatch ? (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-sm font-bold text-purple-700 mb-3">
            💜 {displayName}와 찰떡인 견주 MBTI
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-xl font-black text-purple-600">{ownerMatch.mbti}</span>
            </div>
            <div>
              <p className="font-bold text-sm">{ownerMatch.title}</p>
              <p className="text-xs text-gray-500">{ownerMatch.mbti} 유형</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {fillName(ownerMatch.reason, displayName)}
          </p>
        </div>
      ) : null}

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => { store.reset(); router.push("/profile"); }}
          className="flex-1 py-3.5 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all"
        >
          다시 테스트하기
        </button>
        <button
          onClick={() => { store.reset(); router.push("/"); }}
          className="flex-1 py-3.5 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          처음으로
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 leading-relaxed pb-8">
        이 결과는 보호자가 관찰한 {displayName}의 행동을 기반으로 한
        <br />
        재미 해석이며, 의학적·훈련적 진단이 아닙니다.
        <br />
        참고용으로 즐겨주세요 🐾
      </p>
    </div>
  );
}
