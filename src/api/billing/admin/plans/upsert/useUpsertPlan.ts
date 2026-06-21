import { useMutation } from "@pinia/colada";
import { upsertPlan, type UpsertPlanParams } from ".";

export const useUpsertPlan = () => {
  return useMutation({
    mutation: (params: UpsertPlanParams) => upsertPlan(params),
  });
};
