import { useMutation } from "@pinia/colada";
import { studyAnswer, type StudyAnswerParams } from ".";

export const useStudyAnswer = () => {
  return useMutation({
    mutation: (params: StudyAnswerParams) => studyAnswer(params),
  });
};
