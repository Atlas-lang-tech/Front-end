import { $API } from "@/api";

export interface PurchaseCourseParams {
  courseId: number;
}

export const purchaseCourse = async (params: PurchaseCourseParams) => {
  return $API.post(
    `/billing/private/purchase/course/${params.courseId}`,
    {},
    {},
  );
};
