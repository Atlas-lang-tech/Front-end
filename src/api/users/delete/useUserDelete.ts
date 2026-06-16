import { useMutation } from "@pinia/colada";
import { deleteUser, type DeleteUserParams } from ".";

export const useUserDelete = () => {
  return useMutation({
    mutation: (params: DeleteUserParams) => deleteUser(params),
  });
};
