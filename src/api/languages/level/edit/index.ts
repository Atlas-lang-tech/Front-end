import { $API } from "@/api";

export interface EditLanguageLevelParams {
  id: number;
  name: string;
}

export const editLanguageLevel = async (params: EditLanguageLevelParams) => {
  return $API.put(
    `/course/private/language/level/${params.id}`,
    {
      name: params.name,
    },
    {},
  );
};
