import { $API } from "@/api";

export interface DeleteLessonParams {
  id: number;
}

export const deleteLesson = async (params: DeleteLessonParams) => {
  return $API.delete(`/course/private/lesson/${params.id}`);
};
