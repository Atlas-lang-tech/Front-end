import { useMutation } from "@pinia/colada";
import { createCourse, type CreateCourseParams } from ".";

export const useCourseCreate = () => {
  return useMutation({
    mutation: (params: CreateCourseParams) => createCourse(params),
  });
};
