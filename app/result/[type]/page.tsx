"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { resultData } from "@/data/results";
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
  const { dogName, photoUrl, answers, reset } = useQuizStore();

  const result = resultData[type];
  const scores = computeScores(answers);
  const percentages = getAxisPercentages(scores);

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
