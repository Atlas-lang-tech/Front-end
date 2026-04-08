import { $API } from "@/api";

export interface CreateCategoryParams {
  name: string;
}

export const createCategory = async (params: CreateCategoryParams) => {
  return $API.post(
    "/course/private/category",
    {
      name: params.name,
    },
    {},
  );
};
