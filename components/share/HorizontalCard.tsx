import { forwardRef } from "react";
import type { CardInnerProps } from "./types";
import { AXIS_NAMES, nameWithUi, getRelationshipLine, readableAccent } from "./utils";
import StatBar from "./StatBar";

const HorizontalCard = forwardRef<HTMLDivElement, CardInnerProps>(function HorizontalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  const textAccent = readableAccent(colors.accent);
  return (
    <div
      ref={ref}
      data-capture-root
      style={{
        width: "100%",
        maxWidth: "600px",
        minWidth: "340px",
        flexShrink: 0,
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: "140px", height: "140px",
        opacity: 0.06, pointerEvents: "none" as const,
        background: `radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      <div style={{ display: "flex" }}>
        {/* 좌측: 사진 */}
        <div data-photo-container style={{
          width: "35%", position: "relative", flexShrink: 0, minHeight: "180px",
          overflow: "hidden",
          ...(photoUrl ? {
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : {}),
        }}>
          {photoUrl ? (
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: "60px",
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
            }} />
          ) : (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
              background: `${colors.accent}10`,
            }}>
              <span style={{ fontSize: "48px", marginBottom: "4px" }}>{emoji}</span>
              <span style={{
                fontSize: "9px", fontWeight: 900, color: textAccent,
                background: "rgba(255,255,255,0.6)",
                padding: "3px 8px", borderRadius: "999px",
                marginTop: "4px",
              }}>
                너는내운멍
              </span>
            </div>
          )}
        </div>

        {/* 우측: 정보 */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
          padding: "14px 16px", minWidth: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: textAccent, marginBottom: "2px" }}>
                  우리 {nameWithUi(dogName)} 성격은?
                </div>
                <div style={{
                  fontSize: "22px", fontWeight: 900, letterSpacing: "0.15em",
                  lineHeight: 1, color: textAccent,
                }}>
                  {code}
                </div>
              </div>
              {breedName && (
                <div style={{
                  padding: "3px 8px", borderRadius: "999px",
                  fontSize: "9px", fontWeight: 900,
                  color: textAccent, background: "rgba(255,255,255,0.5)", flexShrink: 0,
                }}>
                  {breedName}
                </div>
              )}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1f2937" }}>
              {nickname} {emoji}
            </div>
          </div>

          <div style={{ margin: "10px 0" }}>
            {percentages.map((p, i) => {
              const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
              return (
                <div key={p.axis} style={{ marginBottom: i < percentages.length - 1 ? "5px" : "0" }}>
                  <StatBar
                    label={AXIS_NAMES[i]}
                    pct={dominant.pct}
                    accent={colors.accent}
                    barHeight={7}
                    fontSize={10}
                    labelWidth={40}
                    pctWidth={32}
                  />
                </div>
              );
            })}
          </div>

          <div>
            <div style={{
              borderRadius: "10px", padding: "8px 12px", marginBottom: "8px",
              background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
            }}>
              <p style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                {summary}
              </p>
            </div>
            <div style={{
              borderRadius: "10px", padding: "8px 10px", marginBottom: "8px",
              background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
              textAlign: "center" as const,
            }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap" as const }}>
                {ownerName && (
                  <>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#4b5563" }}>
                      👤 {ownerName}{ownerMbti ? ` (${ownerMbti})` : ""}
                    </span>
                    <span style={{ fontSize: "9px", color: "#9ca3af" }}>×</span>
                  </>
                )}
                <span style={{ fontSize: "10px", fontWeight: 800, color: textAccent }}>
                  🐾 {dogName} ({code})
                </span>
              </div>
              {ownerName && ownerMbti && (
                <p style={{
                  fontSize: "9px", color: "#6b7280", margin: "4px 0 0",
                  fontWeight: 600, fontStyle: "italic" as const,
                }}>
                  &ldquo;{getRelationshipLine(ownerMbti, code)}&rdquo;
                </p>
              )}
            </div>
            <div style={{ textAlign: "center" as const }}>
              <span style={{
                fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em",
                color: "#fff",
                textShadow: `1px 1px 0 ${colors.accent}40, -1px -1px 0 ${colors.accent}40, 1px -1px 0 ${colors.accent}40, -1px 1px 0 ${colors.accent}40, 0 1px 0 ${colors.accent}40, 0 -1px 0 ${colors.accent}40, 1px 0 0 ${colors.accent}40, -1px 0 0 ${colors.accent}40`,
              }}>
                Daeng.me
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HorizontalCard;
