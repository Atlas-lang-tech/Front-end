import { useQuery } from "@pinia/colada";
import { getAllUsers } from ".";

export const useUserGetAll = () => {
  return useQuery({
    key: ["users"],
    query: () => getAllUsers(),
  });
};
