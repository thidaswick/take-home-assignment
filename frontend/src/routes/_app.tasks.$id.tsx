import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTask, updateTask } from "@/lib/api/tasks";
import type { TaskStatus } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { PageTransition } from "@/components/app/PageTransition";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  User as UserIcon,
  MessageCircle,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().trim().min(3, "At least 3 characters").max(120),
  description: z.string().trim().max(2000).default(""),
  status: z.enum(["todo", "in_progress", "completed", "overdue"]),
  dueDate: z.string().min(1, "Required"),
});

export const Route = createFileRoute("/_app/tasks/$id")({ component: TaskDetails });

function TaskDetails() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", user?.id, id],
    queryFn: () => getTask(id),
    enabled: !!user,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", status: "todo", dueDate: "" },
  });

  useEffect(() => {
    if (!task) return;
    form.reset({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate.slice(0, 10),
    });
  }, [task, form]);

  const save = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      updateTask(id, { ...values, dueDate: new Date(values.dueDate).toISOString() }),
    onSuccess: async (updated) => {
      await qc.invalidateQueries({ queryKey: ["tasks", user?.id] });
      qc.setQueryData(["tasks", user?.id, id], updated);
      setEditing(false);
      toast.success("Task updated");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update task"),
  });

  const markComplete = useMutation({
    mutationFn: () => updateTask(id, { status: "completed" }),
    onSuccess: async (updated) => {
      await qc.invalidateQueries({ queryKey: ["tasks", user?.id] });
      qc.setQueryData(["tasks", user?.id, id], updated);
      toast.success("Task marked complete");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update task"),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (isError || !task) {
    return (
      <div className="mx-auto max-w-4xl rounded-xl border bg-card p-6">
        Task not found.{" "}
        <Link to="/tasks" className="text-primary hover:underline">
          Back to tasks
        </Link>
      </div>
    );
  }

  const isCompleted = task.status === "completed";

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" asChild className="-ml-2">
          <Link to="/tasks">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to tasks
          </Link>
        </Button>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          {editing ? (
            <form
              onSubmit={form.handleSubmit((values) => save.mutate(values))}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Edit task</h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={save.isPending}
                    className="gradient-brand text-white"
                  >
                    {save.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={6} {...form.register("description")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) => form.setValue("status", v as TaskStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Pending</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" type="date" {...form.register("dueDate")} />
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <StatusBadge status={task.status} />
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight">{task.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                  <Button
                    className="gradient-brand text-white"
                    disabled={isCompleted || markComplete.isPending}
                    onClick={() => markComplete.mutate()}
                  >
                    {markComplete.isPending
                      ? "Saving..."
                      : isCompleted
                        ? "Completed"
                        : "Mark complete"}
                  </Button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Meta icon={UserIcon} label="Owner" value={task.ownerName} />
                <Meta
                  icon={CalendarDays}
                  label="Due date"
                  value={new Date(task.dueDate).toLocaleDateString()}
                />
                <Meta
                  icon={Clock}
                  label="Updated"
                  value={new Date(task.updatedAt).toLocaleString()}
                />
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold">Timeline</h3>
            <ol className="mt-4 space-y-4">
              {[
                { t: "Created", d: task.createdAt, who: task.ownerName },
                { t: "Status updated", d: task.updatedAt, who: task.ownerName },
              ].map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{e.t}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.who} · {new Date(e.d).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Comments</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Comments will appear here once the API is wired.
            </p>
            <div className="mt-4 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
              Placeholder — connect to <code>/api/tasks/{"{id}"}/comments</code>.
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Meta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
