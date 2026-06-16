import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getDictionaryById } from ".";

export const useDictionaryGetById = (id: Ref<number>) => {
  return useQuery({
    key: () => ["vocab-dictionary", id.value],
    query: () => getDictionaryById({ id: id.value }),
    enabled: () => !!id.value,
  });
};
