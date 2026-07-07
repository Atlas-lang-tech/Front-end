import { useMutation } from "@pinia/colada";
import { setCourseVisibility, type SetCourseVisibilityParams } from "./index";

export const useCourseSetVisibility = () => {
  return useMutation({
    mutation: (params: SetCourseVisibilityParams) =>
      setCourseVisibility(params),
  });
};
