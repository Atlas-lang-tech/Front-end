import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getWordsByDictionary } from ".";

export const useWordGetByDictionary = (dictionaryId: Ref<number>) => {
  return useQuery({
    key: () => ["vocab-words", dictionaryId.value],
    query: () => getWordsByDictionary({ dictionaryId: dictionaryId.value }),
    enabled: () => !!dictionaryId.value,
  });
};
