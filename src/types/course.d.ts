export interface Course {
  id: string;
  title: string;
  cid: string;
  description: string;
  icon: string;

  languageId: number;
  languageLvlId: number;
  categoryId?: number;
}
