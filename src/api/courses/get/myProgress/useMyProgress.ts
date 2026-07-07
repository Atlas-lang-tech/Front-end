import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getMyProgress } from ".";

export const useMyProgress = (courseIds: Ref<number[]>) => {
  return useQuery({
    key: () => ["my-progress", [...courseIds.value].sort((a, b) => a - b)],
    query: () => getMyProgress(courseIds.value),
    enabled: () => courseIds.value.length > 0,
  });
};
