"use client";

import { useState, useEffect } from "react";
import type { AxisPercentage } from "@/lib/calculate";

interface RadarChartProps {
  percentages: AxisPercentage[];
  ownerMbti?: string;
  ownerName?: string;
  dogName: string;
  typeCode?: string;
}

const CX = 150;
const CY = 150;
const MAX_R = 90;
const ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // top, right, bottom, left
const GRID_LEVELS = [25, 50, 75, 100];
const AXIS_NAMES = ["사교성", "활력", "탐구심", "주도성"];

function getPoint(axisIndex: number, pct: number) {
  const r = (pct / 100) * MAX_R;
  return {
    x: CX + r * Math.cos(ANGLES[axisIndex]),
    y: CY + r * Math.sin(ANGLES[axisIndex]),
  };
}

function pointsToString(pts: { x: number; y: number }[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

function ownerMbtiToRadarPcts(mbti: string): number[] {
  const ei = mbti[0] === "E" ? 75 : 25;
  const sn = mbti[1] === "S" ? 65 : 35;
  const jp = mbti[3] === "P" ? 75 : 25;
  const tf = mbti[2] === "T" ? 70 : 30;
  return [ei, sn, jp, tf]; // 사교성, 활력, 탐구심, 주도성
}

export default function RadarChart({
  percentages,
  ownerMbti,
  ownerName,
  dogName,
  typeCode,
}: RadarChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dogPcts = percentages.map((p) => p.left.pct);
  const ownerPcts = ownerMbti ? ownerMbtiToRadarPcts(ownerMbti) : null;

  const dogPoints = dogPcts.map((pct, i) => getPoint(i, pct));
  const ownerPoints = ownerPcts
    ? ownerPcts.map((pct, i) => getPoint(i, pct))
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        viewBox="-40 -10 380 335"
        style={{ width: "100%", maxWidth: 280 }}
        role="img"
        aria-label="성향 레이더 차트"
      >
        {/* Grid diamonds */}
        {GRID_LEVELS.map((level) => {
          const pts = ANGLES.map((_, i) => getPoint(i, level));
          return (
            <polygon
              key={level}
              points={pointsToString(pts)}
              fill="none"
              stroke={level === 50 ? "#d1d5db" : "#e5e7eb"}
              strokeWidth={level === 50 ? 1.2 : 0.8}
              strokeDasharray={level === 50 ? "none" : "4 3"}
            />
          );
        })}

        {/* Axis lines */}
        {ANGLES.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={end.x}
              y2={end.y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          );
        })}

        {/* Percentage labels on grid */}
        {GRID_LEVELS.filter((l) => l !== 100).map((level) => {
          const pt = getPoint(0, level);
          return (
            <text
              key={level}
              x={pt.x + 4}
              y={pt.y + 2}
              fontSize="11"
              fontWeight="600"
              fill="#a78bac"
              textAnchor="start"
            >
              {level}
            </text>
          );
        })}

        {/* Owner polygon (behind dog) */}
        {ownerPoints && (
          <g
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: `scale(${mounted ? 1 : 0})`,
              transition:
                "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s",
            }}
          >
            <polygon
              points={pointsToString(ownerPoints)}
              fill="rgba(192, 132, 252, 0.15)"
              stroke="#C084FC"
              strokeWidth={2}
              strokeDasharray="6 3"
            />
            {ownerPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={3}
                fill="#C084FC"
              />
            ))}
          </g>
        )}

        {/* Dog polygon */}
        <g
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transform: `scale(${mounted ? 1 : 0})`,
            transition:
              "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s",
          }}
        >
          <polygon
            points={pointsToString(dogPoints)}
            fill="rgba(232, 121, 164, 0.2)"
            stroke="#E879A4"
            strokeWidth={2.5}
          />
          {dogPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#E879A4"
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
        </g>

        {/* Axis labels */}
        {/* Top: 사교성 */}
        <text x={CX} y={5} fontSize="16" fontWeight="900" fill="#374151" textAnchor="middle">
          {AXIS_NAMES[0]}
        </text>
        <text x={CX} y={22} fontSize="12" fontWeight="600" fill="#7c7c8a" textAnchor="middle">
          {percentages[0]?.left.label} ↔ {percentages[0]?.right.label}
        </text>

        {/* Right: 활력 */}
        <text x={290} y={CY - 6} fontSize="16" fontWeight="900" fill="#374151" textAnchor="middle">
          {AXIS_NAMES[1]}
        </text>
        <text x={290} y={CY + 11} fontSize="12" fontWeight="600" fill="#7c7c8a" textAnchor="middle">
          {percentages[1]?.left.label} ↔ {percentages[1]?.right.label}
        </text>

        {/* Bottom: 탐구심 */}
        <text x={CX} y={280} fontSize="12" fontWeight="600" fill="#7c7c8a" textAnchor="middle">
          {percentages[2]?.left.label} ↔ {percentages[2]?.right.label}
        </text>
        <text x={CX} y={298} fontSize="16" fontWeight="900" fill="#374151" textAnchor="middle">
          {AXIS_NAMES[2]}
        </text>

        {/* Left: 주도성 */}
        <text x={10} y={CY - 6} fontSize="16" fontWeight="900" fill="#374151" textAnchor="middle">
          {AXIS_NAMES[3]}
        </text>
        <text x={10} y={CY + 11} fontSize="12" fontWeight="600" fill="#7c7c8a" textAnchor="middle">
          {percentages[3]?.left.label} ↔ {percentages[3]?.right.label}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#E879A4]" />
          <span className="text-xs font-semibold text-gray-600">{dogName}{typeCode && ` (${typeCode})`}</span>
        </div>
        {ownerMbti && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C084FC]" />
            <span className="text-xs font-semibold text-gray-600">{ownerName || "견주님"} ({ownerMbti})</span>
          </div>
        )}
      </div>
    </div>
  );
}
