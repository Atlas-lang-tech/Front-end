import { useMutation } from "@pinia/colada";
import { setPlanActive, type SetPlanActiveParams } from ".";

export const useSetPlanActive = () => {
  return useMutation({
    mutation: (params: SetPlanActiveParams) => setPlanActive(params),
  });
};
