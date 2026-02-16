export const AXIS_NAMES = ["사교성", "활동성", "호기심", "주도성"];

export function nameWithUi(name: string): string {
  if (!name) return "의";
  const last = name.charCodeAt(name.length - 1);
  if (last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28 !== 0) {
    return `${name}이의`;
  }
  return `${name}의`;
}

export function getRelationshipLine(ownerMbti: string, dogCode: string): string {
  if (!ownerMbti || ownerMbti.length !== 4 || !dogCode || dogCode.length !== 4) {
    return "함께하는 모든 순간이 특별한 사이";
  }
  const oE = ownerMbti[0] === "E";
  const dS = dogCode[0] === "S";
  const dH = dogCode[1] === "H";
  if (oE && dS && dH) return "함께라면 어디든 신나는 에너지 폭발 소울메이트";
  if (oE && dS && !dH) return "서로의 사교성이 빛나는 여유로운 베스트 파트너";
  if (oE && !dS && dH) return "밝은 보호자와 독립적인 아이의 활기찬 밸런스";
  if (oE && !dS && !dH) return "보호자의 에너지가 차분한 아이에게 활력을 주는 관계";
  if (!oE && dS && dH) return "사교적인 아이 덕분에 세상이 더 넓어지는 관계";
  if (!oE && dS && !dH) return "서로의 페이스를 존중하며 함께하는 따뜻한 관계";
  if (!oE && !dS && dH) return "조용한 보호자와 활발한 아이의 의외의 케미";
  return "조용히 곁에 있는 것만으로 충분한 힐링 파트너";
}

export function readableAccent(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (brightness <= 0.4) return hex;
  const factor = 0.4 / brightness;
  const d = (c: number) => Math.round(c * factor).toString(16).padStart(2, "0");
  return `#${d(r)}${d(g)}${d(b)}`;
}

export const premiumGradients: Record<string, { bg: string; accent: string }> = {
  "#FFF3E0": { bg: "linear-gradient(145deg, #FFF3E0 0%, #FFE0B2 40%, #FFCC80 70%, #FFB74D 100%)", accent: "#FF9800" },
  "#FFF8E1": { bg: "linear-gradient(145deg, #FFF8E1 0%, #FFECB3 40%, #FFD54F 70%, #FFCA28 100%)", accent: "#FFC107" },
  "#E8EAF6": { bg: "linear-gradient(145deg, #E8EAF6 0%, #C5CAE9 40%, #9FA8DA 70%, #7986CB 100%)", accent: "#5C6BC0" },
  "#FFFDE7": { bg: "linear-gradient(145deg, #FFFDE7 0%, #FFF9C4 40%, #FFF176 70%, #FFEE58 100%)", accent: "#FDD835" },
  "#E0F7FA": { bg: "linear-gradient(145deg, #E0F7FA 0%, #B2EBF2 40%, #80DEEA 70%, #4DD0E1 100%)", accent: "#00BCD4" },
  "#E8F5E9": { bg: "linear-gradient(145deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 70%, #81C784 100%)", accent: "#4CAF50" },
  "#F3E5F5": { bg: "linear-gradient(145deg, #F3E5F5 0%, #E1BEE7 40%, #CE93D8 70%, #BA68C8 100%)", accent: "#9C27B0" },
  "#E3F2FD": { bg: "linear-gradient(145deg, #E3F2FD 0%, #BBDEFB 40%, #90CAF9 70%, #64B5F6 100%)", accent: "#2196F3" },
  "#E0F2F1": { bg: "linear-gradient(145deg, #E0F2F1 0%, #B2DFDB 40%, #80CBC4 70%, #4DB6AC 100%)", accent: "#009688" },
  "#FCE4EC": { bg: "linear-gradient(145deg, #FCE4EC 0%, #F8BBD0 40%, #F48FB1 70%, #EC407A 100%)", accent: "#E91E63" },
  "#EDE7F6": { bg: "linear-gradient(145deg, #EDE7F6 0%, #D1C4E9 40%, #B39DDB 70%, #9575CD 100%)", accent: "#673AB7" },
  "#F1F8E9": { bg: "linear-gradient(145deg, #F1F8E9 0%, #DCEDC8 40%, #C5E1A5 70%, #AED581 100%)", accent: "#8BC34A" },
};
