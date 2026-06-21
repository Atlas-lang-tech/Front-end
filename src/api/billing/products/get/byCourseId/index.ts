import { $API } from "@/api";
import type { Product } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export interface GetProductByCourseIdParams {
  courseId: number;
}

export const getProductByCourseId = async (
  params: GetProductByCourseIdParams,
): Promise<CustomResponse<Product>> => {
  const response = await $API.get<CustomResponse<Product>>(
    `/billing/public/products/${params.courseId}`,
  );
  return response.data;
};
