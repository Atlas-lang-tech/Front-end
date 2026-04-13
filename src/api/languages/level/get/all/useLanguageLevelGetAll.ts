import { useQuery } from "@pinia/colada";
import { getAllLanguageLevels } from ".";

export const useLanguageLevelGetAll = () => {
  return useQuery({
    key: ["languages-level-get-all"],
    query: () => getAllLanguageLevels(),
  });
};
