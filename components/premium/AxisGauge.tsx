"use client";

import { useState, useEffect } from "react";

interface AxisGaugeProps {
  axisName: string;
  leftLabel: string;
  rightLabel: string;
  leftPct: number;
}

function getLevelText(leftLabel: string, rightLabel: string, pct: number) {
  if (pct >= 80) return `매우 ${leftLabel}`;
  if (pct >= 65) return `${leftLabel} 성향`;
  if (pct >= 50) return `약간 ${leftLabel}`;
  if (pct >= 35) return `약간 ${rightLabel}`;
  if (pct >= 20) return `${rightLabel} 성향`;
  return `매우 ${rightLabel}`;
}

function getLevelColor(pct: number) {
  if (pct >= 65 || pct <= 35) return "text-[#E879A4]";
  return "text-[#B8A0BC]";
}

export default function AxisGauge({
  axisName,
  leftLabel,
  rightLabel,
  leftPct,
}: AxisGaugeProps) {
  const [animatedPct, setAnimatedPct] = useState(50);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(leftPct), 150);
    return () => clearTimeout(t);
  }, [leftPct]);

  const levelText = getLevelText(leftLabel, rightLabel, leftPct);
  const levelColor = getLevelColor(leftPct);

  // 마커 위치: 0%(왼쪽) → 100%(오른쪽) 자연스러운 방향
  const markerPos = animatedPct;
  const clampedPct = Math.max(12, Math.min(88, markerPos));

  // 퍼센트 라벨 정렬: 끝쪽에서 밀려나지 않도록
  const pctAlign = leftPct >= 85 ? "right" : leftPct <= 15 ? "left" : "center";
  const pctTransform =
    pctAlign === "right" ? "translateX(-80%)" : pctAlign === "left" ? "translateX(-20%)" : "translateX(-50%)";

  return (
    <div>
      {/* Header: axis name + level */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-600">{axisName}</span>
        <span className={`text-[11px] font-medium ${levelColor}`}>
          {levelText}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative">
        <div className="w-full h-3 rounded-full overflow-hidden relative"
          style={{
            background: "linear-gradient(90deg, #D8B4FE 0%, #E8D5F5 30%, #F3E8FF 50%, #F9D1E0 70%, #F5A3C4 100%)",
          }}
        >
          {/* Reference lines at 20%, 40%, 60%, 80% */}
          {[20, 40, 60, 80].map((pos) => (
            <div
              key={pos}
              className="absolute top-0 h-full"
              style={{
                left: `${pos}%`,
                width: "1px",
                background: "rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </div>

        {/* Marker */}
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{
            left: `${clampedPct}%`,
            transform: "translateX(-50%)",
            transition: "left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Vertical line + dot */}
          <div className="w-0.5 h-3 bg-gray-700 rounded-full" />
          <div className="w-2 h-2 bg-gray-700 rounded-full -mt-0.5 border border-white" />
          {/* Percentage label */}
          <span
            className="text-[10px] font-bold text-gray-700 mt-0.5 whitespace-nowrap"
            style={{ transform: pctTransform }}
          >
            {leftPct}%
          </span>
        </div>
      </div>

      {/* Bottom labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">{rightLabel}</span>
        <span className="text-[10px] text-gray-400">{leftLabel}</span>
      </div>
    </div>
  );
}
