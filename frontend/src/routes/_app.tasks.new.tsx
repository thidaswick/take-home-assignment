import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api/tasks";
import { listUsers } from "@/lib/api/users";
import { generateAiSuggestions } from "@/lib/api/ai";
import type { TaskStatus } from "@/lib/api/types";
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
import { PageTransition } from "@/components/app/PageTransition";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const schema = z.object({
  title: z.string().trim().min(3, "At least 3 characters").max(120),
  description: z.string().trim().max(2000).default(""),
  status: z.enum(["todo", "in_progress", "completed", "overdue"]),
  dueDate: z.string().min(1, "Required"),
  ownerId: z.string().optional(),
});

export const Route = createFileRoute("/_app/tasks/new")({ component: NewTaskPage });

function NewTaskPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [aiLoading, setAiLoading] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    enabled: isAdmin,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo" as TaskStatus,
      dueDate: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
      ownerId: user?.id,
    },
  });

  const create = useMutation({
    mutationFn: (v: z.infer<typeof schema>) =>
      createTask({
        title: v.title,
        description: v.description,
        status: v.status,
        dueDate: new Date(v.dueDate).toISOString(),
        ownerId: isAdmin && v.ownerId ? v.ownerId : undefined,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
      navigate({ to: "/tasks" });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create task"),
  });

  async function fillWithAi() {
    const title = form.getValues("title");
    if (!title) {
      toast.error("Add a title first");
      return;
    }
    setAiLoading(true);
    try {
      const s = await generateAiSuggestions({ title, description: form.getValues("description") });
      form.setValue("description", s.improvedDescription, { shouldValidate: true });
      toast.success("AI enhanced your description");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create task</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Create a task for yourself or assign it to another user."
              : "Capture the essentials — you can refine details later."}
          </p>
        </header>

        <form
          onSubmit={form.handleSubmit((v) => create.mutate(v))}
          className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Wire up SignalR channel"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillWithAi}
                disabled={aiLoading}
              >
                <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" />{" "}
                {aiLoading ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="description"
              rows={6}
              placeholder="What needs to happen and why?"
              {...form.register("description")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as TaskStatus, { shouldValidate: true })
                }
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
              {form.formState.errors.dueDate && (
                <p className="text-xs text-destructive">{form.formState.errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="space-y-1.5">
              <Label>Assign to</Label>
              <Select
                value={form.watch("ownerId") ?? user?.id}
                onValueChange={(v) => form.setValue("ownerId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {`${u.firstName} ${u.lastName}`.trim() || u.email} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/tasks" })}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending}
              className="gradient-brand text-white hover:opacity-95"
            >
              {create.isPending ? "Saving..." : "Save task"}
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
