import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getBlocksByLesson } from ".";

export const useBlockGetByLesson = (lessonId: Ref<number>) => {
  return useQuery({
    key: () => ["blocks-get-by-lesson", lessonId.value],
    query: () => getBlocksByLesson({ lessonId: lessonId.value }),
    enabled: () => !!lessonId.value,
  });
};
