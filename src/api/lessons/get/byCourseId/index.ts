import { $API } from "@/api";
import type { Lesson } from "@/types/lesson";
import type { CustomResponse } from "@/types/response";

export interface GetLessonsByCourseParams {
  courseId: number;
}

export const getLessonsByCourse = async (
  params: GetLessonsByCourseParams,
): Promise<CustomResponse<Lesson[]>> => {
  const response = await $API.get<CustomResponse<Lesson[]>>(
    `/course/private/lesson/${params.courseId}`,
  );
  return response.data;
};
