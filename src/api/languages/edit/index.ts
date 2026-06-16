import { $API } from "@/api";

export interface EditLanguageParams {
  id: number;
  name: string;
  code: string;
}

export const editLanguage = async (params: EditLanguageParams) => {
  return $API.put(
    `/course/private/language/${params.id}`,
    {
      name: params.name,
      code: params.code,
    },
    {},
  );
};
