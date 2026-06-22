import { $API } from "@/api";

export interface EditLessonParams {
  id: number;
  cid: string;
  title: string;
  description: string;
  courseId: number;
}

export const editLesson = async (params: EditLessonParams) => {
  return $API.put(`/course/private/lesson/${params.id}`, {
    cid: params.cid,
    title: params.title,
    description: params.description,
    courseId: params.courseId,
  });
};
