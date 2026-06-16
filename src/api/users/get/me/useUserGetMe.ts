import { useQuery } from "@pinia/colada";
import { getMe } from ".";

export const useUserGetMe = () => {
  return useQuery({
    key: ["users-get-me"],
    query: () => getMe(),
  });
};
