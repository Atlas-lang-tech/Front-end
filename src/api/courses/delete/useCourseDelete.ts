import { useMutation } from "@pinia/colada";
import { deleteCourse, type DeleteCourseParams } from "./index";

export const useCourseDelete = () => {
  return useMutation({
    mutation: (params: DeleteCourseParams) => deleteCourse(params),
  });
};
