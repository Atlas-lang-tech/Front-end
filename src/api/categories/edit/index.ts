import { $API } from "@/api";

export interface EditCategoryParams {
  id: string;
  name: string;
}

export const editCategory = async ({ id, name }: EditCategoryParams) => {
  return $API.put(`/course/private/category/${id}`, { name });
};
