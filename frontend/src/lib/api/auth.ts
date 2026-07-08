import { api } from "./client";
import { mapAuthResponse, type ApiAuthResponse } from "./mappers";
import type { AuthResponse } from "./types";

export interface LoginPayload { email: string; password: string; remember?: boolean }
export interface RegisterPayload { firstName: string; lastName: string; email: string; password: string }

const MOCK = import.meta.env.VITE_USE_MOCK === "true";

function mockToken(user: { id: string; role: string }) {
  return btoa(JSON.stringify({ sub: user.id, role: user.role, iat: Date.now() }));
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const isAdmin = payload.email.toLowerCase().startsWith("admin");
    const user = {
      id: isAdmin ? "u_admin" : "u_1",
      firstName: isAdmin ? "Ada" : "Alex",
      lastName: isAdmin ? "Admin" : "Rivera",
      email: payload.email,
      role: isAdmin ? ("admin" as const) : ("user" as const),
    };
    return { token: mockToken(user), user };
  }
  const { data } = await api.post<ApiAuthResponse>("/auth/login", {
    email: payload.email,
    password: payload.password,
  });
  return mapAuthResponse(data);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const user = {
      id: "u_" + Math.random().toString(36).slice(2, 8),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: "user" as const,
    };
    return { token: mockToken(user), user };
  }
  const { data } = await api.post<ApiAuthResponse>("/auth/register", payload);
  return mapAuthResponse(data);
}
