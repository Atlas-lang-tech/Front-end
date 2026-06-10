import type { LessonResult } from "./lesson-player.types";

export const submitLessonResult = async (
  result: LessonResult,
): Promise<LessonResult> => {
  // TODO(progress): when the backend endpoint exists, move this into
  // src/api/lessons/result/submit/ (index.ts + useLessonResultSubmit.ts)
  // following the API layer pattern, e.g.:
  // return $API.post(`/lesson/${result.lessonId}/result`, { ...result }, {})
  return Promise.resolve(result);
};
