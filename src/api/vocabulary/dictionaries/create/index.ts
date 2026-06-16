import { $API } from "@/api";

export interface CreateDictionaryParams {
  userId: string;
  title: string;
  icon: string;
}

export const createDictionary = async (params: CreateDictionaryParams) => {
  return $API.post(
    "/vocabulary/private/dictionaries",
    {
      userId: params.userId,
      title: params.title,
      icon: params.icon,
    },
    {},
  );
};
