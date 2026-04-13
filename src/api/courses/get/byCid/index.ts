import { $API } from "@/api";
import type { Course } from "@/types/course";
import type { CustomResponse } from "@/types/response";

export interface GetCourseByCidParams {
  cid: string;
}

export const getCourseByCid = async (
  params: GetCourseByCidParams,
): Promise<CustomResponse<Course>> => {
  const response = await $API.get<CustomResponse<Course>>(
    `/course/public/course/cid/${params.cid}`,
  );
  return response.data;
};
