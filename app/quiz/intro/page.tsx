"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

export default function QuizIntroPage() {
  // 전체 퀴즈 이미지 미리 로드
  useEffect(() => {
    for (let i = 1; i <= 20; i++) {
      const img = new Image();
      img.src = `/quiz/${i}.png`;
    }
  }, []);
  const router = useRouter();
  const dogName = useQuizStore((s) => s.dogName);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-12 right-8 text-2xl animate-float opacity-15">🌸</div>
      <div className="absolute bottom-24 left-6 text-xl animate-sparkle opacity-20">✨</div>

      <div className="text-5xl mb-6 animate-wiggle">📋</div>
      <h1 className="text-2xl font-black mb-3">
        <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">{dogName}</span>의
        <br />
        숨은 성향을 찾아볼까요?
      </h1>

      <div className="w-full bg-white/80 backdrop-blur rounded-3xl p-5 mt-6 mb-6 text-left space-y-3 border border-pink-100">
        <div className="flex items-start gap-3">
          <span className="text-xl w-7 text-center shrink-0">💖</span>
          <div>
            <p className="font-semibold text-sm">정답은 없어요!</p>
            <p className="text-xs text-gray-500">
              평소 관찰한 대로 편하게 골라주세요
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl w-7 text-center shrink-0">📝</span>
          <div>
            <p className="font-semibold text-sm">총 20문항</p>
            <p className="text-xs text-gray-500">
              각 질문마다 A 또는 B를 선택하면 돼요
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl w-7 text-center shrink-0">⏱</span>
          <div>
            <p className="font-semibold text-sm">약 3분 소요</p>
            <p className="text-xs text-gray-500">
              부담 없이 가볍게 시작해 보세요
            </p>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-8 w-full">
        <p className="text-xs text-pink-600 leading-relaxed">
          🐾 이 테스트는 보호자의 관찰을 기반으로 한{" "}
          <strong>재미 성향 해석</strong>이에요. 의학적·훈련적 진단이 아니니
          참고용으로 즐겨주세요!
        </p>
      </div>

      <button
        onClick={() => router.push("/quiz/play")}
        className="w-full py-4 bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white rounded-full text-lg font-bold hover:shadow-lg hover:shadow-pink-200/50 active:scale-[0.98] transition-all"
        style={{ boxShadow: "0 4px 20px rgba(232,121,164,0.3)" }}
      >
        시작! 🐶
      </button>
    </div>
  );
}
