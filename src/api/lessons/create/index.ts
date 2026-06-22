import { $API } from "@/api";

export interface CreateLessonParams {
  cid: string;
  title: string;
  description: string;
  courseId: number;
}

export const createLesson = async (params: CreateLessonParams) => {
  return $API.post("/course/private/lesson", {
    cid: params.cid,
    title: params.title,
    description: params.description,
    courseId: params.courseId,
  });
};
