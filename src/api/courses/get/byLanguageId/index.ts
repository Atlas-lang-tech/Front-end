import { $API } from "@/api";
import type { Course } from "@/types/course";
import type { CustomResponse } from "@/types/response";

export interface GetCourseByLanguageIdParams {
  languageId: number;
}

export const getCourseByLanguageId = async (
  params: GetCourseByLanguageIdParams,
): Promise<CustomResponse<Course>> => {
  const response = await $API.get<CustomResponse<Course>>(
    `/course/public/course/language/${params.languageId}`,
  );
  return response.data;
};
