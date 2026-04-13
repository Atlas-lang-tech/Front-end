export interface Language {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface LanguageLevel {
  id: string;
  name: string;
  languageId: string;
}
