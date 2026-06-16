import { useMutation } from "@pinia/colada";
import { createWord, type CreateWordParams } from ".";

export const useWordCreate = () => {
  return useMutation({
    mutation: (params: CreateWordParams) => createWord(params),
  });
};
