import { $API } from "@/api";
import type { Category } from "@/types/category";
import type { Response } from "@/types/response";

export const getAllCategories = async (): Promise<Response<Category[]>> => {
  return $API.get("/course/public/category/");
};
