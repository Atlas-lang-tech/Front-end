import { useMutation } from "@pinia/colada";
import { deleteLesson, type DeleteLessonParams } from ".";

export const useLessonDelete = () => {
  return useMutation({
    mutation: (params: DeleteLessonParams) => deleteLesson(params),
  });
};
