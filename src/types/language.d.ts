export interface Language {
  id: number;
  name: string;
  code: string;
  icon: string;
}

export interface LanguageLevel {
  id: number;
  name: string;
  languageId: number;
}
