import { useQuery } from "@pinia/colada";
import { getCourseByLanguageId } from "./index";

export const useCourseGetByLanguageId = (languageId: number) => {
  return useQuery({
    key: ["courses-by-language-id", languageId],
    query: () => getCourseByLanguageId({ languageId }),
  });
};
