import { $API } from "@/api";
import type { Language } from "@/types/language";
import type { CustomResponse } from "@/types/response";

export interface GetLanguageByIdParams {
  id: string;
}

export const getLanguageById = async (
  params: GetLanguageByIdParams,
): Promise<CustomResponse<Language>> => {
  const response = await $API.get<CustomResponse<Language>>(
    `/course/private/language/${params.id}`,
  );
  return response.data;
};
