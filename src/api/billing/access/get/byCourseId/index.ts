import { $API } from "@/api";
import type { Access } from "@/types/billing";
import type { CustomResponse } from "@/types/response";

export interface GetCourseAccessParams {
  courseId: number;
}

export const getCourseAccess = async (
  params: GetCourseAccessParams,
): Promise<CustomResponse<Access>> => {
  const response = await $API.get<CustomResponse<Access>>(
    `/billing/private/me/access/${params.courseId}`,
  );
  return response.data;
};
