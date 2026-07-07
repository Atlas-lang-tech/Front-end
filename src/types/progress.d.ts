export interface CourseProgress {
  completed: number;
  total: number;
  lessonIds: number[];
}

export interface LessonCompletion {
  id: number;
  userId: string;
  lessonId: number;
  courseId: number;
  completedAt: string;
}

export interface ProgressStats {
  totalCompletions: number;
  activeLearners: number;
  activeToday: number;
  completionsLast7d: number;
  dailyCompletions: { date: string; count: number }[];
  topCourses: { courseId: number; title: string; completions: number }[];
}
