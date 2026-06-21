import { $API } from "@/api";

export interface UpdatePlanParams {
  code: string;
  name: string;
  maxDictionaries: number;
  maxWordsPerDict: number;
  priceCents: number;
  isActive?: boolean;
}

export const updatePlan = async (params: UpdatePlanParams) => {
  return $API.put(`/billing/private/admin/plans/${params.code}`, {
    name: params.name,
    maxDictionaries: params.maxDictionaries,
    maxWordsPerDict: params.maxWordsPerDict,
    priceCents: params.priceCents,
    isActive: params.isActive,
  });
};
