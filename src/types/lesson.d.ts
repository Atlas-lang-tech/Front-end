export interface Lesson {
  id: number;
  cid: string;
  title: string;
  description: string | null;
  order: number;
  courseId: number;
}
