import { $API } from "@/api";
import type { CustomResponse } from "@/types/response";
import type { Word } from "@/types/vocabulary";

export interface GetStudySessionParams {
  dictionaryId: number;
}

export const getStudySession = async (
  params: GetStudySessionParams,
): Promise<CustomResponse<Word[]>> => {
  const response = await $API.get<CustomResponse<Word[]>>(
    `/vocabulary/private/study/${params.dictionaryId}/session`,
  );
  return response.data;
};
