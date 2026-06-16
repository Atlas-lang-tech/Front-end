import { $API } from "@/api";
import type { CustomResponse } from "@/types/response";
import type { Dictionary } from "@/types/vocabulary";

export interface GetDictionaryByIdParams {
  id: number;
}

export const getDictionaryById = async (
  params: GetDictionaryByIdParams,
): Promise<CustomResponse<Dictionary>> => {
  const response = await $API.get<CustomResponse<Dictionary>>(
    `/vocabulary/public/dictionaries/${params.id}`,
  );
  return response.data;
};
