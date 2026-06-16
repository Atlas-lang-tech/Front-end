import { $API } from "@/api";
import type { User } from "@/types/user";

export const getMe = async (): Promise<User> => {
  const response = await $API.get<User>("/auth/user/me", {});
  return response.data;
};
