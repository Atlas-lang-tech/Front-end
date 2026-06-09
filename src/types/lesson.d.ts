export interface Lesson {
  id: number;
  cid: string;
  title: string;
  description: string | null;
  icon: string | null;
  order: number;
  courseId: number;
}
