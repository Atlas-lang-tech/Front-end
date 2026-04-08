import { $API } from "@/api";
import type { Category } from "@/types/category";
import type { CustomResponse } from "@/types/response";

export const getAllCategories = async (): Promise<
  CustomResponse<Category[]>
> => {
  const response = await $API.get<CustomResponse<Category[]>>(
    "/course/public/category/",
  );
  return response.data;
};
