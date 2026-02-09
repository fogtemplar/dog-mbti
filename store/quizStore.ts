import { create } from "zustand";
import type { Answer } from "@/lib/calculate";
import { computeScores, calculateType } from "@/lib/calculate";
import { allQuestions } from "@/data/questions";

export interface HistoryEntry {
  id: string;
  date: string;
  dogName: string;
  ownerName: string;
  breedId: string;
  ownerMbti: string;
  resultCode: string;
  photoUrl: string | null;
}

interface QuizState {
  dogName: string;
  ownerName: string;
  breedId: string;
  ownerMbti: string;
  photoUrl: string | null;
  currentIndex: number;
  answers: Answer[];
  resultCode: string | null;

  setDogName: (name: string) => void;
  setOwnerName: (name: string) => void;
  setBreedId: (id: string) => void;
  setOwnerMbti: (mbti: string) => void;
  setPhotoUrl: (url: string | null) => void;
  selectAnswer: (questionId: string, axis: Answer["axis"], value: string) => void;
  goBack: () => void;
  calculateResult: () => string;
  saveToHistory: () => void;
  reset: () => void;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("mungbti-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem("mungbti-history", JSON.stringify(entries.slice(0, 20)));
  } catch { /* quota exceeded */ }
}

export function getHistory(): HistoryEntry[] {
  return loadHistory();
}

export function clearHistory() {
  try {
    localStorage.removeItem("mungbti-history");
  } catch { /* ignore */ }
}

export const useQuizStore = create<QuizState>((set, get) => ({
  dogName: "",
  ownerName: "",
  breedId: "",
  ownerMbti: "",
  photoUrl: null,
  currentIndex: 0,
  answers: [],
  resultCode: null,

  setDogName: (name) => set({ dogName: name }),
  setOwnerName: (name) => set({ ownerName: name }),
  setBreedId: (id) => set({ breedId: id }),
  setOwnerMbti: (mbti) => set({ ownerMbti: mbti }),
  setPhotoUrl: (url) => set({ photoUrl: url }),

  selectAnswer: (questionId, axis, value) => {
    const { answers, currentIndex } = get();
    const existing = answers.findIndex((a) => a.questionId === questionId);
    const newAnswer: Answer = { questionId, axis, selectedValue: value };
    const newAnswers =
      existing >= 0
        ? answers.map((a, i) => (i === existing ? newAnswer : a))
        : [...answers, newAnswer];
    set({
      answers: newAnswers,
      currentIndex: Math.min(currentIndex + 1, allQuestions.length - 1),
    });
  },

  goBack: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
  },

  calculateResult: () => {
    const { answers } = get();
    const scores = computeScores(answers);
    const code = calculateType(scores);
    set({ resultCode: code });
    return code;
  },

  saveToHistory: () => {
    const { dogName, ownerName, breedId, ownerMbti, resultCode, photoUrl } = get();
    if (!resultCode) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      dogName,
      ownerName,
      breedId,
      ownerMbti,
      resultCode,
      photoUrl,
    };
    const history = loadHistory();
    saveHistory([entry, ...history]);
  },

  reset: () =>
    set({
      dogName: "",
      ownerName: "",
      breedId: "",
      ownerMbti: "",
      photoUrl: null,
      currentIndex: 0,
      answers: [],
      resultCode: null,
    }),
}));
