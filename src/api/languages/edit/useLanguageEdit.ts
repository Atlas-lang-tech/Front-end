import { useMutation } from "@pinia/colada";
import { editLanguage, type EditLanguageParams } from ".";

export const useLanguageEdit = () => {
  return useMutation({
    mutation: (params: EditLanguageParams) => editLanguage(params),
  });
};
