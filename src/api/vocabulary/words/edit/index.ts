import { $API } from "@/api";

export interface EditWordParams {
  id: number;
  word?: string;
  translation?: string;
  transcription?: string;
  example?: string;
  description?: string;
}

export const editWord = async (params: EditWordParams) => {
  return $API.patch(
    `/vocabulary/private/words/${params.id}`,
    {
      word: params.word,
      translation: params.translation,
      transcription: params.transcription,
      example: params.example,
      description: params.description,
    },
    {},
  );
};
