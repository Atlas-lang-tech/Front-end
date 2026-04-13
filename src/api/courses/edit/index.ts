import { $API } from "@/api";

export interface EditCourseParams {
  id: number;
  cid: string;
  title: string;
  description: string;
  icons: string;
  languageId: number;
  languageLvlID: number;
  categoryId?: number;
}

export const editCourse = async (params: EditCourseParams) => {
  return $API.put(`/course/private/course/${params.id}`, {
    cid: params.cid,
    title: params.title,
    description: params.description,
    icons: params.icons,
    languageId: params.languageId,
    languageLvlID: params.languageLvlID,
    categoryId: params.categoryId,
  });
};
