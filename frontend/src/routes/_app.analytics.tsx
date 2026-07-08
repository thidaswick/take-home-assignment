import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/app/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { listTasks } from "@/lib/api/tasks";
import { useAuth } from "@/lib/auth/AuthContext";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, Legend } from "recharts";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { user } = useAuth();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: listTasks,
    enabled: !!user,
  });

  const statusData = [
    { name: "Pending", value: tasks.filter((t) => t.status === "todo").length },
    { name: "In progress", value: tasks.filter((t) => t.status === "in_progress").length },
    { name: "Completed", value: tasks.filter((t) => t.status === "completed").length },
    { name: "Overdue", value: tasks.filter((t) => t.status === "overdue").length },
  ];

  const velocity = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
    created: Math.max(1, Math.round(Math.sin(i) * 3 + 6)),
    completed: Math.max(1, Math.round(Math.cos(i) * 3 + 5)),
  }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Understand throughput and where the team spends time.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Tasks by status</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Weekly velocity</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="created" stroke="var(--brand-2)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="completed" stroke="var(--success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
