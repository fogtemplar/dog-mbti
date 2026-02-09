"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";

export default function LandingPage() {
  const reset = useQuizStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="animate-bounce-slow text-7xl mb-6">🐾</div>
      <h1 className="text-3xl font-black mb-3">
        멍<span className="text-[#6C63FF]">BTI</span>
      </h1>
      <p className="text-lg font-semibold text-gray-700 mb-2">
        우리 강아지 성향 테스트
      </p>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        20개의 관찰 질문으로 알아보는
        <br />
        우리 아이만의 성향 타입
      </p>

      <Link
        href="/profile"
        className="w-full py-4 bg-[#6C63FF] text-white rounded-2xl text-lg font-bold hover:bg-[#5B54E6] active:scale-[0.98] transition-all"
      >
        우리 강아지 성향 알아보기
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span>⏱ 약 3분 소요</span>
        <span>·</span>
        <span>무료</span>
      </div>

      <p className="mt-12 text-xs text-gray-400 leading-relaxed px-4">
        본 테스트는 보호자의 관찰을 기반으로 한 재미 해석이며,
        <br />
        의학적·훈련적 진단 목적이 아닙니다.
      </p>
    </div>
  );
}
