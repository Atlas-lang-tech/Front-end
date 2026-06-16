import { useMutation } from "@pinia/colada";
import { createDictionary, type CreateDictionaryParams } from ".";

export const useDictionaryCreate = () => {
  return useMutation({
    mutation: (params: CreateDictionaryParams) => createDictionary(params),
  });
};
