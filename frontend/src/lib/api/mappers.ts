import type { Role, Task, TaskStatus, User } from "./types";

export interface ApiUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number | string;
  createdAt?: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  expiresAt: string;
  user: ApiUserDto;
}

export interface ApiTaskDto {
  id: string;
  title: string;
  description: string;
  status: number;
  dueDate: string | null;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiPagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const BackendTaskStatus = {
  Pending: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
} as const;

export function mapRole(role: number | string): Role {
  if (role === 1 || role === "Admin" || role === "admin") return "admin";
  return "user";
}

export function mapUser(dto: ApiUserDto): User {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    role: mapRole(dto.role),
    createdAt: dto.createdAt,
  };
}

export function mapAuthResponse(dto: ApiAuthResponse) {
  return { token: dto.accessToken, user: mapUser(dto.user) };
}

function isOverdue(dueDate: string | null | undefined, status: number): boolean {
  if (!dueDate) return false;
  if (status === BackendTaskStatus.Completed || status === BackendTaskStatus.Cancelled)
    return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dueDate);
  if (!match) return new Date(dueDate) < new Date();
  const due = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59);
  return due < new Date();
}

export function mapTaskStatus(status: number, dueDate?: string | null): TaskStatus {
  if (status === BackendTaskStatus.Cancelled) return "cancelled";
  if (isOverdue(dueDate, status)) return "overdue";
  switch (status) {
    case BackendTaskStatus.InProgress:
      return "in_progress";
    case BackendTaskStatus.Completed:
      return "completed";
    default:
      return "todo";
  }
}

export function mapTask(dto: ApiTaskDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    status: mapTaskStatus(dto.status, dto.dueDate),
    dueDate: dto.dueDate ?? new Date().toISOString(),
    ownerId: dto.ownerId,
    ownerName: dto.ownerEmail,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
  };
}

export function toBackendStatus(status: TaskStatus): number {
  if (status === "in_progress") return BackendTaskStatus.InProgress;
  if (status === "completed") return BackendTaskStatus.Completed;
  if (status === "cancelled") return BackendTaskStatus.Cancelled;
  // "overdue" is a derived UI state; persist as Pending until due date still applies.
  return BackendTaskStatus.Pending;
}

export function toBackendTaskPayload(input: {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  ownerId?: string;
}) {
  return {
    title: input.title,
    description: input.description,
    status: toBackendStatus(input.status),
    dueDate: input.dueDate || null,
    ...(input.ownerId ? { ownerId: input.ownerId } : {}),
  };
}

export function toBackendStatusFilter(status: TaskStatus): number {
  return toBackendStatus(status);
}
