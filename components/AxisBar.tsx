"use client";

interface AxisBarProps {
  leftLabel: string;
  rightLabel: string;
  leftPct: number;
  rightPct: number;
}

export default function AxisBar({ leftLabel, rightLabel, leftPct, rightPct }: AxisBarProps) {
  const isLeftDominant = leftPct >= rightPct;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className={isLeftDominant ? "text-[#E879A4] font-bold" : "text-gray-400"}>
          {leftLabel} {leftPct}%
        </span>
        <span className={!isLeftDominant ? "text-[#C084FC] font-bold" : "text-gray-400"}>
          {rightPct}% {rightLabel}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
        <div
          className="h-full transition-all duration-500 rounded-l-full"
          style={{ width: `${leftPct}%`, background: "linear-gradient(90deg, #E879A4, #F5A3C4)" }}
        />
        <div
          className="h-full bg-[#F3E8FF] transition-all duration-500 rounded-r-full"
          style={{ width: `${rightPct}%` }}
        />
      </div>
    </div>
  );
}
