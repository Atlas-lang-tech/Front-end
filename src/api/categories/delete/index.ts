import { $API } from "@/api";

export interface DeleteCategoryParams {
  id: number;
}

export const deleteCategory = async (params: DeleteCategoryParams) => {
  return $API.delete(`/course/private/category/${params.id}`);
};
