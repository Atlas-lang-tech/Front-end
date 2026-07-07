import { $API } from "@/api";

export interface SetCourseVisibilityParams {
  id: number;
  isVisible: boolean;
}

export const setCourseVisibility = async (
  params: SetCourseVisibilityParams,
) => {
  return $API.patch(`/course/private/course/${params.id}/visibility`, {
    isVisible: params.isVisible,
  });
};
