import { $API } from "@/api";

export interface DeleteLanguageParams {
  languageId: number;
}

export const deleteLanguage = (params: DeleteLanguageParams) => {
  return $API.delete(`/course/private/language/${params.languageId}`);
};
