import { useQuery } from "@pinia/colada";
import { getProgressStats } from ".";

export const useProgressStats = () => {
  return useQuery({
    key: ["progress-stats"],
    query: () => getProgressStats(),
  });
};
