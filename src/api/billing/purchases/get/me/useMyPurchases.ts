import { useQuery } from "@pinia/colada";
import { getMyPurchases } from "./index";

export const useMyPurchases = () => {
  return useQuery({
    key: ["billing-my-purchases"],
    query: () => getMyPurchases(),
  });
};
