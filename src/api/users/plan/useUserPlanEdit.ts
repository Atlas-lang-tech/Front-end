import { useMutation } from "@pinia/colada";
import { editUserPlan, type EditUserPlanParams } from ".";

export const useUserPlanEdit = () => {
  return useMutation({
    mutation: (params: EditUserPlanParams) => editUserPlan(params),
  });
};
