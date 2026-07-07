import { useMutation, useQueryCache } from "@pinia/colada";
import { completeLesson, type CompleteLessonParams } from ".";

export const useLessonComplete = () => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (params: CompleteLessonParams) => completeLesson(params),
    onSuccess: () => queryCache.invalidateQueries({ key: ["course-progress"] }),
  });
};
