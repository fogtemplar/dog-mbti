"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { allQuestions } from "@/data/questions";
import { fillName } from "@/lib/calculate";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

export default function QuizPlayPage() {
  const router = useRouter();
  const { dogName, currentIndex, selectAnswer, goBack } = useQuizStore();

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

      <div className="mt-4 h-10 flex items-center justify-center">
        {isStageTransition && (
          <div className="bg-[#6C63FF]/10 rounded-xl px-4 py-2 animate-fade-in">
            <p className="text-sm font-medium text-[#6C63FF]">
              잘하고 있어요! 조금만 더 💪
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
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
