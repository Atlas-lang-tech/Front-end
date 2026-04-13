import { $API } from "@/api";
import type { LanguageLevel } from "@/types/language";
import type { CustomResponse } from "@/types/response";

export const getAllLanguageLevels = async (): Promise<
  CustomResponse<LanguageLevel[]>
> => {
  const response = await $API.get<CustomResponse<LanguageLevel[]>>(
    "/course/private/language/level/all",
  );
  return response.data;
};
