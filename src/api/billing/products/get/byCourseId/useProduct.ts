import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getProductByCourseId } from ".";

export const useProduct = (courseId: Ref<number>) => {
  return useQuery({
    key: () => ["billing-product", courseId.value],
    query: () => getProductByCourseId({ courseId: courseId.value }),
    enabled: () => !!courseId.value,
  });
};
