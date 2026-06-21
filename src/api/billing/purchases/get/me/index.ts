import { $API } from "@/api";
import type { CoursePurchase } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export const getMyPurchases = async (): Promise<
  CustomResponse<CoursePurchase[]>
> => {
  const response = await $API.get<CustomResponse<CoursePurchase[]>>(
    "/billing/private/me/purchases",
  );
  return response.data;
};
