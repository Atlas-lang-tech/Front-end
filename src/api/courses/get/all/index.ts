import { $API } from "@/api";
import type { Course } from "@/types/course";
import type { CustomResponse } from "@/types/response";

export const getAllCourses = async (): Promise<CustomResponse<Course[]>> => {
  const response = await $API.get<CustomResponse<Course[]>>(
    "/course/public/course",
  );
  return response.data;
};
