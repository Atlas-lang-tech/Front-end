import type {
  Block,
  BuildSentenceContent,
  DialogueContent,
  ErrorCorrectionContent,
  FillInBlankContent,
  ManualAnswerContent,
  MatchingContent,
  MatchingPair,
  OneTrueChoiceContent,
  RephrasingContent,
  TranslationContent,
} from "@/types/block";
import type { BlockAnswerRecord } from "./lesson-player.types";

export interface AnswerReview {
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
}

const UNANSWERED = "Left unanswered";

const formatPairs = (pairs: MatchingPair[]) =>
  pairs.map((pair) => `${pair.left} → ${pair.right}`).join(", ");

export const describeAnswer = (
  block: Block,
  record: BlockAnswerRecord,
): AnswerReview => {
  const answer = record.answer;

  switch (block.type) {
    case "ONE_TRUE_CHOICE": {
      const content = block.content as OneTrueChoiceContent;
      return {
        prompt: content.question,
        userAnswer: answer?.kind === "choice" ? answer.selected : UNANSWERED,
        correctAnswer: content.correctAnswer,
      };
    }

    case "FILL_IN_BLANK":
    case "MANUAL_ANSWER":
    case "TRANSLATION":
    case "REPHRASING":
    case "ERROR_CORRECTION": {
      const content = block.content as
        | FillInBlankContent
        | ManualAnswerContent
        | TranslationContent
        | RephrasingContent
        | ErrorCorrectionContent;
      return {
        prompt: content.text,
        userAnswer:
          answer?.kind === "text" && answer.text.trim()
            ? answer.text
            : UNANSWERED,
        correctAnswer: content.correctAnswer,
      };
    }

    case "BUILD_SENTENCE": {
      const content = block.content as BuildSentenceContent;
      return {
        prompt: block.title ?? "Build the sentence",
        userAnswer:
          answer?.kind === "build-sentence"
            ? answer.wordIndexes.map((i) => content.words[i]).join(" ")
            : UNANSWERED,
        correctAnswer: content.correctOrder
          .map((i) => content.words[i])
          .join(" "),
      };
    }

    case "MATCHING": {
      const content = block.content as MatchingContent;
      return {
        prompt: block.title ?? "Match the pairs",
        userAnswer:
          answer?.kind === "matching" ? formatPairs(answer.pairs) : UNANSWERED,
        correctAnswer: formatPairs(content.pairs),
      };
    }

    case "DIALOGUE": {
      const content = block.content as DialogueContent;
      return {
        prompt: content.questions.map((q) => q.question).join(" / "),
        userAnswer:
          answer?.kind === "dialogue" && answer.answers.some((a) => a.trim())
            ? answer.answers.join(" / ")
            : UNANSWERED,
        correctAnswer: content.questions.map((q) => q.correctAnswer).join(" / "),
      };
    }

    default:
      return { prompt: "", userAnswer: UNANSWERED, correctAnswer: "" };
  }
};
