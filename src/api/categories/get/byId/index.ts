import { $API } from "@/api";
import type { Category } from "@/types/category";
import type { CustomResponse } from "@/types/response";

export interface GetCategoryByIdParams {
  id: string;
}

export const getCategoryById = async ({
  id,
}: GetCategoryByIdParams): Promise<CustomResponse<Category>> => {
  const response = await $API.get<CustomResponse<Category>>(
    `/course/private/category/${id}`,
  );
  return response.data;
};
