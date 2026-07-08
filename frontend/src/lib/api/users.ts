import { api } from "./client";
import { mapUser, type ApiUserDto } from "./mappers";
import type { User } from "./types";

const MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_USERS: User[] = [
  { id: "u_1", firstName: "Alex", lastName: "Rivera", email: "alex@company.com", role: "user" },
  { id: "u_admin", firstName: "Ada", lastName: "Admin", email: "admin@company.com", role: "admin" },
];

export async function listUsers(): Promise<User[]> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [...MOCK_USERS];
  }
  const { data } = await api.get<ApiUserDto[]>("/users");
  return data.map(mapUser);
}
