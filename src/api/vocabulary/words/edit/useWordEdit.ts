import { useMutation } from "@pinia/colada";
import { editWord, type EditWordParams } from ".";

export const useWordEdit = () => {
  return useMutation({
    mutation: (params: EditWordParams) => editWord(params),
  });
};
