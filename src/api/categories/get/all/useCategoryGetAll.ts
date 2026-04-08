import { useQuery } from "@pinia/colada";
import { getAllCategories } from ".";

export const useCategoryGetAll = () => {
  return useQuery({
    key: ["categories"],
    query: () => getAllCategories(),
  });
};
