"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { computeScores, getAxisPercentages } from "@/lib/calculate";
import { encodeSharePayload, percentagesToPctArray } from "@/lib/sharePayload";

export default function AnalyzingPage() {
  const router = useRouter();
  const { dogName, ownerName, breedId, ownerMbti, answers, calculateResult } = useQuizStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const code = calculateResult();
      const scores = computeScores(answers);
      const pcts = percentagesToPctArray(getAxisPercentages(scores));
      const d = encodeSharePayload({
        type: code,
        dogName: dogName || "강아지",
        ownerName: ownerName || undefined,
        breedId: breedId || undefined,
        ownerMbti: ownerMbti || undefined,
        pcts,
      });
      router.replace(`/result?d=${d}&self=1`);
    }, 2500);
    return () => clearTimeout(timer);
  }, [calculateResult, router, dogName, ownerName, breedId, ownerMbti, answers]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="relative mb-8">
        <div className="text-6xl animate-bounce-slow">🐾</div>
        <div className="absolute -top-2 -right-4 text-3xl animate-paw" style={{ animationDelay: "0.5s" }}>
          🐾
        </div>
        <div className="absolute -bottom-2 -left-4 text-2xl animate-paw" style={{ animationDelay: "1s" }}>
          🐾
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">
        <span className="text-[#E879A4]">{dogName}</span>의 성향을
        <br />
        분석하고 있어요...
      </h2>

      <p className="text-sm text-gray-500">잠시만 기다려주세요</p>

      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-[#E879A4] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
