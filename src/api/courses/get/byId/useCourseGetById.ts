import { useQuery } from "@pinia/colada";
import { getCourseById, type GetCourseByIdParams } from ".";

export const useCourseGetById = (params: GetCourseByIdParams) => {
  return useQuery({
    key: ["courses-get-byId", params.id],
    query: () => getCourseById(params),
  });
};
