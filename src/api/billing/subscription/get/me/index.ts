import { $API } from "@/api";
import type { UserSubscription } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export const getMySubscription = async (): Promise<
  CustomResponse<UserSubscription>
> => {
  const response = await $API.get<CustomResponse<UserSubscription>>(
    "/billing/private/me/subscription",
  );
  return response.data;
};
