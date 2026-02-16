import { readableAccent } from "./utils";

export default function StatBar({ label, pct, accent, barHeight = 10, fontSize = 10, labelWidth = 40, pctWidth = 36 }: {
  label: string; pct: number; accent: string;
  barHeight?: number; fontSize?: number; labelWidth?: number; pctWidth?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{
        fontSize: `${fontSize}px`, fontWeight: 700, color: "#4b5563",
        width: `${labelWidth}px`, textAlign: "right" as const, flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{
        flex: 1, height: `${barHeight}px`, borderRadius: "999px",
        overflow: "hidden", background: "rgba(255,255,255,0.4)",
      }}>
        <div style={{
          height: "100%", borderRadius: "999px",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${accent}, #C084FC)`,
        }} />
      </div>
      <span style={{
        fontSize: `${fontSize}px`, fontWeight: 900,
        width: `${pctWidth}px`, flexShrink: 0, color: readableAccent(accent),
      }}>
        {pct}%
      </span>
    </div>
  );
}
