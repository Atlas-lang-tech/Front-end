import { $API } from "@/api";
import type { Block } from "@/types/block";
import type { CustomResponse } from "@/types/response";

export interface GetBlocksByLessonParams {
  lessonId: number;
}

export const getBlocksByLesson = async (
  params: GetBlocksByLessonParams,
): Promise<CustomResponse<Block[]>> => {
  const response = await $API.get<CustomResponse<Block[]>>(
    `/course/private/lesson/${params.lessonId}/blocks`,
  );
  return response.data;
};
