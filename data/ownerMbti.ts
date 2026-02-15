export interface OwnerMatch {
  mbti: string;
  title: string;
  reason: string;
}

// ────────────────────────────────────────────
// 견주 실제 MBTI × 강아지 너는내운멍  시너지 메시지
// ────────────────────────────────────────────
const socialSynergy: Record<string, Record<string, string>> = {
  S: {
    E: "{name}의 넘치는 사교성, 역시 외향적인 견주님을 닮아 어디서든 인기쟁이예요!",
    I: "내향적인 견주님 곁에서도 이렇게 사교적으로 자란 건, 견주님이 {name}의 사회성을 세심하게 키워준 덕분이에요.",
  },
  L: {
    E: "독립적인 {name}도 활발한 견주님 덕분에 필요할 때 세상 밖으로 나올 용기를 얻고 있어요.",
    I: "{name}와 견주님은 서로의 공간을 존중하면서도 깊은 유대감을 나누는, 정말 잘 어울리는 조합이에요.",
  },
};

const energySynergy: Record<string, Record<string, string>> = {
  H: {
    T: "에너지 넘치는 {name}를 견주님의 논리적이고 체계적인 방식으로 잘 이끌어주고 계시네요!",
    F: "활발한 {name}의 에너지를 견주님이 따뜻한 애정으로 감싸주니 정서적으로 안정된 아이로 자라고 있어요.",
    S: "활동적인 {name}에게 현실적이고 꼼꼼한 견주님의 케어는 최고의 건강 관리 비결이에요.",
    N: "에너지 폭발하는 {name}에게 견주님의 창의적인 놀이 아이디어가 늘 새로운 즐거움을 선사하고 있어요.",
  },
  C: {
    T: "차분한 {name}와 논리적인 견주님은 효율적이고 안정적인 일상을 완벽하게 만들어가고 있어요.",
    F: "조용한 {name}의 미묘한 감정 변화까지 감성적인 견주님이 놓치지 않고 챙겨주고 있어요.",
    S: "여유로운 {name}에게 현실적인 견주님의 꼼꼼한 돌봄은 편안한 일상의 핵심이에요.",
    N: "차분한 {name}에게 직관적인 견주님이 조금씩 새로운 세계를 열어주고 있어요.",
  },
};

const exploreSynergy: Record<string, Record<string, string>> = {
  X: {
    J: "모험을 사랑하는 {name}를 계획적인 견주님이 안전하게 가이드해주니 마음껏 탐험할 수 있어요!",
    P: "탐험가 {name}와 즉흥적인 견주님은 매일매일이 새로운 모험! 둘 다 예측불가한 하루를 즐기고 있어요.",
  },
  G: {
    J: "안정을 추구하는 {name}와 계획적인 견주님은 규칙적인 생활 속에서 서로에게 편안한 안식처가 되어주고 있어요.",
    P: "신중한 {name}도 유연한 견주님과 함께라면 새로운 경험에 점점 마음을 열어가고 있어요.",
  },
};

const leadSynergy: Record<string, Record<string, string>> = {
  B: {
    E: "주도적인 {name}도 외향적인 견주님의 자연스러운 리더십 앞에서는 찰떡처럼 호흡을 맞추고 있어요.",
    I: "{name}가 드센 성격을 타고났는데도 이렇게 잘 자란 건, 견주님의 조용하지만 일관된 리더십 덕분이에요!",
    T: "자기 주장이 강한 {name}도 견주님의 논리적이고 단호한 태도에 자연스럽게 따르고 있어요.",
    F: "주도적인 {name}가 이렇게 사랑스럽게 자란 건, 견주님의 끝없는 애정과 인내 덕분이에요!",
  },
  A: {
    E: "순한 {name}와 활기찬 견주님의 조합은 서로에게 에너지를 주고받는 이상적인 관계예요.",
    I: "조용히 곁을 지키는 {name}와 내향적인 견주님은 말없이도 통하는 깊은 교감을 나누고 있어요.",
    T: "순응적인 {name}와 체계적인 견주님은 규칙적이고 안정된 행복한 일상을 만들어가고 있어요.",
    F: "{name}의 순한 성격에 견주님의 따뜻한 감성이 더해져, 누구나 부러워하는 행복한 반려 생활을 하고 있어요.",
  },
};

export function generateSynergyMessage(dogType: string, ownerMbti: string, dogName: string, ownerName?: string): string {
  const dogS = dogType[0]; // S or L
  const dogE = dogType[1]; // H or C
  const dogX = dogType[2]; // X or G
  const dogB = dogType[3]; // B or A

  const oEI = ownerMbti[0]; // E or I
  const oSN = ownerMbti[1]; // S or N
  const oTF = ownerMbti[2]; // T or F
  const oJP = ownerMbti[3]; // J or P

  const messages: string[] = [];

  const s1 = socialSynergy[dogS]?.[oEI];
  if (s1) messages.push(s1);

  const s2 = energySynergy[dogE]?.[oTF] || energySynergy[dogE]?.[oSN];
  if (s2) messages.push(s2);

  const s3 = exploreSynergy[dogX]?.[oJP];
  if (s3) messages.push(s3);

  const s4 = leadSynergy[dogB]?.[oEI] || leadSynergy[dogB]?.[oTF];
  if (s4) messages.push(s4);

  const picked = messages.slice(0, 3);
  const display = ownerName || "견주님";
  return picked.map((m) => m.replace(/\{name\}/g, dogName).replace(/견주님/g, `${display}`)).join(" ");
}

// 너는내운멍 타입별 어울리는 견주 MBTI
export const ownerMatches: Record<string, OwnerMatch> = {
  SHXB: {
    mbti: "ENFP",
    title: "열정적인 모험가 견주",
    reason: "에너지 넘치는 {name}에게는 함께 뛰어놀고 새로운 경험을 즐기는 ENFP 견주가 딱! 둘 다 호기심이 강하고 사교적이라 함께하면 매일이 신나는 모험이에요.",
  },
  SHXA: {
    mbti: "ESFJ",
    title: "다정한 돌봄 견주",
    reason: "활발하고 호기심 많지만 순한 {name}에게는 따뜻하게 케어하면서도 활동적인 ESFJ 견주가 이상적이에요. 규칙적인 돌봄 속에서 {name}가 가장 행복해할 거예요.",
  },
  SHGB: {
    mbti: "ESTJ",
    title: "체계적인 리더 견주",
    reason: "익숙한 환경에서 에너지를 폭발시키는 {name}에게는 일관된 루틴을 만들어주는 ESTJ 견주가 잘 맞아요. 규칙적인 산책과 확실한 리더십이 {name}를 안정시켜요.",
  },
  SHGA: {
    mbti: "ISFJ",
    title: "헌신적인 수호자 견주",
    reason: "사교적이면서 보호자를 따르는 {name}에게는 꼼꼼하고 헌신적인 ISFJ 견주가 최고예요. 안정적인 환경에서 {name}의 밝은 에너지가 빛나요.",
  },
  SCXB: {
    mbti: "INFP",
    title: "감성적인 예술가 견주",
    reason: "차분하면서 호기심 있는 {name}에게는 여유롭게 함께 탐색해줄 수 있는 INFP 견주가 잘 어울려요. 서로의 페이스를 존중하는 편안한 관계가 돼요.",
  },
  SCXA: {
    mbti: "ISFP",
    title: "온화한 관찰자 견주",
    reason: "조용히 세상을 탐구하는 {name}에게는 함께 느긋한 산책을 즐기는 ISFP 견주가 딱이에요. 강요 없이 자연스럽게 교감하는 사이가 될 거예요.",
  },
  SCGB: {
    mbti: "ISTP",
    title: "실용적인 자유주의 견주",
    reason: "느긋하지만 자기 주장이 있는 {name}에게는 간섭 없이 편안한 환경을 만들어주는 ISTP 견주가 맞아요. 서로의 영역을 존중하는 관계예요.",
  },
  SCGA: {
    mbti: "INFJ",
    title: "직관적인 이해자 견주",
    reason: "세상에서 가장 평화로운 {name}에게는 깊은 교감을 나누는 INFJ 견주가 이상적이에요. 말없이도 서로를 이해하는 특별한 유대가 만들어져요.",
  },
  LHXB: {
    mbti: "ENTP",
    title: "창의적인 도전가 견주",
    reason: "독립적이고 에너지 넘치는 {name}에게는 다양한 자극을 줄 수 있는 ENTP 견주가 찰떡이에요. 서로 지루할 틈이 없는 역동적인 조합이에요.",
  },
  LHXA: {
    mbti: "ENTJ",
    title: "카리스마 리더 견주",
    reason: "활발하지만 리드를 따르는 {name}에게는 확실한 방향을 제시하는 ENTJ 견주가 잘 맞아요. 효율적인 훈련과 충분한 활동량을 함께 해결해줄 거예요.",
  },
  LHGB: {
    mbti: "ISTJ",
    title: "신뢰의 루틴 마스터 견주",
    reason: "규칙적 에너자이저 {name}에게는 흔들림 없는 루틴을 제공하는 ISTJ 견주가 최고예요. 정해진 시간, 정해진 코스, 확실한 규칙 속에서 {name}가 안정돼요.",
  },
  LHGA: {
    mbti: "ESFP",
    title: "활기찬 동반자 견주",
    reason: "보호자와 함께 뛰는 걸 좋아하는 {name}에게는 에너지 넘치고 즉흥적인 ESFP 견주가 잘 맞아요. 함께 달리고 놀며 최고의 파트너가 돼요.",
  },
  LCXB: {
    mbti: "INTP",
    title: "분석적인 탐구자 견주",
    reason: "조용한 모험가 {name}에게는 함께 관찰하고 탐구하는 걸 좋아하는 INTP 견주가 잘 어울려요. 서로의 호기심을 자극하는 지적인 조합이에요.",
  },
  LCXA: {
    mbti: "ISFP",
    title: "감각적인 산책 메이트 견주",
    reason: "여유로운 산책을 즐기는 {name}에게는 자연과 교감하는 ISFP 견주가 딱이에요. 느긋한 산책 속에서 서로에게 힐링을 주는 관계예요.",
  },
  LCGB: {
    mbti: "INTJ",
    title: "전략적인 파트너 견주",
    reason: "도도한 마이웨이 {name}에게는 서로의 독립성을 존중하는 INTJ 견주가 최적이에요. 간섭 없이 각자의 시간을 보내다 필요할 때 교감하는 멋진 관계예요.",
  },
  LCGA: {
    mbti: "INFJ",
    title: "깊은 교감의 이해자 견주",
    reason: "조용한 철학견 {name}에게는 섬세하게 관찰하고 이해하는 INFJ 견주가 최고예요. 조용하지만 깊은 유대감을 나누는 특별한 관계가 돼요.",
  },
};
