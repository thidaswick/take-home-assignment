import { api } from "./client";
import {
  mapTask,
  toBackendStatusFilter,
  toBackendTaskPayload,
  type ApiPagedResult,
  type ApiTaskDto,
} from "./mappers";
import type { ListTasksOptions, Task, TaskStatus } from "./types";

const MOCK = import.meta.env.VITE_USE_MOCK === "true";

const now = () => new Date().toISOString();

let MOCK_TASKS: Task[] = [];

export async function listTasks(options: ListTasksOptions = {}): Promise<Task[]> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    let items = [...MOCK_TASKS];
    if (options.ownerId) items = items.filter((t) => t.ownerId === options.ownerId);
    if (options.status && options.status !== "all" && options.status !== "overdue") {
      items = items.filter((t) => t.status === options.status);
    }
    return items;
  }

  const params: Record<string, string | number> = {
    pageNumber: options.pageNumber ?? 1,
    pageSize: options.pageSize ?? 100,
  };

  if (options.ownerId) params.owner = options.ownerId;
  if (options.status && options.status !== "all" && options.status !== "overdue") {
    params.status = toBackendStatusFilter(options.status);
  }

  const { data } = await api.get<ApiPagedResult<ApiTaskDto>>("/tasks", { params });
  return data.items.map(mapTask);
}

export async function getTask(id: string): Promise<Task> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const t = MOCK_TASKS.find((x) => x.id === id);
    if (!t) throw new Error("Not found");
    return t;
  }
  const { data } = await api.get<ApiTaskDto>(`/tasks/${id}`);
  return mapTask(data);
}

export async function createTask(
  input: Omit<Task, "id" | "createdAt" | "updatedAt" | "ownerId" | "ownerName"> & { ownerId?: string },
): Promise<Task> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const t: Task = {
      ...input,
      id: "t" + Math.random().toString(36).slice(2, 7),
      ownerId: input.ownerId ?? "u_1",
      ownerName: "You",
      createdAt: now(),
      updatedAt: now(),
    };
    MOCK_TASKS = [t, ...MOCK_TASKS];
    return t;
  }
  const { data } = await api.post<ApiTaskDto>("/tasks", toBackendTaskPayload(input));
  return mapTask(data);
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    MOCK_TASKS = MOCK_TASKS.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t));
    return MOCK_TASKS.find((t) => t.id === id)!;
  }
  const current = await getTask(id);
  const merged = { ...current, ...patch };
  const { data } = await api.put<ApiTaskDto>(`/tasks/${id}`, toBackendTaskPayload(merged));
  return mapTask(data);
}

export async function deleteTask(id: string): Promise<void> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    MOCK_TASKS = MOCK_TASKS.filter((t) => t.id !== id);
    return;
  }
  await api.delete(`/tasks/${id}`);
}
