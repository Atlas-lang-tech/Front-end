import type { Lesson } from "@/types/lesson";

export const isLessonLocked = (
  _lesson: Lesson,
  _orderedLessons: Lesson[],
): boolean => {
  // TODO(progress): lock lesson N until lesson N-1 is passed.
  // Requires backend progress persistence. Until then every lesson is unlocked.
  return false;
};
