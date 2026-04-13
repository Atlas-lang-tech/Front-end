import { useMutation } from "@pinia/colada";
import { editCourse, type EditCourseParams } from ".";

export const useCourseEdit = () => {
  return useMutation({
    mutation: (params: EditCourseParams) => editCourse(params),
  });
};
