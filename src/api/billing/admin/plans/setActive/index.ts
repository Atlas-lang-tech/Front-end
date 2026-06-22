import { $API } from "@/api";

export interface SetPlanActiveParams {
  code: string;
  isActive: boolean;
}

export const setPlanActive = async (params: SetPlanActiveParams) => {
  return $API.patch(`/billing/private/admin/plans/${params.code}/active`, {
    isActive: params.isActive,
  });
};
