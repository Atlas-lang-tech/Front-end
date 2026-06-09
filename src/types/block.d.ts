export type BlockType =
  | "MARKDOWN"
  | "ONE_TRUE_CHOICE"
  | "FILL_IN_BLANK"
  | "MANUAL_ANSWER"
  | "BUILD_SENTENCE"
  | "TRANSLATION"
  | "MATCHING"
  | "DIALOGUE"
  | "REPHRASING"
  | "ERROR_CORRECTION";

export interface MarkdownContent {
  text: string;
}

export interface OneTrueChoiceContent {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillInBlankContent {
  text: string;
  correctAnswer: string;
}

export interface ManualAnswerContent {
  text: string;
  correctAnswer: string;
}

export interface BuildSentenceContent {
  words: string[];
  correctOrder: number[];
}

export interface TranslationContent {
  text: string;
  translateTo: string;
  correctAnswer: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingContent {
  pairs: MatchingPair[];
}

export interface DialogueQuestion {
  question: string;
  correctAnswer: string;
}

export interface DialogueContent {
  dialogue: unknown[];
  questions: DialogueQuestion[];
}

export interface RephrasingContent {
  text: string;
  correctAnswer: string;
}

export interface ErrorCorrectionContent {
  text: string;
  errorText: string;
  correctAnswer: string;
}

export type BlockContent =
  | MarkdownContent
  | OneTrueChoiceContent
  | FillInBlankContent
  | ManualAnswerContent
  | BuildSentenceContent
  | TranslationContent
  | MatchingContent
  | DialogueContent
  | RephrasingContent
  | ErrorCorrectionContent;

export interface Block {
  id: number;
  lessonId: number;
  order: number;
  type: BlockType;
  title: string | null;
  content: BlockContent;
}
