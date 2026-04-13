import { $API } from "@/api";
import type { Course } from "@/types/course";
import type { CustomResponse } from "@/types/response";

export interface GetCourseByCategoryIdParams {
  categoryId: number;
}

export const getCourseByCategoryId = async (
  params: GetCourseByCategoryIdParams,
): Promise<CustomResponse<Course>> => {
  const response = await $API.get<CustomResponse<Course>>(
    `/course/public/course/category/${params.categoryId}`,
  );
  return response.data;
};
