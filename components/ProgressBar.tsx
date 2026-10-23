"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full" aria-label={`진행률 ${pct}%`}>
      <div className="flex justify-between text-[13px] font-semibold text-[#6B7684] mb-2">
        <span>{current + 1}번째 질문</span>
        <span>{total}개 중 {current + 1}개</span>
      </div>
      <div className="w-full h-2 bg-[#E5E8EB] rounded-full overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E879A4, #C084FC)" }}
        />
      </div>
    </div>
  );
}
