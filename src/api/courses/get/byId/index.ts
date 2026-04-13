import { $API } from "@/api";
import type { Course } from "@/types/course";
import type { CustomResponse } from "@/types/response";

export interface GetCourseByIdParams {
  id: string;
}

export const getCourseById = async (
  params: GetCourseByIdParams,
): Promise<CustomResponse<Course>> => {
  const response = await $API.get<CustomResponse<Course>>(
    `/course/private/course/${params.id}`,
  );
  return response.data;
};
