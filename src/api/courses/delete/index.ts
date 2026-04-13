import { $API } from "@/api";

export interface DeleteCourseParams {
  courseId: number;
}

export const deleteCourse = async (params: DeleteCourseParams) => {
  return $API.delete(`/course/private/course/${params.courseId}`);
};
