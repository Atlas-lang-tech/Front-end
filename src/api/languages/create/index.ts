import { $API } from "@/api";

export interface CreateLanguageParams {
  name: string;
  code: string;
  icon: string;
}

export const createLanguage = async (params: CreateLanguageParams) => {
  return $API.post(
    "/course/private/language",
    {
      name: params.name,
      code: params.code,
      icon: params.icon,
    },
    {},
  );
};
