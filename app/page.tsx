"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";
import TossLoginButton from "@/components/TossLoginButton";

export default function LandingPage() {
  const reset = useQuizStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="ait-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-8 left-6 text-3xl animate-float opacity-20" style={{ animationDelay: "0s" }}>🐾</div>
      <div className="absolute top-20 right-8 text-2xl animate-float opacity-15" style={{ animationDelay: "0.5s" }}>💖</div>
      <div className="absolute top-40 left-10 text-xl animate-sparkle opacity-20" style={{ animationDelay: "1s" }}>✨</div>
      <div className="absolute bottom-32 right-6 text-3xl animate-float opacity-15" style={{ animationDelay: "1.5s" }}>🐾</div>
      <div className="absolute bottom-48 left-8 text-2xl animate-sparkle opacity-20" style={{ animationDelay: "0.8s" }}>🌸</div>
      <div className="absolute bottom-20 right-12 text-xl animate-float opacity-15" style={{ animationDelay: "2s" }}>💕</div>

      {/* 로고 영역 */}
      <div className="relative mb-6">
        <Image
          src="/logo.png"
          alt="너는내운멍"
          width={800}
          height={450}
          className="w-48 h-auto mx-auto animate-bounce-slow"
          draggable={false}
          priority
        />
        <div className="absolute -top-1 -right-3 text-2xl animate-sparkle">✨</div>
        <div className="absolute -bottom-1 -left-3 text-xl animate-sparkle" style={{ animationDelay: "0.7s" }}>💖</div>
      </div>
      <p className="text-lg font-semibold text-gray-700 mb-1">
        우리 강아지 성향 테스트
      </p>
      <p className="text-sm text-[#8B7A8E] mb-8 leading-relaxed">
        20개의 관찰 질문으로 알아보는
        <br />
        우리 아이만의 성향 타입 💕
      </p>

      <TossLoginButton />

      <div className="mt-5 text-xs text-[#B8A0BC]">
        <span>⏱ 약 3분 소요</span>
      </div>

      <Link
        href="/history"
        className="ait-touch-target mt-3 px-4 text-sm text-[#8B7A8E] hover:text-[#C084FC] font-medium transition-colors flex items-center justify-center"
      >
        📋 이전 테스트 기록 보기
      </Link>

      <p className="mt-10 text-[11px] text-[#C4B0C8] leading-relaxed px-4">
        본 테스트는 보호자의 관찰을 기반으로 한 재미 해석이며,
        <br />
        의학적·훈련적 진단 목적이 아닙니다. 🐾
      </p>
    </div>
  );
}
