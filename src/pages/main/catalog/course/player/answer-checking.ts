import type {
  Block,
  BuildSentenceContent,
  DialogueContent,
  ErrorCorrectionContent,
  FillInBlankContent,
  ManualAnswerContent,
  MatchingContent,
  OneTrueChoiceContent,
  RephrasingContent,
  TranslationContent,
} from "@/types/block";
import type { BlockAnswer } from "./lesson-player.types";

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const checkAnswer = (block: Block, answer: BlockAnswer): boolean => {
  switch (block.type) {
    case "ONE_TRUE_CHOICE": {
      if (answer.kind !== "choice") return false;
      const content = block.content as OneTrueChoiceContent;
      return answer.selected === content.correctAnswer;
    }

    case "FILL_IN_BLANK":
    case "MANUAL_ANSWER":
    case "TRANSLATION":
    case "REPHRASING":
    case "ERROR_CORRECTION": {
      if (answer.kind !== "text") return false;
      const content = block.content as
        | FillInBlankContent
        | ManualAnswerContent
        | TranslationContent
        | RephrasingContent
        | ErrorCorrectionContent;
      return normalize(answer.text) === normalize(content.correctAnswer);
    }

    case "BUILD_SENTENCE": {
      if (answer.kind !== "build-sentence") return false;
      const content = block.content as BuildSentenceContent;
      const built = answer.wordIndexes.map((i) => content.words[i]).join(" ");
      const expected = content.correctOrder
        .map((i) => content.words[i])
        .join(" ");
      return built === expected;
    }

    case "MATCHING": {
      if (answer.kind !== "matching") return false;
      const content = block.content as MatchingContent;
      const expected = new Map(
        content.pairs.map((pair) => [pair.left, pair.right]),
      );
      return (
        answer.pairs.length === content.pairs.length &&
        answer.pairs.every((pair) => expected.get(pair.left) === pair.right)
      );
    }

    case "DIALOGUE": {
      if (answer.kind !== "dialogue") return false;
      const content = block.content as DialogueContent;
      return (
        answer.answers.length === content.questions.length &&
        content.questions.every(
          (question, i) =>
            normalize(answer.answers[i] ?? "") ===
            normalize(question.correctAnswer),
        )
      );
    }

    default:
      return false;
  }
};
