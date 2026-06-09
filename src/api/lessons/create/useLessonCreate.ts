import { useMutation } from "@pinia/colada";
import { createLesson, type CreateLessonParams } from ".";

export const useLessonCreate = () => {
  return useMutation({
    mutation: (params: CreateLessonParams) => createLesson(params),
  });
};
