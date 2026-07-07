import type { Lesson } from "@/types/lesson";

export const isLessonLocked = (
  lesson: Lesson,
  orderedLessons: Lesson[],
  completedLessonIds: number[],
): boolean => {
  const index = orderedLessons.findIndex((l) => l.id === lesson.id);
  if (index <= 0) return false;
  return !completedLessonIds.includes(orderedLessons[index - 1].id);
};
