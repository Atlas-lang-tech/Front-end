export type WordLevel = "NEW" | "LEARNING" | "MASTERED";

export interface Dictionary {
  id: number;
  userId: string;
  title: string;
  icon: string;
}

export interface Word {
  id: number;
  dictionaryId: number;
  word: string;
  translation: string;
  transcription: string | null;
  example: string | null;
  description: string | null;
  points: number;
  level: WordLevel;
  lastStudiedAt: string | null;
  nextReviewAt: string | null;
}
