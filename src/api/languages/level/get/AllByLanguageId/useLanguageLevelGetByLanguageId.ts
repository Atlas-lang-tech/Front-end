import { useQuery } from "@pinia/colada";
import {
  getAllLevelsByLanguageId,
  type GetAllLevelsByLanguageIdParams,
} from "./index";

export const useLanguageLevelGetByLanguageId = (
  params: GetAllLevelsByLanguageIdParams,
) => {
  return useQuery({
    key: ["language-level-get-by-language-id", params.languageId],
    query: () => getAllLevelsByLanguageId(params),
  });
};
