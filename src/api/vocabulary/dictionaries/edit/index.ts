import { $API } from "@/api";

export interface EditDictionaryParams {
  id: number;
  userId: string;
  title?: string;
  icon?: string;
}

export const editDictionary = async (params: EditDictionaryParams) => {
  return $API.patch(
    `/vocabulary/private/dictionaries/${params.id}`,
    {
      userId: params.userId,
      title: params.title,
      icon: params.icon,
    },
    {},
  );
};
