import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getStudySession } from ".";

export const useStudySession = (dictionaryId: Ref<number>) => {
  return useQuery({
    key: () => ["vocab-study-session", dictionaryId.value],
    query: () => getStudySession({ dictionaryId: dictionaryId.value }),
    enabled: () => !!dictionaryId.value,
  });
};
