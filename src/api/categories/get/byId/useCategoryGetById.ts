import { useQuery } from "@pinia/colada";
import { getCategoryById } from "./index";

export const useCategoryGetById = ({ id }: { id: string }) => {
  return useQuery({
    key: ["category", id],
    query: () => getCategoryById({ id }),
  });
};
