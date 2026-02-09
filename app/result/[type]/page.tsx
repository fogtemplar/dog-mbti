"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { resultData } from "@/data/results";
import { breeds } from "@/data/breeds";
import { ownerMatches, generateSynergyMessage } from "@/data/ownerMbti";
import { computeScores, getAxisPercentages, fillName } from "@/lib/calculate";
import ShareCard from "@/components/ShareCard";

export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const router = useRouter();
  const { dogName, ownerName, breedId, ownerMbti, photoUrl, answers, reset, saveToHistory } = useQuizStore();

  const result = resultData[type];
  const scores = computeScores(answers);
  const percentages = getAxisPercentages(scores);
  const breed = breeds.find((b) => b.id === breedId);
  const ownerMatch = ownerMatches[type];

  const [step, setStep] = useState(0);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <p className="text-lg font-bold mb-4">결과를 찾을 수 없어요</p>
        <button
          onClick={() => { reset(); router.push("/"); }}
          className="text-[#E879A4] underline"
        >
          처음부터 다시 하기
        </button>
      </div>
    );
  }

  const displayName = dogName || "강아지";
  const displayOwner = ownerName || "견주님";

  // 히스토리 저장 (최초 1회)
  const savedRef = useRef(false);
  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true;
      saveToHistory();
    }
  }, [result, saveToHistory]);

  // 견종 평균 타입과 현재 결과 비교
  const breedTypicalResult = breed?.typicalType ? resultData[breed.typicalType] : null;
  const isSameAsBreed = breed?.typicalType === type;

  const nextStep = () => {
    setStep((s) => {
      // ownerMbti가 없으면 step 3(궁합)을 건너뜀
      if (s === 2 && !ownerMbti) return 4;
      return s + 1;
    });
  };

  // ─── Step 0: 성향 힌트 ───
  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative overflow-hidden">
        <div className="absolute top-10 left-8 text-2xl animate-float opacity-20">🌸</div>
        <div className="absolute top-16 right-10 text-xl animate-sparkle opacity-15">✨</div>

        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            className="w-28 h-28 rounded-full object-cover border-4 border-[#E879A4]/20 mb-6 animate-scale-in"
          />
        ) : (
          <div className="text-6xl mb-6 animate-scale-in">{result.emoji}</div>
        )}

        <p className="text-sm text-gray-500 mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          분석이 끝났어요!
        </p>
        <h1 className="text-2xl font-black mb-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
            {displayName}
          </span>의 숨은 성격은...
        </h1>

        <div className="w-full max-w-xs space-y-3 mb-8">
          {result.hints.map((hint, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 text-sm text-gray-700 leading-relaxed animate-slide-up"
              style={{ animationDelay: `${0.6 + i * 0.2}s` }}
            >
              {fillName(hint, displayName)}
            </div>
          ))}
        </div>

        <button
          onClick={nextStep}
          className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "1.1s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
        >
          더 알아보기 →
        </button>
      </div>
    );
  }

  // ─── Step 1: 축별 성향 분석 ───
  if (step === 1) {
    const axisLabels = ["사교성", "감정표현", "탐험심", "행동패턴"];
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 relative overflow-hidden">
        <div className="absolute bottom-20 right-6 text-xl animate-float opacity-15">💖</div>

        <p className="text-sm text-gray-500 mb-2 animate-slide-up">
          {displayName}의 성향 분석
        </p>
        <h2 className="text-xl font-black text-center mb-8 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          이런 성향을 갖고 있어요
        </h2>

        <div className="w-full max-w-sm space-y-4 mb-8">
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

        <button
          onClick={nextStep}
          className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "1s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
        >
          결과 타입 보기 →
        </button>
      </div>
    );
  }

  // ─── Step 2: 타입 공개 ───
  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative overflow-hidden">
        <div className="absolute top-12 right-10 text-2xl animate-sparkle opacity-20">🌟</div>
        <div className="absolute bottom-28 left-8 text-xl animate-float opacity-15">🐾</div>

        <p className="text-sm text-gray-500 mb-3 animate-slide-up">
          {displayName}의 성향 타입은
        </p>

        <div className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-5xl font-black tracking-[0.2em] bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent mb-2">
            {result.code}
          </p>
        </div>

        <h2
          className="text-2xl font-black mb-2 animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          {result.emoji} {result.nickname}
        </h2>

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

        <button
          onClick={nextStep}
          className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "1.2s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
        >
          {ownerMbti ? `${displayOwner}과의 궁합은? →` : "카드 확인하기 →"}
        </button>
      </div>
    );
  }

  // ─── Step 3: 견주 궁합 ───
  if (step === 3 && ownerMbti) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative overflow-hidden">
        <div className="absolute top-14 left-6 text-2xl animate-float opacity-15">💜</div>

        <p className="text-sm text-gray-500 mb-3 animate-slide-up">
          견주 × 강아지 궁합
        </p>

        <div className="flex items-center gap-4 mb-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-md">
            <span className="text-lg font-black text-purple-600">{ownerMbti}</span>
            <span className="text-[9px] text-gray-400">{displayOwner}</span>
          </div>
          <div className="text-2xl animate-wiggle">💕</div>
          <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-md">
            <span className="text-lg font-black text-[#E879A4]">{result.code}</span>
            <span className="text-[9px] text-gray-400">{displayName}</span>
          </div>
        </div>

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

        <button
          onClick={nextStep}
          className="px-8 py-3.5 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full font-bold text-base animate-slide-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "0.8s", boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
        >
          카드 확인하기 →
        </button>
      </div>
    );
  }

  // ─── Final: 카드 + 상세 정보 ───
  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      {/* 공유 카드 */}
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
        />
      </div>

      {/* 성향 특징 + 참고 포인트 */}
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

      {/* 왜 이 타입? + 견종 비교 */}
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

      {/* 견주 궁합 (상세) */}
      {ownerMbti ? (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-sm font-bold text-purple-700 mb-3">
            💜 {ownerMbti} {displayOwner} × {result.code} {displayName}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-lg font-black text-purple-600">{ownerMbti}</span>
            </div>
            <div className="text-2xl">🤝</div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-lg font-black text-[#E879A4]">{result.code}</span>
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

      {/* 유료 CTA */}
      <div className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] rounded-2xl p-6 text-white text-center mb-6 animate-slide-up" style={{ animationDelay: "0.65s" }}>
        <p className="text-lg font-bold mb-2">🔒 심층 리포트</p>
        <p className="text-sm opacity-90 mb-4">
          {displayName}에게 딱 맞는 놀이법, 산책 팁,
          <br />
          궁합 타입 분석이 준비되어 있어요!
        </p>
        <button className="px-6 py-3 bg-white text-[#E879A4] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
          준비 중이에요 (Coming Soon)
        </button>
      </div>

      {/* 네비게이션 */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            reset();
            router.push("/profile");
          }}
          className="flex-1 py-3.5 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all"
        >
          다시 테스트하기
        </button>
        <button
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="flex-1 py-3.5 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          처음으로
        </button>
      </div>

      {/* 고지문 */}
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
