import { useMutation } from "@pinia/colada";
import { reorderLessons, type ReorderLessonsParams } from ".";

export const useLessonReorder = () => {
  return useMutation({
    mutation: (params: ReorderLessonsParams) => reorderLessons(params),
  });
};
