import { $API } from "@/api";
import type { CustomResponse } from "@/types/response";
import type { Word } from "@/types/vocabulary";

export interface GetWordsByDictionaryParams {
  dictionaryId: number;
}

export const getWordsByDictionary = async (
  params: GetWordsByDictionaryParams,
): Promise<CustomResponse<Word[]>> => {
  const response = await $API.get<CustomResponse<Word[]>>(
    `/vocabulary/public/words/dictionary/${params.dictionaryId}`,
  );
  return response.data;
};
