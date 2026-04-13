import { $API } from "@/api";
import type { LanguageLevel } from "@/types/language";
import type { CustomResponse } from "@/types/response";

export interface GetLevelByIdParams {
  levelId: number;
}

export const getLevelById = async (
  params: GetLevelByIdParams,
): Promise<CustomResponse<LanguageLevel>> => {
  const response = await $API.get<CustomResponse<LanguageLevel>>(
    `course/public/language/level/id/${params.levelId}`,
  );
  return response.data;
};
