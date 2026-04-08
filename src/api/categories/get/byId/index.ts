import { $API } from "@/api";
import type { Category } from "@/types/category";
import type { Response } from "@/types/response";

export interface GetCategoryByIdParams {
  id: string;
}

export const getCategoryById = async ({
  id,
}: GetCategoryByIdParams): Promise<Response<Category>> => {
  return $API.get(`/course/private/category/${id}`);
};
