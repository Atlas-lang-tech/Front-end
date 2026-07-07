import { $API } from "@/api";

export interface CreateCourseParams {
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

export const createCourse = async (params: CreateCourseParams) => {
  return $API.post("/course/private/course", {
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
