import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { PageTransition } from "@/components/app/PageTransition";
import { StatCard } from "@/components/app/StatCard";
import { Users, ListChecks, CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listTasks } from "@/lib/api/tasks";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/admin")({ component: AdminPage });

const MOCK_USERS = [
  { id: "u_1", name: "Alex Rivera", email: "alex@company.com", role: "user", joined: "2 days ago" },
  { id: "u_2", name: "Priya Shah", email: "priya@company.com", role: "user", joined: "5 days ago" },
  { id: "u_3", name: "Marco Bianchi", email: "marco@company.com", role: "user", joined: "1 week ago" },
  { id: "u_admin", name: "Ada Admin", email: "admin@company.com", role: "admin", joined: "3 weeks ago" },
];

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user && user.role !== "admin") navigate({ to: "/dashboard", replace: true }); }, [user, navigate]);
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: listTasks });

  if (!user || user.role !== "admin") return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Operational overview for administrators.</p>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary" variant="secondary">Admin</Badge>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={MOCK_USERS.length} icon={Users} tone="brand" index={0} />
          <StatCard label="Total tasks" value={tasks.length} icon={ListChecks} tone="cyan" index={1} />
          <StatCard label="Completed tasks" value={tasks.filter((t) => t.status === "completed").length} icon={CheckCircle2} tone="success" index={2} />
          <StatCard label="Pending tasks" value={tasks.filter((t) => t.status === "todo").length} icon={Clock} tone="warning" index={3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Recent users</h3>
            <ul className="mt-3 divide-y">
              {MOCK_USERS.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-brand text-xs font-semibold text-white">
                    {u.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">{u.joined}</span>
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
