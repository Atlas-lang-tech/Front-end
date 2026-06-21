export interface ApiError {
  status?: number;
  message?: string;
}

export const getApiError = (error: unknown): ApiError => {
  const e = error as {
    response?: { status?: number; data?: { message?: string } };
  };

  return {
    status: e?.response?.status,
    message: e?.response?.data?.message,
  };
};
