import { $API } from "@/api";

export interface ReorderLessonsParams {
  courseId: number;
  lessonIds: number[];
}

export const reorderLessons = async (params: ReorderLessonsParams) => {
  return $API.patch(`/course/private/lesson/reorder/${params.courseId}`, {
    lessonIds: params.lessonIds,
  });
};
