import { useQuery } from "@pinia/colada";
import { getAllLevelsByLanguageId } from "./index";
import type { Ref } from "vue";

export const useLanguageLevelGetByLanguageId = (
  languageId: Ref<number | undefined>,
) => {
  console.log(languageId.value);
  return useQuery({
    key: ["language-level-get-by-language-id", languageId.value!],
    query: () => getAllLevelsByLanguageId({ languageId: languageId.value! }),
    enabled: !!languageId.value,
  });
};
