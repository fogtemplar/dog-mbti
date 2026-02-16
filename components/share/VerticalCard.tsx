import { forwardRef } from "react";
import type { CardInnerProps } from "./types";
import { AXIS_NAMES, nameWithUi, getRelationshipLine, readableAccent } from "./utils";
import StatBar from "./StatBar";

const VerticalCard = forwardRef<HTMLDivElement, CardInnerProps>(function VerticalCard(
  { dogName, nickname, code, emoji, summary, photoUrl, percentages, breedName, ownerName, ownerMbti, colors },
  ref,
) {
  const textAccent = readableAccent(colors.accent);
  return (
    <div
      ref={ref}
      data-capture-root
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      {/* 장식 */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
        opacity: 0.06, pointerEvents: "none" as const,
        background: `radial-gradient(circle at 70% 30%, ${colors.accent} 0%, transparent 70%)`,
      }} />

      {/* 히어로 섹션 */}
      {photoUrl ? (
        <div data-photo-container style={{
          position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden",
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)",
          }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 16px" }}>
            <div style={{
              fontSize: "16px", fontWeight: 700, color: "#fff",
              marginBottom: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}>
              우리 {nameWithUi(dogName)} 성격은?
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontSize: "32px", fontWeight: 900, letterSpacing: "0.2em",
                  color: "#fff", lineHeight: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}>
                  {code}
                </div>
                <div style={{
                  fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.9)",
                  marginTop: "4px", textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}>
                  {nickname} {emoji}
                </div>
              </div>
              {breedName && (
                <div style={{
                  padding: "4px 10px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: 900, color: "#fff",
                  background: "rgba(0,0,0,0.35)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}>
                  {breedName}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "32px 20px 20px", textAlign: "center" as const, position: "relative" }}>
          <div style={{
            position: "absolute", top: "12px", left: "16px",
            padding: "4px 10px", borderRadius: "999px",
            fontSize: "10px", fontWeight: 900, color: textAccent,
            background: "rgba(255,255,255,0.6)",
          }}>
            너는내운멍
          </div>
          <div style={{
            fontSize: "16px", fontWeight: 700, color: textAccent,
            marginBottom: "4px",
          }}>
            우리 {nameWithUi(dogName)} 성격은?
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "0.2em", lineHeight: 1, color: textAccent }}>
            {code}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginTop: "4px" }}>
            {nickname} {emoji}
          </div>
          {breedName && (
            <div style={{
              display: "inline-block", marginTop: "10px",
              padding: "4px 12px", borderRadius: "999px",
              fontSize: "11px", fontWeight: 900, color: textAccent,
              background: "rgba(255,255,255,0.6)",
            }}>
              {breedName}
            </div>
          )}
        </div>
      )}

      {/* 카드 바디 */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ marginBottom: "14px" }}>
          {percentages.map((p, i) => {
            const dominant = p.left.pct >= p.right.pct ? p.left : p.right;
            return (
              <div key={p.axis} style={{ marginBottom: i < percentages.length - 1 ? "8px" : "0" }}>
                <StatBar label={AXIS_NAMES[i]} pct={dominant.pct} accent={colors.accent} />
              </div>
            );
          })}
        </div>

        <div style={{
          borderRadius: "12px", padding: "12px 16px", marginBottom: "14px",
          background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
        }}>
          <p style={{ fontSize: "11px", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
            {summary}
          </p>
        </div>

        <div style={{
          borderRadius: "12px", padding: "12px 16px", marginBottom: "14px",
          background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)",
          textAlign: "center" as const,
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
            {ownerName && (
              <>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#4b5563" }}>
                  👤 {ownerName}{ownerMbti ? ` (${ownerMbti})` : ""}
                </span>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>×</span>
              </>
            )}
            <span style={{ fontSize: "12px", fontWeight: 800, color: textAccent }}>
              🐾 {dogName} ({code})
            </span>
          </div>
          {ownerName && ownerMbti && (
            <p style={{
              fontSize: "10px", color: "#6b7280", margin: "6px 0 0",
              fontWeight: 600, fontStyle: "italic" as const,
            }}>
              &ldquo;{getRelationshipLine(ownerMbti, code)}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div style={{ padding: "10px 20px 16px", textAlign: "center" as const }}>
        <span style={{
          fontSize: "15px", fontWeight: 900, letterSpacing: "0.08em",
          color: "#fff",
          textShadow: `1px 1px 0 ${colors.accent}40, -1px -1px 0 ${colors.accent}40, 1px -1px 0 ${colors.accent}40, -1px 1px 0 ${colors.accent}40, 0 1px 0 ${colors.accent}40, 0 -1px 0 ${colors.accent}40, 1px 0 0 ${colors.accent}40, -1px 0 0 ${colors.accent}40`,
        }}>
          Daeng.me
        </span>
      </div>
    </div>
  );
});

export default VerticalCard;
