import { $API } from "@/api";

export interface EditCourseParams {
  id: number;
  cid: string;
  title: string;
  description: string;
  icon: string;
  languageId: number;
  languageLvlId: number;
  categoryId?: number;
}

export const editCourse = async (params: EditCourseParams) => {
  return $API.put(`/course/private/course/${params.id}`, {
    cid: params.cid,
    title: params.title,
    description: params.description,
    icon: params.icon,
    languageId: params.languageId,
    languageLvlId: params.languageLvlId,
    categoryId: params.categoryId,
  });
};
