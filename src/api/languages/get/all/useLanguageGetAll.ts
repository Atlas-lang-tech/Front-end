import { useQuery } from "@pinia/colada";
import { getLanguages } from ".";

export const useLanguageGetAll = () => {
  return useQuery({
    key: ["languages"],
    query: () => getLanguages(),
  });
};
