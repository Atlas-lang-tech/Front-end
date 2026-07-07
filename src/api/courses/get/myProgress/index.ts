import { getCourseProgress } from "@/api/courses/get/progress";
import type { CourseProgress } from "@/types/progress";

export interface CourseProgressEntry extends CourseProgress {
  courseId: number;
}

export const getMyProgress = async (
  courseIds: number[],
): Promise<CourseProgressEntry[]> => {
  const entries = await Promise.all(
    courseIds.map(async (courseId) => {
      const res = await getCourseProgress({ courseId });
      return { courseId, ...res.data };
    }),
  );
  return entries;
};
