import { $API } from "@/api";
import type { Plan } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export const getAllActivePlans = async (): Promise<CustomResponse<Plan[]>> => {
  const response = await $API.get<CustomResponse<Plan[]>>(
    "/billing/public/plans",
  );
  return response.data;
};
