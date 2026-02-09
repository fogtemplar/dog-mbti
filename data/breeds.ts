export interface Breed {
  id: string;
  name: string;
  size: "소형견" | "중형견" | "대형견" | "기타";
  personality: string; // 알려진 평균 성격
  typicalType: string; // 평균적으로 어울리는 멍BTI 코드
}

export const breeds: Breed[] = [
  // 소형견
  { id: "maltese", name: "말티즈", size: "소형견", personality: "애교가 많고 보호자에게 밀착하는 사교적 성격. 활발하지만 겁이 많을 수 있어요.", typicalType: "SHGA" },
  { id: "poodle", name: "푸들 (토이/미니)", size: "소형견", personality: "영리하고 활발하며 사람을 잘 따르는 편. 학습 능력이 뛰어나요.", typicalType: "SHXA" },
  { id: "pomeranian", name: "포메라니안", size: "소형견", personality: "호기심이 강하고 자기 주장이 확실한 작은 대장. 경계심이 있어요.", typicalType: "SHXB" },
  { id: "chihuahua", name: "치와와", size: "소형견", personality: "보호자에게 충성스럽지만 낯선 사람에겐 경계. 독립적인 면이 있어요.", typicalType: "LCGB" },
  { id: "bichon", name: "비숑 프리제", size: "소형견", personality: "밝고 사교적이며 누구에게나 친근한 성격. 분리 불안이 있을 수 있어요.", typicalType: "SCGA" },
  { id: "yorkie", name: "요크셔 테리어", size: "소형견", personality: "작지만 용감하고 호기심이 많은 편. 자기 주장이 강해요.", typicalType: "LHXB" },
  { id: "shihtzu", name: "시츄", size: "소형견", personality: "느긋하고 다정하며 사람과 함께하는 걸 좋아해요. 순한 편이에요.", typicalType: "SCGA" },
  { id: "pekingese", name: "페키니즈", size: "소형견", personality: "독립적이고 도도한 성격. 자기만의 페이스가 확고해요.", typicalType: "LCGB" },
  { id: "minpin", name: "미니어처 핀셔", size: "소형견", personality: "에너지가 넘치고 호기심이 강한 활동파. 겁 없는 성격이에요.", typicalType: "LHXB" },
  { id: "papillon", name: "파피용", size: "소형견", personality: "영리하고 활발하며 사교적. 학습 능력이 뛰어나요.", typicalType: "SHXA" },
  // 중형견
  { id: "dachshund", name: "닥스훈트", size: "중형견", personality: "용감하고 고집이 세며 사냥 본능이 있어요. 독립적인 면이 강해요.", typicalType: "LHXB" },
  { id: "corgi", name: "웰시 코기", size: "중형견", personality: "사교적이고 에너지 넘치며 영리해요. 목양견 본능으로 주도적이에요.", typicalType: "SHXB" },
  { id: "shiba", name: "시바견", size: "중형견", personality: "독립적이고 고집스러우며 자기 영역이 확실해요. 도도한 매력이 있어요.", typicalType: "LCGB" },
  { id: "spitz", name: "스피츠", size: "중형견", personality: "밝고 활발하며 보호자에게 충실해요. 경계심이 있는 편이에요.", typicalType: "SHGB" },
  { id: "bordercollie", name: "보더 콜리", size: "중형견", personality: "가장 영리한 견종 중 하나. 에너지가 넘치고 일을 좋아해요.", typicalType: "LHXB" },
  { id: "jackrussell", name: "잭 러셀 테리어", size: "중형견", personality: "에너지 폭발! 호기심이 강하고 대담한 성격. 지칠 줄 모르는 활동파.", typicalType: "SHXB" },
  { id: "schnauzer", name: "미니어처 슈나우저", size: "중형견", personality: "영리하고 충성스러우며 경계심이 강해요. 가족에겐 다정해요.", typicalType: "LHGB" },
  { id: "cocker", name: "아메리칸 코커 스패니얼", size: "중형견", personality: "온순하고 사교적이며 사람을 좋아해요. 활발하지만 순한 편이에요.", typicalType: "SHXA" },
  // 대형견
  { id: "golden", name: "골든 리트리버", size: "대형견", personality: "온순하고 사교적이며 누구에게나 친절해요. 충성스럽고 영리해요.", typicalType: "SHXA" },
  { id: "labrador", name: "래브라도 리트리버", size: "대형견", personality: "활발하고 사교적이며 식탐이 강해요. 순하고 훈련성이 좋아요.", typicalType: "SHXA" },
  { id: "husky", name: "허스키", size: "대형견", personality: "독립적이고 에너지가 넘쳐요. 고집이 세고 탈출 본능이 강해요.", typicalType: "LHXB" },
  { id: "gsd", name: "저먼 셰퍼드", size: "대형견", personality: "충성스럽고 영리하며 보호 본능이 강해요. 훈련성이 뛰어나요.", typicalType: "LHGA" },
  { id: "samoyed", name: "사모예드", size: "대형견", personality: "밝고 사교적이며 항상 웃는 표정! 사람을 좋아하고 활발해요.", typicalType: "SHXB" },
  { id: "malamute", name: "알래스칸 말라뮤트", size: "대형견", personality: "독립적이고 힘이 넘치며 고집이 있어요. 무리 본능이 강해요.", typicalType: "LHGB" },
  { id: "bulldog", name: "불독 (프렌치/잉글리시)", size: "대형견", personality: "느긋하고 다정하며 고집이 있어요. 에너지는 낮지만 애교가 많아요.", typicalType: "SCGB" },
  { id: "doberman", name: "도베르만", size: "대형견", personality: "충성스럽고 경계심이 강하며 영리해요. 보호자와의 유대가 깊어요.", typicalType: "LHGB" },
  { id: "rottweiler", name: "로트와일러", size: "대형견", personality: "자신감 넘치고 충성스러우며 보호 본능이 강해요. 침착한 편이에요.", typicalType: "LCGB" },
  // 기타
  { id: "other", name: "기타 순종견", size: "기타", personality: "견종마다 고유한 성격이 있어요. 보호자의 관찰이 가장 정확해요!", typicalType: "" },
  { id: "mix", name: "믹스견 / 잘 모르겠어요", size: "기타", personality: "다양한 유전자가 섞여 세상에 하나뿐인 특별한 성격! 예측 불가한 매력이에요.", typicalType: "" },
];

export const breedGroups = [
  { label: "소형견", breeds: breeds.filter((b) => b.size === "소형견") },
  { label: "중형견", breeds: breeds.filter((b) => b.size === "중형견") },
  { label: "대형견", breeds: breeds.filter((b) => b.size === "대형견") },
  { label: "기타", breeds: breeds.filter((b) => b.size === "기타") },
];
