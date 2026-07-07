import { $API } from "@/api";
import type { ProgressStats } from "@/types/progress";
import type { CustomResponse } from "@/types/response";

export const getProgressStats = async (): Promise<
  CustomResponse<ProgressStats>
> => {
  const response = await $API.get<CustomResponse<ProgressStats>>(
    "/course/private/progress/stats",
  );
  return response.data;
};
