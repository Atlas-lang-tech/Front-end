import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getLessonById } from ".";

export const useLessonGetById = (id: Ref<number>) => {
  return useQuery({
    key: ["lesson-get-by-id", id.value],
    query: () => getLessonById({ id: id.value }),
    enabled: !!id.value,
  });
};
