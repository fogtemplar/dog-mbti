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
      <h2 className="text-lg font-bold text-center mb-8 leading-relaxed">
        {questionText}
      </h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSelect("A")}
          className={`w-full p-5 rounded-2xl text-left text-base font-medium transition-all duration-200 border-2 ${
            selected === "A"
              ? "border-[#E879A4] bg-[#E879A4]/10 scale-[0.98]"
              : "border-gray-200 bg-white hover:border-[#E879A4]/50 active:scale-[0.98]"
          }`}
        >
          <span className="inline-block w-7 h-7 rounded-full bg-[#E879A4]/10 text-[#E879A4] text-center text-sm leading-7 mr-3 font-bold">
            A
          </span>
          {choiceA}
        </button>
        <button
          onClick={() => handleSelect("B")}
          className={`w-full p-5 rounded-2xl text-left text-base font-medium transition-all duration-200 border-2 ${
            selected === "B"
              ? "border-[#C084FC] bg-[#C084FC]/10 scale-[0.98]"
              : "border-gray-200 bg-white hover:border-[#C084FC]/50 active:scale-[0.98]"
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
