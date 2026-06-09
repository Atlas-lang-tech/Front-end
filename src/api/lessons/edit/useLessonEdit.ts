import { useMutation } from "@pinia/colada";
import { editLesson, type EditLessonParams } from ".";

export const useLessonEdit = () => {
  return useMutation({
    mutation: (params: EditLessonParams) => editLesson(params),
  });
};
