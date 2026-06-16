import { $API } from "@/api";

export interface DeleteWordParams {
  id: number;
}

export const deleteWord = (params: DeleteWordParams) => {
  return $API.delete(`/vocabulary/private/words/${params.id}`);
};
