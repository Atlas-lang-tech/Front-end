import { $API } from "@/api";

export interface DeleteUserParams {
  id: string;
}

export const deleteUser = async ({ id }: DeleteUserParams) => {
  return $API.delete(`/auth/user/${id}`);
};
