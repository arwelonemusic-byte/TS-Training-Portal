import { TestQuestion } from "@/types";

export const PASS_THRESHOLD = 1;

export const questions: TestQuestion[] = [
  {
    id: 1,
    question: "Готовы попробовать создать миссию?",
    options: [
      { key: "а", text: "У меня на это нет времени" },
      { key: "б", text: "Да!" },
      { key: "в", text: "Нет, люблю приходить на готовенькое" },
      { key: "г", text: "Нет, это все слишком сложно" },
    ],
    correctKey: "б",
    explanation: "Отличный настрой!",
  },
];
