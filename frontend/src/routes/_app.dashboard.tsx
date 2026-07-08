import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  ListChecks,
  AlertTriangle,
  PlayCircle,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { PageTransition } from "@/components/app/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { listTasks } from "@/lib/api/tasks";
import { StatusBadge } from "@/components/app/StatusBadge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/lib/auth/AuthContext";
import { formatDueDate } from "@/lib/date";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { user } = useAuth();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: listTasks,
    enabled: !!user,
  });

  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
  };
  const done = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

  const pieData = [
    { name: "Pending", value: counts.pending, color: "var(--muted-foreground)" },
    { name: "In progress", value: counts.inProgress, color: "var(--primary)" },
    { name: "Completed", value: counts.completed, color: "var(--success)" },
    { name: "Cancelled", value: counts.cancelled, color: "var(--border)" },
    { name: "Overdue", value: counts.overdue, color: "var(--destructive)" },
  ].filter((d) => d.value > 0);

  const recent = [...tasks].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 5);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of everything your team is working on.
            </p>
          </div>
          <Button asChild className="gradient-brand text-white hover:opacity-95">
            <Link to="/tasks/new">Create task</Link>
          </Button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Tasks"
            value={counts.total}
            icon={ListChecks}
            tone="brand"
            index={0}
          />
          <StatCard label="Pending" value={counts.pending} icon={Clock} tone="warning" index={1} />
          <StatCard
            label="In Progress"
            value={counts.inProgress}
            icon={PlayCircle}
            tone="cyan"
            index={2}
          />
          <StatCard
            label="Completed"
            value={counts.completed}
            icon={CheckCircle2}
            tone="success"
            index={3}
          />
          <StatCard
            label="Overdue"
            value={counts.overdue}
            icon={AlertTriangle}
            tone="danger"
            index={4}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-1">
            <h3 className="text-sm font-semibold">Task status</h3>
            <p className="text-xs text-muted-foreground">Distribution across your workspace</p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Task progress</h3>
                <p className="text-xs text-muted-foreground">Overall completion this week</p>
              </div>
              <span className="text-2xl font-semibold">{done}%</span>
            </div>
            <Progress value={done} className="mt-4 h-2" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {[
                { l: "Pending", v: counts.pending, c: "text-muted-foreground" },
                { l: "In progress", v: counts.inProgress, c: "text-primary" },
                { l: "Completed", v: counts.completed, c: "text-success" },
                { l: "Cancelled", v: counts.cancelled, c: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border p-3">
                  <div className={"text-xl font-semibold " + s.c}>{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent activity</h3>
              <p className="text-xs text-muted-foreground">Latest task updates</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tasks">
                View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    to="/tasks/$id"
                    params={{ id: t.id }}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {t.title}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.ownerName} · Due {formatDueDate(t.dueDate)}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageTransition>
  );
}
