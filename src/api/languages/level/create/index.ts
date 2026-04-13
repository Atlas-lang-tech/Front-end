import { $API } from "@/api";

export interface CreateLanguageLevelParams {
  languageId: number;
  name: string;
}

export const createLanguageLevel = async (
  params: CreateLanguageLevelParams,
) => {
  return $API.post(
    `/course/private/language/level/${params.languageId}`,
    {
      name: params.name,
    },
    {},
  );
};
