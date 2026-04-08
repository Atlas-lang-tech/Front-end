import { useMutation } from "@pinia/colada";
import { deleteCategory, type DeleteCategoryParams } from "./index";

export const useCourseDelete = () => {
  return useMutation({
    mutation: (params: DeleteCategoryParams) => deleteCategory(params),
  });
};
