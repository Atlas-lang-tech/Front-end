import type { NotFetchResponse } from "@astralis-os/notfetch";

export interface CustomResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type Response<T> = NotFetchResponse<CustomResponse<T>>;
