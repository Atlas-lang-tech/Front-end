import { useMutation } from "@pinia/colada";
import { purchaseCourse, type PurchaseCourseParams } from ".";

export const usePurchaseCourse = () => {
  return useMutation({
    mutation: (params: PurchaseCourseParams) => purchaseCourse(params),
  });
};
