import { $API } from "@/api";
import type { CustomResponse } from "@/types/response";
import type { Dictionary } from "@/types/vocabulary";

export interface GetDictionariesByUserParams {
  userId: string;
}

export const getDictionariesByUser = async (
  params: GetDictionariesByUserParams,
): Promise<CustomResponse<Dictionary[]>> => {
  const response = await $API.get<CustomResponse<Dictionary[]>>(
    `/vocabulary/public/dictionaries/user/${params.userId}`,
  );
  return response.data;
};
