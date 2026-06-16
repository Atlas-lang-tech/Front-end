import { $API } from "@/api";

export interface DeleteDictionaryParams {
  id: number;
  userId: string;
}

export const deleteDictionary = (params: DeleteDictionaryParams) => {
  return $API.delete(`/vocabulary/private/dictionaries/${params.id}`, {
    query: { userId: params.userId },
  });
};
