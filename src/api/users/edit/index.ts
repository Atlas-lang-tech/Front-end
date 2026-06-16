import { $API } from "@/api";
import type { User } from "@/types/user";

export interface EditUserParams {
  id: string;
  username: string;
  email: string;
}

export const editUser = async ({
  id,
  username,
  email,
}: EditUserParams): Promise<User> => {
  const response = await $API.patch<User>(`/auth/user/${id}`, {
    username,
    email,
  });
  return response.data;
};
