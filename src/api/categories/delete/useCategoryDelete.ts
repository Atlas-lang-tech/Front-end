import { useMutation } from "@pinia/colada";
import { deleteCategory, type DeleteCategoryParams } from "./index";

export const useCategoryDelete = () => {
  return useMutation({
    mutation: (params: DeleteCategoryParams) => deleteCategory(params),
  });
};
