import { useMutation } from "@pinia/colada";
import { deleteLanguageLevel, type DeleteLanguageLevelParams } from "./index";

export const useLanguageLevelDelete = () => {
  return useMutation({
    mutation: (params: DeleteLanguageLevelParams) =>
      deleteLanguageLevel(params),
  });
};
