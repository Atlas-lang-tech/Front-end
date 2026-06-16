import type { Word } from "@/types/vocabulary";

export type GameMode =
  | "flashcards"
  | "choice"
  | "typing"
  | "matching"
  | "cloze"
  | "mixed";

export type SingleGameMode = "flashcards" | "choice" | "typing" | "cloze";

export interface StudyTask {
  word: Word;
  type: SingleGameMode;
}

export interface GameMeta {
  mode: GameMode;
  title: string;
  description: string;
  icon: string;
}

export const GAME_MODES: GameMeta[] = [
  {
    mode: "flashcards",
    title: "Flashcards",
    description: "Flip the card and rate yourself.",
    icon: "layers",
  },
  {
    mode: "choice",
    title: "Multiple Choice",
    description: "Pick the correct translation.",
    icon: "list-checks",
  },
  {
    mode: "typing",
    title: "Typing",
    description: "Type the translation from memory.",
    icon: "keyboard",
  },
  {
    mode: "matching",
    title: "Matching",
    description: "Match words to their translations.",
    icon: "arrow-left-right",
  },
  {
    mode: "cloze",
    title: "Example",
    description: "Fill the gap in an example sentence.",
    icon: "text-cursor-input",
  },
  {
    mode: "mixed",
    title: "Mixed",
    description: "All games shuffled together.",
    icon: "shuffle",
  },
];

export const isGameMode = (value: string): value is GameMode =>
  GAME_MODES.some((g) => g.mode === value);
