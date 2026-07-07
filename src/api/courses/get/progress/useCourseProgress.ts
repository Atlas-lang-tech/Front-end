import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getCourseProgress } from ".";

export const useCourseProgress = (courseId: Ref<number>) => {
  return useQuery({
    key: ["course-progress", courseId.value],
    query: () => getCourseProgress({ courseId: courseId.value }),
    enabled: !!courseId.value,
  });
};
