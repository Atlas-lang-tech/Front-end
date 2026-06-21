import { $API } from "@/api";
import type { Product } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export const getAllProducts = async (): Promise<CustomResponse<Product[]>> => {
  const response = await $API.get<CustomResponse<Product[]>>(
    "/billing/public/products",
  );
  return response.data;
};
