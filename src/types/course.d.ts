export interface Course {
  id: string;
  title: string;
  cid: string;
  description: string;
  icon: string;

  isFree: boolean;
  isVisible: boolean;

  languageId: number;
  nativeLanguageId: number | null;
  languageLvlId: number;
  categoryId?: number;
}
