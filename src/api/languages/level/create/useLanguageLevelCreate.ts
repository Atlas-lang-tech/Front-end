import { useMutation } from "@pinia/colada";
import { createLanguageLevel, type CreateLanguageLevelParams } from ".";

export const useLanguageLevelCreate = () => {
  return useMutation({
    mutation: (params: CreateLanguageLevelParams) =>
      createLanguageLevel(params),
  });
};
