export interface SynergyPoint {
  title: string;
  description: string;
}

export interface RecommendedActivity {
  activity: string;
  reason: string;
}

export interface LivingTip {
  category: string;
  title: string;
  description: string;
}

/* ── 잘 맞는 점: 사교성 축 (강아지 S/L × 견주 E/I) ── */
const socialGood: Record<string, Record<string, SynergyPoint>> = {
  S: {
    E: {
      title: "함께하면 사교력 2배",
      description: "외향적인 견주님과 사교적인 {name}, 둘 다 사람과 강아지를 좋아하니 어딜 가든 인기 콤비예요. 반려견 카페, 공원 모임 등 사교 활동을 함께 즐기기 좋아요.",
    },
    I: {
      title: "서로에게 새로운 세계를 열어줘요",
      description: "내향적인 견주님에게 사교적인 {name}는 세상과 연결되는 다리 역할을 해요. {name} 덕분에 견주님도 새로운 만남이 자연스러워지고, {name}는 견주님에게서 차분함을 배워요.",
    },
  },
  L: {
    E: {
      title: "활발한 견주님이 독립심에 활기를 더해요",
      description: "독립적인 {name}도 외향적인 견주님의 에너지 덕분에 새로운 경험에 마음을 열게 돼요. 견주님이 자연스럽게 {name}의 사회화를 이끌어줘요.",
    },
    I: {
      title: "조용한 교감의 달인 콤비",
      description: "서로의 독립적인 시간을 존중하면서도, 함께 있을 때는 깊은 유대감을 나누는 이상적인 조합이에요. 말없이도 통하는 관계예요.",
    },
  },
};

/* ── 잘 맞는 점: 에너지 축 (강아지 H/C × 견주 T/F) ── */
const energyGood: Record<string, Record<string, SynergyPoint>> = {
  H: {
    T: {
      title: "체계적인 에너지 관리",
      description: "활발한 {name}의 에너지를 견주님이 논리적으로 관리해 줘요. 산책 스케줄, 놀이 루틴 등을 체계적으로 짜서 {name}의 에너지를 건강하게 발산시켜요.",
    },
    F: {
      title: "따뜻한 에너지의 조화",
      description: "{name}의 넘치는 활력을 견주님의 따뜻한 감성이 감싸줘요. {name}가 흥분했을 때 견주님의 부드러운 대응이 정서적 안정을 줘요.",
    },
  },
  C: {
    T: {
      title: "효율적이고 안정적인 일상",
      description: "차분한 {name}와 체계적인 견주님은 규칙적이고 예측 가능한 일상을 만들어요. 서로에게 가장 편안한 리듬을 찾기 쉬운 조합이에요.",
    },
    F: {
      title: "미묘한 감정까지 읽어내는 케미",
      description: "차분한 {name}의 작은 감정 변화를 감성적인 견주님이 놓치지 않아요. 표현이 적어도 교감이 깊은, 서로를 잘 이해하는 관계예요.",
    },
  },
};

/* ── 잘 맞는 점: 탐험 축 (강아지 X/G × 견주 J/P) ── */
const exploreGood: Record<string, Record<string, SynergyPoint>> = {
  X: {
    J: {
      title: "안전한 모험의 파트너",
      description: "호기심 가득한 {name}의 탐험을 계획적인 견주님이 안전하게 가이드해요. 새 코스도 미리 답사하고, 위험 요소를 체크하는 견주님 덕분에 {name}가 마음껏 탐험할 수 있어요.",
    },
    P: {
      title: "매일이 새로운 즉흥 모험",
      description: "탐험가 {name}와 즉흥적인 견주님은 매일매일이 예측불가한 모험이에요! 새 산책 코스, 새 장소, 새 경험을 함께 즐기는 최고의 모험 파트너예요.",
    },
  },
  G: {
    J: {
      title: "안정적인 일상의 완벽한 조화",
      description: "루틴을 사랑하는 {name}와 계획적인 견주님은 최고의 조합이에요. 매일 같은 시간에 산책하고, 밥 먹고, 쉬는 예측 가능한 일상이 서로에게 안식처가 돼요.",
    },
    P: {
      title: "점진적인 변화의 가이드",
      description: "유연한 견주님이 루틴을 좋아하는 {name}에게 조금씩 새로운 경험을 소개해 줘요. 견주님의 부드러운 리드 덕분에 {name}도 점차 변화에 마음을 열어요.",
    },
  },
};

/* ── 주의할 점: 사교성 축 ── */
const socialCaution: Record<string, Record<string, SynergyPoint>> = {
  S: {
    E: {
      title: "과한 사교 활동 주의",
      description: "둘 다 사교적이다 보니 활동이 과해질 수 있어요. {name}에게도 휴식이 필요하니, 주 1~2회는 조용한 날로 정해주세요.",
    },
    I: {
      title: "에너지 밸런스 맞추기",
      description: "{name}의 사교 욕구와 견주님의 휴식 욕구가 충돌할 수 있어요. {name}의 사교 시간은 반려견 카페나 놀이터에서, 집에서는 함께 쉬는 시간으로 밸런스를 맞춰보세요.",
    },
  },
  L: {
    E: {
      title: "과한 관심이 부담될 수 있어요",
      description: "외향적인 견주님의 적극적인 애정 표현이 독립적인 {name}에게 부담이 될 수 있어요. {name}가 혼자 있고 싶을 때는 그 시간을 존중해 주세요.",
    },
    I: {
      title: "교감 시간 의식적으로 확보하기",
      description: "둘 다 독립적이다 보니 교감 시간이 자연스럽게 줄어들 수 있어요. 매일 최소 10분은 함께 산책하거나 놀이하는 시간을 의식적으로 만들어 주세요.",
    },
  },
};

/* ── 주의할 점: 행동 축 (강아지 B/A × 견주 E/I 또는 T/F) ── */
const leadCaution: Record<string, Record<string, SynergyPoint>> = {
  B: {
    T: {
      title: "리더십 충돌 조심",
      description: "주도적인 {name}와 논리적인 견주님이 부딪힐 수 있어요. 규칙은 일관되게 유지하되, {name}에게 '왜 따라야 하는지'를 보상으로 보여주는 게 효과적이에요.",
    },
    F: {
      title: "일관성 유지가 중요해요",
      description: "마음 약한 견주님이 주도적인 {name}의 어필에 자주 양보하면 규칙이 무너질 수 있어요. 사랑은 충분히 주되, 중요한 규칙은 단호하게 지켜주세요.",
    },
  },
  A: {
    T: {
      title: "너무 엄격하지 않게",
      description: "순응적인 {name}에게 체계적인 견주님의 규칙이 과할 수 있어요. {name}가 위축되지 않도록 칭찬을 더 많이 해주세요.",
    },
    F: {
      title: "과한 보호 조심",
      description: "순한 {name}를 보면 자꾸 감싸고 싶어지지만, 과보호는 자신감을 떨어뜨릴 수 있어요. {name}가 스스로 해볼 수 있는 기회도 줘보세요.",
    },
  },
};

/* ── 함께 하면 좋은 활동: 에너지 축 기반 ── */
const activityByEnergy: Record<string, Record<string, RecommendedActivity>> = {
  H: {
    T: {
      activity: "계획된 탐험 산책",
      reason: "활발한 {name}의 에너지를 체계적인 견주님이 새로운 코스로 이끌어줘요. 미리 경로를 정하고 함께 탐험하면 둘 다 만족!",
    },
    F: {
      activity: "함께 달리기 & 응원",
      reason: "에너지 넘치는 {name}와 달리면서, 감성적인 견주님의 칭찬이 {name}를 더 신나게 해요!",
    },
  },
  C: {
    T: {
      activity: "규칙적인 힐링 산책",
      reason: "매일 같은 시간, 같은 코스를 함께 걷는 여유로운 산책이 둘 다에게 최고의 힐링이에요.",
    },
    F: {
      activity: "함께 쉬며 마사지",
      reason: "차분한 {name}와 따뜻한 견주님이 함께 쉬면서 마사지해주는 시간이 서로에게 최고의 교감이에요.",
    },
  },
};

/* ── 함께 하면 좋은 활동: 탐험 축 기반 ── */
const activityByExplore: Record<string, Record<string, RecommendedActivity>> = {
  X: {
    J: {
      activity: "주말 탐험 프로젝트",
      reason: "견주님이 미리 계획한 새로운 산책 장소를 매주 하나씩 함께 탐험해요. 안전하면서도 새로운 경험!",
    },
    P: {
      activity: "즉흥 모험 산책",
      reason: "가보지 않은 길로 마음 가는 대로 걸어봐요. 예측 불가한 하루가 둘 다에게 최고의 자극이에요!",
    },
  },
  G: {
    J: {
      activity: "루틴 노즈워크",
      reason: "매일 같은 시간에 간식 숨기기 놀이를 해요. 규칙 속에서 즐거움을 찾는 둘에게 딱 맞아요!",
    },
    P: {
      activity: "새로운 간식 체험",
      reason: "견주님이 가끔 새로운 간식이나 장난감을 소개해 주면, {name}가 루틴 속에서도 작은 설렘을 느낄 수 있어요.",
    },
  },
};

/* ── 함께 하면 좋은 활동: 사교성 축 기반 ── */
const activityBySocial: Record<string, Record<string, RecommendedActivity>> = {
  S: {
    E: {
      activity: "반려견 소셜 모임 참여",
      reason: "사교적인 둘이 함께 반려견 모임이나 카페에 가면 즐거움이 2배! 새 친구도 만들고 에너지도 발산해요.",
    },
    I: {
      activity: "1:1 깊은 교감 시간",
      reason: "조용한 견주님과 사교적인 {name}가 둘만의 시간을 갖는 게 서로에게 특별한 보상이에요.",
    },
  },
  L: {
    E: {
      activity: "병행 활동 (같은 공간, 각자 놀기)",
      reason: "독립적인 {name}와 활발한 견주님이 같은 공원에서 각자의 시간을 보내되 함께 있는 느낌으로!",
    },
    I: {
      activity: "나란히 쉬는 힐링 타임",
      reason: "둘 다 조용한 시간을 좋아하니, 소파에 나란히 앉아 각자의 시간을 보내는 것만으로 충분해요.",
    },
  },
};

/* ── 함께 잘 지내는 법: 소통 방식 (강아지 S/L × 견주 E/I) ── */
const livingCommunication: Record<string, Record<string, LivingTip>> = {
  S: {
    E: {
      category: "일상 소통법",
      title: "에너지를 맞춰 함께 즐기기",
      description: "견주님도 {name}도 사교적이라 함께라면 어디든 즐거워요. 하지만 {name}가 지쳐 보이면 조용한 시간도 만들어 주세요. 귀가 뒤로 젖혀지거나 하품이 잦으면 '이제 쉬고 싶다'는 신호예요. 반려견 모임 후에는 30분 이상의 조용한 쉬는 시간을 주면 스트레스가 풀려요.",
    },
    I: {
      category: "일상 소통법",
      title: "사교 욕구를 채워주는 루틴 만들기",
      description: "{name}는 다른 사람·강아지와 어울리고 싶어 하지만, 내향적인 견주님에게 매일 사교 모임은 부담이 될 수 있어요. 주 2~3회 반려견 놀이터를 방문하거나 가까운 이웃 강아지와 짧게 산책하는 정도면 {name}의 사교 욕구가 충분히 해소돼요. 나머지 날은 둘만의 조용한 놀이를 즐기세요.",
    },
  },
  L: {
    E: {
      category: "일상 소통법",
      title: "독립적인 시간 존중하기",
      description: "외향적인 견주님은 {name}를 자주 안거나 만지고 싶겠지만, 독립적인 {name}에게 과한 스킨십은 오히려 부담이에요. {name}가 먼저 다가올 때 반응해 주는 게 가장 좋아요. 하루에 5~10분, {name}가 원할 때 짧고 깊은 교감을 나누면 신뢰가 더 깊어져요.",
    },
    I: {
      category: "일상 소통법",
      title: "함께 있되 각자의 공간 즐기기",
      description: "둘 다 독립적인 성향이라 '같은 방에서 각자 할 일 하기'가 자연스러워요. 하지만 교감이 너무 적어지지 않도록 매일 정해진 인사 루틴을 만들어 보세요. 아침 일어나서 5분 쓰다듬기, 산책 후 간식 한 조각 등 짧은 접촉 포인트가 유대감을 지켜줘요.",
    },
  },
};

/* ── 함께 잘 지내는 법: 훈련 접근 (강아지 B/A × 견주 T/F) ── */
const livingTraining: Record<string, Record<string, LivingTip>> = {
  B: {
    T: {
      category: "훈련 접근법",
      title: "논리적 규칙 + 선택권 제공",
      description: "주도적인 {name}에게 일방적인 명령보다는 '앉아→간식 vs 기다려→산책' 같은 선택지를 주세요. 체계적인 견주님의 일관된 규칙 안에서 {name}가 스스로 올바른 선택을 하면 보상하는 방식이 가장 효과적이에요. 규칙을 어기면 무시(무반응)로 대응하고, 따르면 즉시 칭찬해 주세요.",
    },
    F: {
      category: "훈련 접근법",
      title: "단호하되 따뜻한 리더십",
      description: "{name}의 귀여운 어필에 자꾸 양보하면 규칙이 무너질 수 있어요. 감성적인 견주님일수록 '안 돼'를 말할 때 확고한 톤을 유지하는 게 중요해요. 대신 올바른 행동을 했을 때 풍성한 칭찬과 스킨십으로 보상하면 {name}도 행복하게 규칙을 배워요.",
    },
  },
  A: {
    T: {
      category: "훈련 접근법",
      title: "격려 중심의 부드러운 훈련",
      description: "순응적인 {name}에게 엄격한 규칙이 과하면 위축될 수 있어요. 체계적인 견주님이라면 규칙을 정하되, 명령보다 격려 위주로 가르쳐 보세요. '앉아'를 할 때마다 밝은 목소리로 크게 칭찬하면 {name}의 자신감이 올라가고 더 적극적으로 학습해요.",
    },
    F: {
      category: "훈련 접근법",
      title: "과보호 없이 자립심 키우기",
      description: "순한 {name}를 보면 자꾸 대신 해주고 싶지만, 작은 도전을 스스로 해내게 하는 게 중요해요. 새 간식 퍼즐을 주고 옆에서 지켜보며 기다려 주세요. 혼자 해냈을 때의 성취감이 {name}의 자신감을 키워주고, 견주님과의 유대도 더 단단해져요.",
    },
  },
};

/* ── 함께 잘 지내는 법: 감정 교류 (강아지 H/C × 견주 E/I) ── */
const livingEmotion: Record<string, Record<string, LivingTip>> = {
  H: {
    E: {
      category: "감정 교류법",
      title: "함께 발산하고 함께 쉬기",
      description: "에너지가 높은 {name}와 외향적인 견주님은 함께 뛰어놀 때 가장 행복해요. 하지만 둘 다 흥분이 높아지면 사고로 이어질 수 있으니, 놀이 중간에 '앉아-기다려'로 쿨다운 시간을 넣으세요. 15분 놀이 → 5분 휴식 → 15분 놀이 리듬이 이상적이에요.",
    },
    I: {
      category: "감정 교류법",
      title: "조용한 방식으로 에너지 발산 돕기",
      description: "활발한 {name}의 에너지가 내향적인 견주님에게 벅찰 수 있어요. 직접 뛰어놀기 어려우면 공 던지기, 노즈워크 세팅, 터그 놀이 등 견주님은 적게 움직이면서 {name}의 에너지를 빼줄 수 있는 놀이를 활용하세요. 지친 후 나란히 쉬는 시간이 최고의 교감이에요.",
    },
  },
  C: {
    E: {
      category: "감정 교류법",
      title: "차분한 교감의 가치 발견하기",
      description: "활발한 견주님은 조용한 {name}를 보며 '재미없나?'라고 오해할 수 있지만, {name}는 견주님 곁에 있는 것만으로도 충분히 행복해요. 소파에 나란히 앉아 TV를 보거나, 마사지를 해주는 등 고요한 순간에 {name}의 꼬리 미세한 흔들림을 관찰해 보세요. 그게 최대 애정 표현이에요.",
    },
    I: {
      category: "감정 교류법",
      title: "고요한 루틴이 가장 큰 사랑",
      description: "차분한 {name}와 내향적인 견주님은 천생연분이에요. 매일 같은 시간에 산책하고, 같은 자리에서 쉬고, 조용히 함께하는 루틴 자체가 가장 깊은 유대감을 만들어요. 가끔 부드러운 목소리로 이름을 불러주며 눈을 맞추면 {name}는 세상에서 가장 안전하다고 느껴요.",
    },
  },
};

/* ── 함께 잘 지내는 법: 생활 리듬 (강아지 X/G × 견주 J/P) ── */
const livingRoutine: Record<string, Record<string, LivingTip>> = {
  X: {
    J: {
      category: "생활 리듬 맞추기",
      title: "계획 속에 탐험을 넣어주세요",
      description: "호기심 강한 {name}는 매일 같은 루틴에 지루해할 수 있어요. 계획적인 견주님이라면 주간 스케줄에 '새 코스 산책'을 하루 정해서 넣어보세요. 나머지 날은 익숙한 루틴을 따르되, 그 하루의 모험이 {name}에게 일주일의 활력이 돼요.",
    },
    P: {
      category: "생활 리듬 맞추기",
      title: "즉흥 속에서도 안전장치 마련하기",
      description: "탐험 좋아하는 {name}와 즉흥적인 견주님은 매일이 모험이에요! 하지만 최소한의 안전 규칙은 정해두세요. 산책 시 리콜(이리와) 훈련은 필수이고, 새로운 장소에서는 롱리드줄을 활용하면 자유와 안전을 모두 잡을 수 있어요.",
    },
  },
  G: {
    J: {
      category: "생활 리듬 맞추기",
      title: "완벽한 루틴 파트너",
      description: "루틴을 사랑하는 {name}와 계획적인 견주님은 가장 안정적인 조합이에요. 아침 7시 산책 → 8시 밥 → 낮잠 → 저녁 산책처럼 시간표를 정하면 {name}가 불안 없이 하루를 보내요. 시간이 바뀔 때는 하루 15분씩 천천히 조정해 주세요.",
    },
    P: {
      category: "생활 리듬 맞추기",
      title: "핵심 루틴만 지키고 나머지는 유연하게",
      description: "루틴을 좋아하는 {name}에게 즉흥적인 일상은 불안의 원인이 될 수 있어요. 밥 시간과 산책 시간만큼은 매일 비슷하게 유지하되, 나머지는 견주님 스타일대로 자유롭게 하면 {name}도 점차 유연해져요. 핵심 루틴 2~3개만 지키면 충분해요.",
    },
  },
};

/* ══════════════════════════════════════════
   조합 생성 함수
   ══════════════════════════════════════════ */

function fill(text: string, dogName: string, ownerName?: string): string {
  return text
    .replace(/\{name\}/g, dogName)
    .replace(/견주님/g, ownerName || "견주님");
}

function fillPoint(p: SynergyPoint, dogName: string, ownerName?: string): SynergyPoint {
  return { title: fill(p.title, dogName, ownerName), description: fill(p.description, dogName, ownerName) };
}

function fillActivity(a: RecommendedActivity, dogName: string, ownerName?: string): RecommendedActivity {
  return { activity: fill(a.activity, dogName, ownerName), reason: fill(a.reason, dogName, ownerName) };
}

function fillLivingTip(t: LivingTip, dogName: string, ownerName?: string): LivingTip {
  return { category: t.category, title: fill(t.title, dogName, ownerName), description: fill(t.description, dogName, ownerName) };
}

export function generateDeepSynergyGoodPoints(
  dogType: string,
  ownerMbti: string,
  dogName: string,
  ownerName?: string,
): SynergyPoint[] {
  const dogS = dogType[0]; // S or L
  const dogE = dogType[1]; // H or C
  const dogX = dogType[2]; // X or G
  const oEI = ownerMbti[0]; // E or I
  const oTF = ownerMbti[2]; // T or F
  const oJP = ownerMbti[3]; // J or P

  const points: SynergyPoint[] = [];

  const s1 = socialGood[dogS]?.[oEI];
  if (s1) points.push(fillPoint(s1, dogName, ownerName));

  const s2 = energyGood[dogE]?.[oTF];
  if (s2) points.push(fillPoint(s2, dogName, ownerName));

  const s3 = exploreGood[dogX]?.[oJP];
  if (s3) points.push(fillPoint(s3, dogName, ownerName));

  return points.slice(0, 3);
}

export function generateDeepSynergyCautions(
  dogType: string,
  ownerMbti: string,
  dogName: string,
  ownerName?: string,
): SynergyPoint[] {
  const dogS = dogType[0]; // S or L
  const dogB = dogType[3]; // B or A
  const oEI = ownerMbti[0]; // E or I
  const oTF = ownerMbti[2]; // T or F

  const points: SynergyPoint[] = [];

  const c1 = socialCaution[dogS]?.[oEI];
  if (c1) points.push(fillPoint(c1, dogName, ownerName));

  const c2 = leadCaution[dogB]?.[oTF];
  if (c2) points.push(fillPoint(c2, dogName, ownerName));

  return points.slice(0, 2);
}

export function generateRecommendedActivities(
  dogType: string,
  ownerMbti: string,
  dogName: string,
  ownerName?: string,
): RecommendedActivity[] {
  const dogS = dogType[0]; // S or L
  const dogE = dogType[1]; // H or C
  const dogX = dogType[2]; // X or G
  const oEI = ownerMbti[0]; // E or I
  const oTF = ownerMbti[2]; // T or F
  const oJP = ownerMbti[3]; // J or P

  const activities: RecommendedActivity[] = [];

  const a1 = activityByEnergy[dogE]?.[oTF];
  if (a1) activities.push(fillActivity(a1, dogName, ownerName));

  const a2 = activityByExplore[dogX]?.[oJP];
  if (a2) activities.push(fillActivity(a2, dogName, ownerName));

  const a3 = activityBySocial[dogS]?.[oEI];
  if (a3) activities.push(fillActivity(a3, dogName, ownerName));

  return activities.slice(0, 3);
}

export function generateLivingTips(
  dogType: string,
  ownerMbti: string,
  dogName: string,
  ownerName?: string,
): LivingTip[] {
  const dogS = dogType[0]; // S or L
  const dogE = dogType[1]; // H or C
  const dogX = dogType[2]; // X or G
  const dogB = dogType[3]; // B or A
  const oEI = ownerMbti[0]; // E or I
  const oTF = ownerMbti[2]; // T or F
  const oJP = ownerMbti[3]; // J or P

  const tips: LivingTip[] = [];

  const t1 = livingCommunication[dogS]?.[oEI];
  if (t1) tips.push(fillLivingTip(t1, dogName, ownerName));

  const t2 = livingTraining[dogB]?.[oTF];
  if (t2) tips.push(fillLivingTip(t2, dogName, ownerName));

  const t3 = livingEmotion[dogE]?.[oEI];
  if (t3) tips.push(fillLivingTip(t3, dogName, ownerName));

  const t4 = livingRoutine[dogX]?.[oJP];
  if (t4) tips.push(fillLivingTip(t4, dogName, ownerName));

  return tips;
}
