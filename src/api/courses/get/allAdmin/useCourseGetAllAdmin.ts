import { useQuery } from "@pinia/colada";
import { getAllCoursesAdmin } from "./index";

export const useCourseGetAllAdmin = () => {
  return useQuery({
    key: ["courses", "admin"],
    query: () => getAllCoursesAdmin(),
  });
};
