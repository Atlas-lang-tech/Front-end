import { $API } from "@/api";
import type { Language } from "@/types/language";
import type { CustomResponse } from "@/types/response";

export const getLanguages = async (): Promise<CustomResponse<Language[]>> => {
  const response = await $API.get<CustomResponse<Language[]>>(
    "/course/public/language",
  );
  return response.data;
};
