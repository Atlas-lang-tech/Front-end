import type { Block } from "@/types/block";
import { computed, ref, type Ref } from "vue";
import { checkAnswer } from "./answer-checking";
import {
  PASS_THRESHOLD,
  type BlockAnswer,
  type BlockAnswerRecord,
  type LessonPlayerPhase,
  type LessonResult,
  type MistakeItem,
  type TaskActionMode,
} from "./lesson-player.types";
import { submitLessonResult } from "./submit-lesson-result";

export const useLessonPlayer = (
  blocks: Ref<Block[]>,
  ids: { lessonId: Ref<number>; courseId: Ref<number> },
) => {
  const phase = ref<LessonPlayerPhase>("main");
  const mainIndex = ref(0);
  const reviewQueue = ref<Block[]>([]);
  const reviewIndex = ref(0);
  const records = ref<BlockAnswerRecord[]>([]);
  const result = ref<LessonResult | null>(null);

  const orderedBlocks = computed(() =>
    [...blocks.value].sort((a, b) => a.order - b.order),
  );

  const currentBlock = computed<Block | null>(() => {
    if (phase.value === "main") {
      return orderedBlocks.value[mainIndex.value] ?? null;
    }
    if (phase.value === "review") {
      return reviewQueue.value[reviewIndex.value] ?? null;
    }
    return null;
  });

  const totalSteps = computed(
    () => orderedBlocks.value.length + reviewQueue.value.length,
  );

  const completedSteps = computed(() => {
    if (phase.value === "main") return mainIndex.value;
    if (phase.value === "review") {
      return orderedBlocks.value.length + reviewIndex.value;
    }
    return totalSteps.value;
  });

  const actionMode = computed<TaskActionMode>(() =>
    phase.value === "review" ? "leave" : "skip",
  );

  const mistakes = computed<MistakeItem[]>(() =>
    records.value
      .filter((record) => !record.correct)
      .map((record) => ({
        record,
        block: orderedBlocks.value.find((block) => block.id === record.blockId),
      }))
      .filter((item): item is MistakeItem => !!item.block),
  );

  const finish = () => {
    const interactive = orderedBlocks.value.filter(
      (block) => block.type !== "MARKDOWN",
    );
    const totalInteractive = interactive.length;
    const correctCount = records.value.filter(
      (record) => record.correct,
    ).length;
    const unansweredCount = records.value.filter(
      (record) => record.unanswered,
    ).length;
    const incorrectCount = totalInteractive - correctCount - unansweredCount;
    const scorePercent =
      totalInteractive === 0
        ? 100
        : Math.round((correctCount / totalInteractive) * 100);

    result.value = {
      lessonId: ids.lessonId.value,
      courseId: ids.courseId.value,
      totalInteractive,
      correctCount,
      incorrectCount,
      unansweredCount,
      scorePercent,
      passed: scorePercent >= PASS_THRESHOLD,
      completedAt: new Date().toISOString(),
      answers: records.value,
    };

    phase.value = "results";
    void submitLessonResult(result.value);
  };

  const advanceMain = () => {
    mainIndex.value += 1;
    if (mainIndex.value < orderedBlocks.value.length) return;
    if (reviewQueue.value.length) {
      phase.value = "review";
    } else {
      finish();
    }
  };

  const advanceReview = () => {
    reviewIndex.value += 1;
    if (reviewIndex.value >= reviewQueue.value.length) {
      finish();
    }
  };

  const advance = () => {
    if (phase.value === "main") advanceMain();
    else if (phase.value === "review") advanceReview();
  };

  const continueBlock = () => {
    if (currentBlock.value?.type !== "MARKDOWN") return;
    advance();
  };

  const submit = (answer: BlockAnswer) => {
    const block = currentBlock.value;
    if (!block || block.type === "MARKDOWN") return;

    records.value.push({
      blockId: block.id,
      blockType: block.type,
      answer,
      correct: checkAnswer(block, answer),
      skipped: phase.value === "review",
      unanswered: false,
    });
    advance();
  };

  const skip = () => {
    const block = currentBlock.value;
    if (!block || phase.value !== "main" || block.type === "MARKDOWN") return;

    reviewQueue.value.push(block);
    advanceMain();
  };

  const leaveUnanswered = () => {
    const block = currentBlock.value;
    if (!block || phase.value !== "review") return;

    records.value.push({
      blockId: block.id,
      blockType: block.type,
      answer: null,
      correct: false,
      skipped: true,
      unanswered: true,
    });
    advanceReview();
  };

  const restart = () => {
    phase.value = "main";
    mainIndex.value = 0;
    reviewQueue.value = [];
    reviewIndex.value = 0;
    records.value = [];
    result.value = null;
  };

  return {
    phase,
    currentBlock,
    completedSteps,
    totalSteps,
    actionMode,
    result,
    mistakes,
    continueBlock,
    submit,
    skip,
    leaveUnanswered,
    restart,
  };
};
