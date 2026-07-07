import { $API } from "@/api";

export interface EditCourseParams {
  id: number;
  cid: string;
  title: string;
  description: string;
  icon: string;
  isFree: boolean;
  isVisible?: boolean;
  languageId: number;
  nativeLanguageId?: number;
  languageLvlId: number;
  categoryId?: number;
}

export const editCourse = async (params: EditCourseParams) => {
  return $API.put(`/course/private/course/${params.id}`, {
    cid: params.cid,
    title: params.title,
    description: params.description,
    icon: params.icon,
    isFree: params.isFree,
    isVisible: params.isVisible,
    languageId: params.languageId,
    nativeLanguageId: params.nativeLanguageId,
    languageLvlId: params.languageLvlId,
    categoryId: params.categoryId,
  });
};
