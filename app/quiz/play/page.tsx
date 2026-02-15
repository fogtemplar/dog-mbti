"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { allQuestions } from "@/data/questions";
import { fillName } from "@/lib/calculate";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

/** 다음 이미지를 미리 로드 */
function usePreloadImages(currentIndex: number) {
  useEffect(() => {
    const toPreload = [currentIndex + 1, currentIndex + 2];
    toPreload.forEach((i) => {
      if (i >= 0 && i < allQuestions.length) {
        const img = new Image();
        img.src = `/quiz/${i + 1}.png`;
      }
    });
  }, [currentIndex]);
}

export default function QuizPlayPage() {
  const router = useRouter();
  const { dogName, currentIndex, selectAnswer, goBack } = useQuizStore();

  usePreloadImages(currentIndex);

  const question = allQuestions[currentIndex];
  const isLast = currentIndex === allQuestions.length - 1;
  const isStageTransition = currentIndex === 12;

  const handleSelect = (choice: "A" | "B") => {
    const value = choice === "A" ? question.choiceA.value : question.choiceB.value;
    selectAnswer(question.id, question.axis, value);

    if (isLast) {
      router.push("/analyzing");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      <ProgressBar current={currentIndex} total={allQuestions.length} />

      <div className="h-10 flex items-center justify-center">
        {isStageTransition && (
          <div className="bg-[#E879A4]/10 rounded-xl px-4 py-2 animate-fade-in">
            <p className="text-sm font-medium text-[#E879A4]">
              잘하고 있어요! 조금만 더 💪
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* 질문 일러스트 */}
        <div className="mb-4 flex justify-center animate-fade-in" key={`illust-${question.id}`}>
          <img
            src={`/quiz/${currentIndex + 1}.png`}
            alt=""
            className="max-w-full h-auto drop-shadow-md"
            draggable={false}
          />
        </div>

        <QuestionCard
          key={question.id}
          questionText={fillName(question.text, dogName)}
          choiceA={question.choiceA.label}
          choiceB={question.choiceB.label}
          onSelect={handleSelect}
        />
      </div>

      {currentIndex > 0 && (
        <button
          onClick={goBack}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 이전 질문
        </button>
      )}
    </div>
  );
}
