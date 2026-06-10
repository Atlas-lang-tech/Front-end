import type { Block, BlockType, MatchingPair } from "@/types/block";

export type LessonPlayerPhase = "main" | "review" | "results";

export type TaskActionMode = "skip" | "leave";

export type BlockAnswer =
  | { kind: "choice"; selected: string }
  | { kind: "text"; text: string }
  | { kind: "build-sentence"; wordIndexes: number[] }
  | { kind: "matching"; pairs: MatchingPair[] }
  | { kind: "dialogue"; answers: string[] };

export interface BlockAnswerRecord {
  blockId: number;
  blockType: BlockType;
  answer: BlockAnswer | null;
  correct: boolean;
  skipped: boolean;
  unanswered: boolean;
}

export interface MistakeItem {
  record: BlockAnswerRecord;
  block: Block;
}

export interface LessonResult {
  lessonId: number;
  courseId: number;
  totalInteractive: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scorePercent: number;
  passed: boolean;
  completedAt: string;
  answers: BlockAnswerRecord[];
}

export const PASS_THRESHOLD = 75;
