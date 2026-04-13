import { useMutation } from "@pinia/colada";
import { editLanguageLevel, type EditLanguageLevelParams } from ".";

export const useLanguageLevelEdit = () => {
  return useMutation({
    mutation: (params: EditLanguageLevelParams) => editLanguageLevel(params),
  });
};
