import { useMutation } from "@pinia/colada";
import { deleteLanguage, type DeleteLanguageParams } from "./index";

export const useLanguageDelete = () => {
  return useMutation({
    mutation: (params: DeleteLanguageParams) => deleteLanguage(params),
  });
};
