"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { resultData } from "@/data/results";
import { breeds } from "@/data/breeds";
import { ownerMatches } from "@/data/ownerMbti";
import { computeScores, getAxisPercentages, fillName } from "@/lib/calculate";
import AxisBar from "@/components/AxisBar";
import ShareCard from "@/components/ShareCard";

export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const router = useRouter();
  const { dogName, breedId, photoUrl, answers, reset } = useQuizStore();

  const result = resultData[type];
  const scores = computeScores(answers);
  const percentages = getAxisPercentages(scores);
  const breed = breeds.find((b) => b.id === breedId);
  const ownerMatch = ownerMatches[type];

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <p className="text-lg font-bold mb-4">결과를 찾을 수 없어요</p>
        <button
          onClick={() => { reset(); router.push("/"); }}
          className="text-[#6C63FF] underline"
        >
          처음부터 다시 하기
        </button>
      </div>
    );
  }

  const displayName = dogName || "강아지";

  // 견종 평균 타입과 현재 결과 비교
  const breedTypicalResult = breed?.typicalType ? resultData[breed.typicalType] : null;
  const isSameAsBreed = breed?.typicalType === type;

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      {/* 타입 카드 */}
      <div className="text-center mb-8 animate-fade-in">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-[#6C63FF]/20"
          />
        ) : (
          <div className="text-5xl mb-3">{result.emoji}</div>
        )}
        <p className="text-sm text-gray-500 mb-1">{displayName}의 성향 타입</p>
        <p className="text-3xl font-black tracking-widest text-[#6C63FF] mb-2">
          {result.code}
        </p>
        <h1 className="text-2xl font-black">{result.nickname}</h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {fillName(result.summary, displayName)}
        </p>
      </div>

      {/* 축별 성향 바 */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-500 mb-4">성향 분석</h3>
        {percentages.map((p) => (
          <AxisBar
            key={p.axis}
            leftLabel={p.left.label}
            rightLabel={p.right.label}
            leftPct={p.left.pct}
            rightPct={p.right.pct}
          />
        ))}
      </div>

      {/* 성향 특징 */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-500 mb-3">
          {displayName}의 성향 특징
        </h3>
        <ul className="space-y-3">
          {result.traits.map((trait, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="text-[#6C63FF] mt-0.5">●</span>
              {fillName(trait, displayName)}
            </li>
          ))}
        </ul>
      </div>

      {/* 견종 평균 성격 비교 */}
      {breed && breed.id !== "other" && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-indigo-700 mb-3">
            🐕 {breed.name}의 평균 성격과 비교
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {breed.personality}
          </p>
          {breed.typicalType && breedTypicalResult && (
            <div className="bg-white/70 rounded-xl p-3 mt-2">
              {isSameAsBreed ? (
                <p className="text-sm text-indigo-600 font-medium">
                  ✨ {displayName}는 {breed.name}의 전형적인 성격과 일치해요! {breed.name}다운 매력이 가득한 아이네요.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-indigo-600">
                    {breed.name}의 평균 타입은 {breed.typicalType} ({breedTypicalResult.nickname})
                  </span>
                  인데, {displayName}는 <span className="font-medium text-[#6C63FF]">{type} ({result.nickname})</span>으로 나왔어요.
                  같은 {breed.name}라도 각자의 개성이 있답니다!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 주의 포인트 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-amber-700 mb-3">참고 포인트</h3>
        <ul className="space-y-2">
          {result.cautions.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800 leading-relaxed">
              <span>⚠️</span>
              {fillName(c, displayName)}
            </li>
          ))}
        </ul>
      </div>

      {/* 왜 이 타입? */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-500 mb-3">
          왜 이 타입이 나왔을까?
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {fillName(result.reasoning, displayName)}
        </p>
      </div>

      {/* 어울리는 견주 MBTI */}
      {ownerMatch && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6">
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
      )}

      {/* 공유 카드 */}
      <div className="mb-6">
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
          ownerMbti={ownerMatch?.mbti}
        />
      </div>

      {/* 유료 CTA */}
      <div className="bg-gradient-to-r from-[#6C63FF] to-[#8B85FF] rounded-2xl p-6 text-white text-center mb-6">
        <p className="text-lg font-bold mb-2">🔒 심층 리포트</p>
        <p className="text-sm opacity-90 mb-4">
          {displayName}에게 딱 맞는 놀이법, 산책 팁,
          <br />
          궁합 타입 분석이 준비되어 있어요!
        </p>
        <button className="px-6 py-3 bg-white text-[#6C63FF] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
          준비 중이에요 (Coming Soon)
        </button>
      </div>

      {/* 다시하기 */}
      <button
        onClick={() => {
          reset();
          router.push("/");
        }}
        className="text-center text-sm text-gray-400 hover:text-gray-600 mb-4"
      >
        다시 테스트하기
      </button>

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
