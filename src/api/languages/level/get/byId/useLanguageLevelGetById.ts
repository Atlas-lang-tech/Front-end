import { useQuery } from "@pinia/colada";
import { getLevelById, type GetLevelByIdParams } from ".";

export const useLanguageLevelGetById = (params: GetLevelByIdParams) => {
  return useQuery({
    key: ["language-level-get-by-id", params.levelId],
    query: () => getLevelById(params),
  });
};
