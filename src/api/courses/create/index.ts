import { $API } from "@/api";

export interface CreateCourseParams {
  cid: string;
  title: string;
  description: string;
  icon: string;
  isFree: boolean;
  languageId: number;
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
    languageId: params.languageId,
    languageLvlId: params.languageLvlId,
    categoryId: params.categoryId,
  });
};
