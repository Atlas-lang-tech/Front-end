import { $API } from "@/api";
import type { CustomResponse } from "@/types/response";
import type { Word } from "@/types/vocabulary";

export interface StudyAnswerParams {
  wordId: number;
  correct: boolean;
}

export const studyAnswer = async (
  params: StudyAnswerParams,
): Promise<CustomResponse<Word>> => {
  const response = await $API.post<CustomResponse<Word>>(
    "/vocabulary/private/study/answer",
    {
      wordId: params.wordId,
      correct: params.correct,
    },
    {},
  );
  return response.data;
};
