import { create } from "zustand";
import type { Answer } from "@/lib/calculate";
import { computeScores, calculateType } from "@/lib/calculate";
import { allQuestions } from "@/data/questions";

interface QuizState {
  dogName: string;
  photoUrl: string | null;
  currentIndex: number;
  answers: Answer[];
  resultCode: string | null;

  setDogName: (name: string) => void;
  setPhotoUrl: (url: string | null) => void;
  selectAnswer: (questionId: string, axis: Answer["axis"], value: string) => void;
  goBack: () => void;
  calculateResult: () => string;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  dogName: "",
  photoUrl: null,
  currentIndex: 0,
  answers: [],
  resultCode: null,

  setDogName: (name) => set({ dogName: name }),
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

  reset: () =>
    set({
      dogName: "",
      photoUrl: null,
      currentIndex: 0,
      answers: [],
      resultCode: null,
    }),
}));
