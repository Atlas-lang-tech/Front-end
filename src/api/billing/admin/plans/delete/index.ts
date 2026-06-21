import { $API } from "@/api";

export interface DeletePlanParams {
  code: string;
}

export const deletePlan = async (params: DeletePlanParams) => {
  return $API.delete(`/billing/private/admin/plans/${params.code}`);
};
