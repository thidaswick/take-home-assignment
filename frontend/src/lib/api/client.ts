import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5108/api";

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function formatApiError(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const body = data as Record<string, unknown>;
  if (typeof body.title === "string" && body.title) return body.title;
  if (typeof body.message === "string" && body.message) return body.message;
  const errors = body.errors as Record<string, string[] | string> | undefined;
  if (errors) {
    const first = Object.values(errors).flat()[0];
    if (typeof first === "string") return first;
  }
  return null;
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authToken ?? (typeof window !== "undefined" ? window.localStorage.getItem("taskflow.token") : null);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("taskflow.token");
      window.localStorage.removeItem("taskflow.user");
      setAuthToken(null);
      onUnauthorized?.();
    }
    const message =
      formatApiError(error?.response?.data) ||
      (error?.code === "ERR_NETWORK" ? "Cannot reach the API. Is the backend running on port 5108?" : null) ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  },
);
