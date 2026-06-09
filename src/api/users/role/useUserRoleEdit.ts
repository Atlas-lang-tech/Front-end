import { useMutation } from "@pinia/colada";
import { editUserRole, type EditUserRoleParams } from ".";

export const useUserRoleEdit = () => {
  return useMutation({
    mutation: (params: EditUserRoleParams) => editUserRole(params),
  });
};
