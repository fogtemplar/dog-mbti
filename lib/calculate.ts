import type { Axis } from "@/data/questions";

export interface AxisScore {
  SL: { S: number; L: number };
  HC: { H: number; C: number };
  XG: { X: number; G: number };
  BA: { B: number; A: number };
}

export interface Answer {
  questionId: string;
  axis: Axis;
  selectedValue: string;
}

export function initScores(): AxisScore {
  return {
    SL: { S: 0, L: 0 },
    HC: { H: 0, C: 0 },
    XG: { X: 0, G: 0 },
    BA: { B: 0, A: 0 },
  };
}

export function computeScores(answers: Answer[]): AxisScore {
  const scores = initScores();
  for (const a of answers) {
    const axis = scores[a.axis];
    const key = a.selectedValue as keyof typeof axis;
    if (key in axis) {
      (axis as Record<string, number>)[key] += 1;
    }
  }
  return scores;
}

export function calculateType(scores: AxisScore): string {
  const sl = scores.SL.S >= scores.SL.L ? "S" : "L";
  const hc = scores.HC.H >= scores.HC.C ? "H" : "C";
  const xg = scores.XG.X >= scores.XG.G ? "X" : "G";
  const ba = scores.BA.B >= scores.BA.A ? "B" : "A";
  return `${sl}${hc}${xg}${ba}`;
}

export interface AxisPercentage {
  axis: string;
  left: { label: string; pct: number };
  right: { label: string; pct: number };
}

const axisLabels: Record<string, [string, string]> = {
  SL: ["사교적", "독립적"],
  HC: ["활발", "차분"],
  XG: ["호기심", "루틴"],
  BA: ["주도", "순응"],
};

export function getAxisPercentages(scores: AxisScore): AxisPercentage[] {
  return (Object.entries(scores) as [keyof AxisScore, Record<string, number>][]).map(
    ([axis, vals]) => {
      const keys = Object.keys(vals);
      const total = vals[keys[0]] + vals[keys[1]];
      const [leftLabel, rightLabel] = axisLabels[axis];
      return {
        axis,
        left: { label: leftLabel, pct: total > 0 ? Math.round((vals[keys[0]] / total) * 100) : 50 },
        right: { label: rightLabel, pct: total > 0 ? Math.round((vals[keys[1]] / total) * 100) : 50 },
      };
    }
  );
}

export function fillName(text: string, name: string): string {
  return text.replaceAll("{name}", name);
}
