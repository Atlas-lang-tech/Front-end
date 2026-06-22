import { $API } from "@/api";

export interface EditUserPlanParams {
  id: string;
  planCode: string;
}

export const editUserPlan = async ({ id, planCode }: EditUserPlanParams) => {
  return $API.patch(`/auth/user/${id}/plan`, { planCode });
};
