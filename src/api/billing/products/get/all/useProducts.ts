import { useQuery } from "@pinia/colada";
import { getAllProducts } from "./index";

export const useProducts = () => {
  return useQuery({
    key: ["billing-products"],
    query: () => getAllProducts(),
  });
};
