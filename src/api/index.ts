import notfetch from "@astralis-os/notfetch";
import { router } from "@/app/router/router";
import { $PAGES } from "@/app/configs/pages.config";

const API_URL = import.meta.env.VITE_API_URL;

// ================= TOKENS =================

const getAccessToken = () => localStorage.getItem("accessToken");

const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

// ================= REFRESH STATE =================

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const subscribe = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const notify = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

// ================= REFRESH =================

const refreshAccessToken = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    clearTokens();
    router.push("/login");
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  setAccessToken(data.accessToken);

  return data.accessToken;
};

// ================= INSTANCE =================

export const $API = notfetch.create({
  baseURL: API_URL,
});

// ================= REQUEST INTERCEPTOR =================

$API.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = {
      ...(config.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});
// ================= RESPONSE INTERCEPTOR =================

$API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.request;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // защита от бесконечного цикла
    if (originalRequest._retry) {
      clearTokens();
      router.push("/login");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ===== ЕСЛИ УЖЕ РЕФРЕШИТСЯ =====
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribe((token) => {
          try {
            originalRequest.headers = {
              ...((originalRequest.headers as Record<string, string>) || {}),
              Authorization: `Bearer ${token}`,
            };
            resolve(
              $API.post(error.response.url, {
                ...originalRequest,
                headers: {
                  ...(originalRequest.headers as Record<string, string>),
                  Authorization: `Bearer ${token}`,
                },
              }),
            );
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    // ===== СТАРТ REFRESH =====
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      notify(newToken);

      originalRequest.headers = {
        ...((originalRequest.headers as Record<string, string>) || {}),
        Authorization: `Bearer ${newToken}`,
      };

      return $API.post(error.response.url, {
        ...originalRequest,
        headers: {
          ...(originalRequest.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (err) {
      clearTokens();
      router.push($PAGES.auth.login);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
