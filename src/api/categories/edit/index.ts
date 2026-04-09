import { $API } from "@/api";

export interface EditCategoryParams {
  id: number;
  name: string;
}

export const editCategory = async ({ id, name }: EditCategoryParams) => {
  return $API.put(`/course/private/category/${id}`, { name });
};
