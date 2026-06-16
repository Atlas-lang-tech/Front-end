import { useMutation } from "@pinia/colada";
import { editUser, type EditUserParams } from ".";

export const useUserEdit = () => {
  return useMutation({
    mutation: (params: EditUserParams) => editUser(params),
  });
};
