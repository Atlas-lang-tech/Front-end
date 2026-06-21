import { useMutation } from "@pinia/colada";
import { setProductPrice, type SetProductPriceParams } from ".";

export const useSetProductPrice = () => {
  return useMutation({
    mutation: (params: SetProductPriceParams) => setProductPrice(params),
  });
};
