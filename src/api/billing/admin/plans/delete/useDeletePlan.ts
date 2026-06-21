import { useMutation } from "@pinia/colada";
import { deletePlan, type DeletePlanParams } from "./index";

export const useDeletePlan = () => {
  return useMutation({
    mutation: (params: DeletePlanParams) => deletePlan(params),
  });
};
