import { useQuery } from "@pinia/colada";
import { getLanguageById, type GetLanguageByIdParams } from ".";

export const useLanguageGetById = (params: GetLanguageByIdParams) => {
  return useQuery({
    key: ["language-get-by-id", params.id],
    query: () => getLanguageById(params),
  });
};
