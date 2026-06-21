import { useMutation } from "@pinia/colada";
import { updatePlan, type UpdatePlanParams } from ".";

export const useUpdatePlan = () => {
  return useMutation({
    mutation: (params: UpdatePlanParams) => updatePlan(params),
  });
};
