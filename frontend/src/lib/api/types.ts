export type TaskStatus = "todo" | "in_progress" | "completed" | "overdue";
export type Role = "user" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AiSuggestion {
  improvedDescription: string;
  suggestedPriority: "low" | "medium" | "high";
  estimatedHours: number;
  subtasks: string[];
  acceptanceCriteria: string[];
  developerNotes: string;
}
