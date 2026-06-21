import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getCourseAccess } from ".";

export const useCourseAccess = (courseId: Ref<number>) => {
  return useQuery({
    key: () => ["billing-course-access", courseId.value],
    query: () => getCourseAccess({ courseId: courseId.value }),
    enabled: () => !!courseId.value,
  });
};
