"use client";

import { useState } from "react";

interface QuestionCardProps {
  questionText: string;
  choiceA: string;
  choiceB: string;
  onSelect: (choice: "A" | "B") => void;
}

export default function QuestionCard({
  questionText,
  choiceA,
  choiceB,
  onSelect,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<"A" | "B" | null>(null);

  const handleSelect = (choice: "A" | "B") => {
    setSelected(choice);
    setTimeout(() => {
      onSelect(choice);
      setSelected(null);
    }, 300);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-7 leading-relaxed text-[#191F28]">
        {questionText}
      </h2>
      <div className="flex flex-col gap-3" role="group" aria-label="답변 선택">
        <button
          data-testid="choice-a"
          onClick={() => handleSelect("A")}
          aria-pressed={selected === "A"}
          disabled={selected !== null}
          className={`ait-touch-target w-full p-5 rounded-[20px] text-left text-base font-medium transition-all duration-200 border ${
            selected === "A"
              ? "border-[#E879A4] bg-[#FFF0F5] scale-[0.98] shadow-sm"
              : "border-[#E5E8EB] bg-white hover:border-[#E879A4]/50 active:scale-[0.98] shadow-[0_5px_18px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="inline-block w-7 h-7 rounded-full bg-[#E879A4]/10 text-[#E879A4] text-center text-sm leading-7 mr-3 font-bold">
            A
          </span>
          {choiceA}
        </button>
        <button
          data-testid="choice-b"
          onClick={() => handleSelect("B")}
          aria-pressed={selected === "B"}
          disabled={selected !== null}
          className={`ait-touch-target w-full p-5 rounded-[20px] text-left text-base font-medium transition-all duration-200 border ${
            selected === "B"
              ? "border-[#A78BFA] bg-[#F5F0FF] scale-[0.98] shadow-sm"
              : "border-[#E5E8EB] bg-white hover:border-[#A78BFA]/50 active:scale-[0.98] shadow-[0_5px_18px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="inline-block w-7 h-7 rounded-full bg-[#C084FC]/10 text-[#C084FC] text-center text-sm leading-7 mr-3 font-bold">
            B
          </span>
          {choiceB}
        </button>
      </div>
    </div>
  );
}
