import { useMutation } from "@pinia/colada";
import { createLanguage, type CreateLanguageParams } from ".";

export const useLanguageCreate = () => {
  return useMutation({
    mutation: (params: CreateLanguageParams) => createLanguage(params),
  });
};
