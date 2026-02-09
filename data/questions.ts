export type Axis = "SL" | "HC" | "XG" | "BA";

export interface Question {
  id: string;
  axis: Axis;
  text: string; // {name} placeholder
  choiceA: { label: string; value: string };
  choiceB: { label: string; value: string };
}

export const stage1Questions: Question[] = [
  {
    id: "q1",
    axis: "SL",
    text: "산책 중 다른 강아지를 만났을 때, {name}는?",
    choiceA: { label: "꼬리 흔들며 다가간다", value: "S" },
    choiceB: { label: "거리를 두고 관찰한다", value: "L" },
  },
  {
    id: "q2",
    axis: "SL",
    text: "집에 손님이 왔을 때 {name}의 반응은?",
    choiceA: { label: "신나서 뛰어가 인사한다", value: "S" },
    choiceB: { label: "자기 자리에서 지켜본다", value: "L" },
  },
  {
    id: "q3",
    axis: "SL",
    text: "강아지 카페나 놀이터에서 {name}는?",
    choiceA: { label: "여러 강아지와 어울려 논다", value: "S" },
    choiceB: { label: "보호자 옆에 붙어있거나 혼자 탐색한다", value: "L" },
  },
  {
    id: "q4",
    axis: "HC",
    text: "하루 중 {name}의 에너지 레벨은?",
    choiceA: { label: "거의 하루종일 활발하다", value: "H" },
    choiceB: { label: "대부분 조용히 쉬고 있다", value: "C" },
  },
  {
    id: "q5",
    axis: "HC",
    text: "{name}의 산책 스타일은?",
    choiceA: { label: "앞서서 뛰고 당긴다", value: "H" },
    choiceB: { label: "보호자 옆에서 여유롭게 걷는다", value: "C" },
  },
  {
    id: "q6",
    axis: "HC",
    text: "놀이 시간이 끝났을 때 {name}의 반응은?",
    choiceA: { label: "더 놀자고 보챈다", value: "H" },
    choiceB: { label: "자연스럽게 쉬러 간다", value: "C" },
  },
  {
    id: "q7",
    axis: "XG",
    text: "새로운 장난감을 줬을 때 {name}는?",
    choiceA: { label: "바로 달려가서 탐색한다", value: "X" },
    choiceB: { label: "한참 지켜보다 천천히 다가간다", value: "G" },
  },
  {
    id: "q8",
    axis: "XG",
    text: "산책 루트에 대한 {name}의 반응은?",
    choiceA: { label: "새로운 길을 가면 신나한다", value: "X" },
    choiceB: { label: "익숙한 길을 가야 편안해한다", value: "G" },
  },
  {
    id: "q9",
    axis: "XG",
    text: "낯선 소리(택배 벨, 천둥)에 {name}는?",
    choiceA: { label: "소리 나는 쪽으로 가서 확인한다", value: "X" },
    choiceB: { label: "익숙한 자리로 가서 피한다", value: "G" },
  },
  {
    id: "q10",
    axis: "BA",
    text: "보호자와 놀 때 {name}는?",
    choiceA: { label: "장난감을 물어와서 놀자고 한다", value: "B" },
    choiceB: { label: "보호자가 시작하면 따라서 논다", value: "A" },
  },
  {
    id: "q11",
    axis: "BA",
    text: "간식을 원할 때 {name}는?",
    choiceA: { label: "앞발로 치거나 짖어서 요구한다", value: "B" },
    choiceB: { label: "눈빛으로 바라보며 기다린다", value: "A" },
  },
  {
    id: "q12",
    axis: "BA",
    text: "훈련이나 지시에 대한 {name}의 태도는?",
    choiceA: { label: "자기 방식대로 하려 한다", value: "B" },
    choiceB: { label: "보호자 지시를 잘 따른다", value: "A" },
  },
];

export const stage2Questions: Question[] = [
  {
    id: "q13",
    axis: "SL",
    text: "보호자가 외출 준비를 할 때 {name}는?",
    choiceA: { label: "따라가려고 현관에서 기다린다", value: "S" },
    choiceB: { label: "자기 자리에서 별 반응 없다", value: "L" },
  },
  {
    id: "q14",
    axis: "HC",
    text: "비오는 날 실내에서 {name}의 모습은?",
    choiceA: { label: "안절부절 못하고 돌아다닌다", value: "H" },
    choiceB: { label: "창밖을 보거나 낮잠을 잔다", value: "C" },
  },
  {
    id: "q15",
    axis: "XG",
    text: "처음 가보는 장소에서 {name}는?",
    choiceA: { label: "냄새 맡으며 여기저기 탐험한다", value: "X" },
    choiceB: { label: "보호자 곁에 붙어 경계한다", value: "G" },
  },
  {
    id: "q16",
    axis: "BA",
    text: "다른 강아지와 놀 때 {name}의 포지션은?",
    choiceA: { label: "먼저 다가가서 놀이를 시작한다", value: "B" },
    choiceB: { label: "상대가 다가오면 받아준다", value: "A" },
  },
  {
    id: "q17",
    axis: "SL",
    text: "{name}가 잠잘 때 선호하는 위치는?",
    choiceA: { label: "보호자 바로 옆이나 품", value: "S" },
    choiceB: { label: "자기만의 공간에서 혼자", value: "L" },
  },
  {
    id: "q18",
    axis: "HC",
    text: "장시간 산책 후 집에 돌아온 {name}는?",
    choiceA: { label: "집에 와서도 한동안 흥분 상태", value: "H" },
    choiceB: { label: "곧바로 쓰러져서 잠든다", value: "C" },
  },
  {
    id: "q19",
    axis: "XG",
    text: "밥그릇 위치를 바꿨을 때 {name}의 반응은?",
    choiceA: { label: "금방 찾아서 적응한다", value: "X" },
    choiceB: { label: "원래 자리에서 두리번거린다", value: "G" },
  },
  {
    id: "q20",
    axis: "BA",
    text: "목욕이나 싫어하는 상황에서 {name}는?",
    choiceA: { label: "저항하거나 도망치려 한다", value: "B" },
    choiceB: { label: "체념하고 가만히 있는다", value: "A" },
  },
];

export const allQuestions: Question[] = [...stage1Questions, ...stage2Questions];
