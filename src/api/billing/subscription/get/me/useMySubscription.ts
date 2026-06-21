import { useQuery } from "@pinia/colada";
import { getMySubscription } from "./index";

export const useMySubscription = () => {
  return useQuery({
    key: ["billing-my-subscription"],
    query: () => getMySubscription(),
  });
};
