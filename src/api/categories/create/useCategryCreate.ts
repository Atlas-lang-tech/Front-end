import { useMutation } from "@pinia/colada";
import { createCategory, type CreateCategoryParams } from ".";

export const useCategoryCreate = () => {
  return useMutation({
    mutation: ({ name }: CreateCategoryParams) => createCategory({ name }),
  });
};
