import { $API } from "@/api";

export interface SetProductPriceParams {
  courseId: number;
  priceCents: number;
  currency?: string;
  isActive?: boolean;
}

export const setProductPrice = async (params: SetProductPriceParams) => {
  return $API.put(`/billing/private/admin/products/${params.courseId}`, {
    priceCents: params.priceCents,
    currency: params.currency,
    isActive: params.isActive,
  });
};
