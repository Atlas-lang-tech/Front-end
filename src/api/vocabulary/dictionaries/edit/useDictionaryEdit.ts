import { useMutation } from "@pinia/colada";
import { editDictionary, type EditDictionaryParams } from ".";

export const useDictionaryEdit = () => {
  return useMutation({
    mutation: (params: EditDictionaryParams) => editDictionary(params),
  });
};
