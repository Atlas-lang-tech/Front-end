import { useQuery } from "@pinia/colada";
import { getAllPlans } from "./index";

export const usePlans = () => {
  return useQuery({
    key: ["billing-plans"],
    query: () => getAllPlans(),
  });
};
