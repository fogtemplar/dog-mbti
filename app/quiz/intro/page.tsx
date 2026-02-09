"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

export default function QuizIntroPage() {
  const router = useRouter();
  const dogName = useQuizStore((s) => s.dogName);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="text-5xl mb-6">📋</div>
      <h1 className="text-2xl font-black mb-3">
        <span className="text-[#6C63FF]">{dogName}</span>의
        <br />
        숨은 성향을 찾아볼까요?
      </h1>

      <div className="w-full bg-white rounded-2xl p-5 mt-6 mb-6 text-left space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-semibold text-sm">정답은 없어요!</p>
            <p className="text-xs text-gray-500">
              평소 관찰한 대로 편하게 골라주세요
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">📝</span>
          <div>
            <p className="font-semibold text-sm">총 20문항</p>
            <p className="text-xs text-gray-500">
              각 질문마다 A 또는 B를 선택하면 돼요
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">⏱</span>
          <div>
            <p className="font-semibold text-sm">약 3분 소요</p>
            <p className="text-xs text-gray-500">
              부담 없이 가볍게 시작해 보세요
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 w-full">
        <p className="text-xs text-amber-700 leading-relaxed">
          🐾 이 테스트는 보호자의 관찰을 기반으로 한{" "}
          <strong>재미 성향 해석</strong>이에요. 의학적·훈련적 진단이 아니니
          참고용으로 즐겨주세요!
        </p>
      </div>

      <button
        onClick={() => router.push("/quiz/play")}
        className="w-full py-4 bg-[#6C63FF] text-white rounded-2xl text-lg font-bold hover:bg-[#5B54E6] active:scale-[0.98] transition-all"
      >
        시작!
      </button>
    </div>
  );
}
