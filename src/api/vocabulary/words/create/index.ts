import { $API } from "@/api";

export interface CreateWordParams {
  dictionaryId: number;
  word: string;
  translation: string;
  transcription?: string;
  example?: string;
  description?: string;
}

export const createWord = async (params: CreateWordParams) => {
  return $API.post(
    "/vocabulary/private/words",
    {
      dictionaryId: params.dictionaryId,
      word: params.word,
      translation: params.translation,
      transcription: params.transcription,
      example: params.example,
      description: params.description,
    },
    {},
  );
};
