import { $API } from "@/api";

export interface UpsertPlanParams {
  code: string;
  name: string;
  maxDictionaries: number;
  maxWordsPerDict: number;
  priceCents: number;
  isActive?: boolean;
}

export const upsertPlan = async (params: UpsertPlanParams) => {
  return $API.post("/billing/private/admin/plans", {
    code: params.code,
    name: params.name,
    maxDictionaries: params.maxDictionaries,
    maxWordsPerDict: params.maxWordsPerDict,
    priceCents: params.priceCents,
    isActive: params.isActive,
  });
};
