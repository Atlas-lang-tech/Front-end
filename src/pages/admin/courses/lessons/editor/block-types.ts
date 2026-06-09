import type { Block, BlockContent, BlockType } from "@/types/block";

export const createDefaultContent = (type: BlockType): BlockContent => {
  switch (type) {
    case "MARKDOWN":
      return { text: "" };
    case "ONE_TRUE_CHOICE":
      return { question: "", options: ["", ""], correctAnswer: "" };
    case "FILL_IN_BLANK":
    case "MANUAL_ANSWER":
    case "REPHRASING":
      return { text: "", correctAnswer: "" };
    case "BUILD_SENTENCE":
      return { words: ["", ""], correctOrder: [0, 1] };
    case "TRANSLATION":
      return { text: "", translateTo: "", correctAnswer: "" };
    case "MATCHING":
      return { pairs: [{ left: "", right: "" }] };
    case "DIALOGUE":
      return { dialogue: [], questions: [{ question: "", correctAnswer: "" }] };
    case "ERROR_CORRECTION":
      return { text: "", errorText: "", correctAnswer: "" };
  }
};

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  MARKDOWN: "Markdown / Text",
  ONE_TRUE_CHOICE: "Single Choice",
  FILL_IN_BLANK: "Fill in the Blank",
  MANUAL_ANSWER: "Manual Answer",
  BUILD_SENTENCE: "Build Sentence",
  TRANSLATION: "Translation",
  MATCHING: "Matching",
  DIALOGUE: "Dialogue",
  REPHRASING: "Rephrasing",
  ERROR_CORRECTION: "Error Correction",
};

export const BLOCK_TYPE_OPTIONS = (
  Object.keys(BLOCK_TYPE_LABELS) as BlockType[]
).map((value) => ({ value, label: BLOCK_TYPE_LABELS[value] }));

const truncate = (text: string, max = 80) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

export const blockPreview = (block: Block): string => {
  const c = block.content as unknown as Record<string, unknown>;
  switch (block.type) {
    case "MARKDOWN":
      return truncate(String(c.text ?? ""));
    case "ONE_TRUE_CHOICE":
      return truncate(String(c.question ?? ""));
    case "FILL_IN_BLANK":
    case "MANUAL_ANSWER":
    case "REPHRASING":
    case "ERROR_CORRECTION":
    case "TRANSLATION":
      return truncate(String(c.text ?? ""));
    case "BUILD_SENTENCE":
      return truncate(((c.words as string[]) ?? []).join(" "));
    case "MATCHING":
      return `${((c.pairs as unknown[]) ?? []).length} pair(s)`;
    case "DIALOGUE":
      return `${((c.questions as unknown[]) ?? []).length} question(s)`;
    default:
      return "";
  }
};
