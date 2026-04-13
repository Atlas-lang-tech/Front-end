import { $API } from "@/api";

export interface CreateCourseParams {
  cid: string;
  title: string;
  description: string;
  icons: string;
  languageId: number;
  languageLvlID: number;
  categoryId?: number;
}

export const createCourse = async (params: CreateCourseParams) => {
  return $API.post("/course/private/course", {
    cid: params.cid,
    title: params.title,
    description: params.description,
    icons: params.icons,
    languageId: params.languageId,
    languageLvlID: params.languageLvlID,
    categoryId: params.categoryId,
  });
};
