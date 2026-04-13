import { $API } from "@/api";
import type { LanguageLevel } from "@/types/language";
import type { CustomResponse } from "@/types/response";

export interface GetAllLevelsByLanguageIdParams {
  languageId: number;
}

export const getAllLevelsByLanguageId = async (
  params: GetAllLevelsByLanguageIdParams,
): Promise<CustomResponse<LanguageLevel[]>> => {
  const response = await $API.get<CustomResponse<LanguageLevel[]>>(
    `/course/public/language/level/${params.languageId}`,
  );
  return response.data;
};
