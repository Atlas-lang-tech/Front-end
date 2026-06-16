import type { Word } from "@/types/vocabulary";
import { computed, ref, type Ref } from "vue";
import { pickRandomType, shuffle } from "./study-answer-check";
import type { GameMode, SingleGameMode, StudyTask } from "./study-player.types";

export const useStudyPlayer = (pool: Ref<Word[]>, mode: Ref<GameMode>) => {
  const tasks = ref<StudyTask[]>([]);
  const index = ref(0);
  const correctCount = ref(0);
  const finished = ref(false);
  const wordState = ref<Record<number, Word>>({});

  const buildQueue = () => {
    const built: StudyTask[] = [];
    for (const word of shuffle(pool.value)) {
      if (mode.value === "cloze" && !word.example) continue;
      const type: SingleGameMode =
        mode.value === "mixed"
          ? pickRandomType(word)
          : (mode.value as SingleGameMode);
      built.push({ word, type });
    }

    tasks.value = built;
    index.value = 0;
    correctCount.value = 0;
    finished.value = false;

    const map: Record<number, Word> = {};
    for (const w of pool.value) map[w.id] = w;
    wordState.value = map;
  };

  const currentTask = computed<StudyTask | null>(
    () => tasks.value[index.value] ?? null,
  );
  const total = computed(() => tasks.value.length);
  const completed = computed(() => index.value);

  const record = (correct: boolean) => {
    if (finished.value) return;
    if (correct) correctCount.value += 1;
    index.value += 1;
    if (index.value >= tasks.value.length) finished.value = true;
  };

  const mergeWord = (word: Word) => {
    wordState.value[word.id] = word;
  };

  const restart = () => buildQueue();

  return {
    tasks,
    currentTask,
    total,
    completed,
    correctCount,
    finished,
    wordState,
    buildQueue,
    record,
    mergeWord,
    restart,
  };
};
