import { useMutation } from "@pinia/colada";
import { editCategory, type EditCategoryParams } from ".";

export const useCategoryEdit = () => {
  return useMutation({
    mutation: (params: EditCategoryParams) => editCategory(params),
  });
};
