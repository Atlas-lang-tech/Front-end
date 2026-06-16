import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getDictionariesByUser } from ".";

export const useDictionaryGetByUser = (userId: Ref<string>) => {
  return useQuery({
    key: () => ["vocab-dictionaries", userId.value],
    query: () => getDictionariesByUser({ userId: userId.value }),
    enabled: () => !!userId.value,
  });
};
