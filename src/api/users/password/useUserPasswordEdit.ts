import { useMutation } from "@pinia/colada";
import { editUserPassword, type EditUserPasswordParams } from ".";

export const useUserPasswordEdit = () => {
  return useMutation({
    mutation: (params: EditUserPasswordParams) => editUserPassword(params),
  });
};
