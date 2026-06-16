import type { Word } from "@/types/vocabulary";
import type { SingleGameMode } from "./study-player.types";

export const normalize = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const checkTyping = (input: string, expected: string): boolean =>
  normalize(input) === normalize(expected);

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const buildChoices = (word: Word, pool: Word[], count = 4): string[] => {
  const distractors = shuffle(
    pool
      .filter((w) => w.id !== word.id)
      .map((w) => w.translation)
      .filter((t) => t && t !== word.translation),
  ).slice(0, count - 1);

  return shuffle([word.translation, ...distractors]);
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildCloze = (word: Word): string => {
  if (!word.example) return "___";
  const regex = new RegExp(escapeRegExp(word.word), "i");
  if (!regex.test(word.example)) return `${word.example} (___)`;
  return word.example.replace(regex, "___");
};

export const pickRandomType = (word: Word): SingleGameMode => {
  const types: SingleGameMode[] = ["flashcards", "choice", "typing"];
  if (word.example) types.push("cloze");
  return types[Math.floor(Math.random() * types.length)];
};
