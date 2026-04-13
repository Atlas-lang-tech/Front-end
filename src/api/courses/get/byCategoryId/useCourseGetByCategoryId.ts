import { useQuery } from "@pinia/colada";
import { getCourseByCategoryId } from ".";

export const useCourseGetByCategoryId = (categoryId: number) => {
  return useQuery({
    key: ["courses-by-category-id", categoryId],
    query: () => getCourseByCategoryId({ categoryId }),
  });
};
