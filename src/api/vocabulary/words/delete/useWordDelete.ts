import { useMutation } from "@pinia/colada";
import { deleteWord, type DeleteWordParams } from ".";

export const useWordDelete = () => {
  return useMutation({
    mutation: (params: DeleteWordParams) => deleteWord(params),
  });
};
