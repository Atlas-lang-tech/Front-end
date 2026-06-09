import { $API } from "@/api";
import type { Lesson } from "@/types/lesson";
import type { CustomResponse } from "@/types/response";

export interface GetLessonByIdParams {
  id: number;
}

export const getLessonById = async (
  params: GetLessonByIdParams,
): Promise<CustomResponse<Lesson>> => {
  const response = await $API.get<CustomResponse<Lesson>>(
    `/course/private/lesson/id/${params.id}`,
  );
  return response.data;
};
