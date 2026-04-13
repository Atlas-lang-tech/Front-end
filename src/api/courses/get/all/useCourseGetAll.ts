import { useQuery } from "@pinia/colada";
import { getAllCourses } from "./index";

export const useCourseGetAll = () => {
  return useQuery({
    key: ["courses"],
    query: () => getAllCourses(),
  });
};
