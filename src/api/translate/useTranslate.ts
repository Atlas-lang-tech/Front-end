import { useMutation } from "@pinia/colada";
import { translateText, type TranslateParams } from ".";

export const useTranslate = () => {
  return useMutation({
    mutation: (params: TranslateParams) => translateText(params),
  });
};
