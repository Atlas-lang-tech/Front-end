import { useMutation } from "@pinia/colada";
import { deleteDictionary, type DeleteDictionaryParams } from ".";

export const useDictionaryDelete = () => {
  return useMutation({
    mutation: (params: DeleteDictionaryParams) => deleteDictionary(params),
  });
};
