import { $API } from "@/api";

export interface DeleteLanguageLevelParams {
  id: number;
}

export const deleteLanguageLevel = async (
  params: DeleteLanguageLevelParams,
) => {
  return $API.delete(`/course/private/language/level/${params.id}`);
};
