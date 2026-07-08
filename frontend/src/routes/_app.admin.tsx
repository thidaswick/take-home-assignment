import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageTransition } from "@/components/app/PageTransition";
import { StatCard } from "@/components/app/StatCard";
import { Users, ListChecks, CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listTasks } from "@/lib/api/tasks";
import { listUsers } from "@/lib/api/users";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/AuthContext";
import type { User } from "@/lib/api/types";

export const Route = createFileRoute("/_app/admin")({
  beforeLoad: () => {
    try {
      const raw = localStorage.getItem("taskflow.user");
      const user = raw ? JSON.parse(raw) : null;
      if (!user || user.role !== "admin") {
        throw redirect({ to: "/dashboard" });
      }
    } catch (error) {
      if (error && typeof error === "object" && "to" in error) throw error;
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminPage,
});

function formatJoined(date?: string): string {
  if (!date) return "—";
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString();
}

function displayName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

function AdminPage() {
  const { isAdmin } = useAuth();
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    enabled: isAdmin,
  });
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", "admin"],
    queryFn: () => listTasks({ pageSize: 100 }),
    enabled: isAdmin,
  });

  if (!isAdmin) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Operational overview for administrators.
            </p>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary" variant="secondary">
            Admin
          </Badge>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total users"
            value={usersLoading ? "…" : users.length}
            icon={Users}
            tone="brand"
            index={0}
          />
          <StatCard
            label="Total tasks"
            value={tasksLoading ? "…" : tasks.length}
            icon={ListChecks}
            tone="cyan"
            index={1}
          />
          <StatCard
            label="Completed tasks"
            value={tasks.filter((t) => t.status === "completed").length}
            icon={CheckCircle2}
            tone="success"
            index={2}
          />
          <StatCard
            label="Pending tasks"
            value={tasks.filter((t) => t.status === "todo").length}
            icon={Clock}
            tone="warning"
            index={3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Recent users</h3>
            <ul className="mt-3 divide-y">
              {users.slice(0, 8).map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-brand text-xs font-semibold text-white">
                    {displayName(u)
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{displayName(u)}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {u.role}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatJoined(u.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Recent tasks</h3>
            <ul className="mt-3 divide-y">
              {tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.ownerName}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
