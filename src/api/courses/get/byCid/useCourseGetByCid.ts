import { useQuery } from "@pinia/colada";
import { getCourseByCid } from "./index";

export const useCourseGetByCid = (cid: string) => {
  return useQuery({
    key: ["courses-by-cid", cid],
    query: () => getCourseByCid({ cid }),
  });
};
