import { useQuery } from "@pinia/colada";
import type { Ref } from "vue";
import { getLessonsByCourse } from ".";

export const useLessonGetByCourse = (courseId: Ref<number>) => {
  return useQuery({
    key: ["lessons-get-by-course", courseId.value],
    query: () => getLessonsByCourse({ courseId: courseId.value }),
    enabled: !!courseId.value,
  });
};
