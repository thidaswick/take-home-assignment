import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, listTasks } from "@/lib/api/tasks";
import { listUsers } from "@/lib/api/users";
import type { Task, TaskStatus } from "@/lib/api/types";
import { StatusBadge } from "@/components/app/StatusBadge";
import { PageTransition } from "@/components/app/PageTransition";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, ListChecks, Plus, Search, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks/")({ component: TasksPage });

const PAGE_SIZE = 6;

function TasksPage() {
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [owner, setOwner] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string[]>([]);

  const apiStatus = isAdmin && status !== "all" && status !== "overdue" ? status : undefined;
  const apiOwnerId = isAdmin && owner !== "all" ? owner : undefined;

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    enabled: isAdmin,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", user?.id, { owner: apiOwnerId, status: apiStatus }],
    queryFn: () => listTasks({ ownerId: apiOwnerId, status: apiStatus, pageSize: 100 }),
    enabled: !!user,
  });

  const del = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) await deleteTask(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Deleted");
      setSelected(new Set());
      setConfirmOpen(false);
    },
  });

  const filtered = useMemo(() => {
    let list = (tasks ?? []).filter((t) => {
      if (status === "overdue" && t.status !== "overdue") return false;
      if (!isAdmin && status !== "all" && t.status !== status) return false;
      if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    list = list.sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1) * (sortDesc ? 1 : -1));
    return list;
  }, [tasks, q, status, sortDesc, isAdmin]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () => {
    if (pageItems.every((t) => selected.has(t.id))) {
      const n = new Set(selected);
      pageItems.forEach((t) => n.delete(t.id));
      setSelected(n);
    } else {
      const n = new Set(selected);
      pageItems.forEach((t) => n.add(t.id));
      setSelected(n);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "View and manage tasks across all users."
                : "Manage, filter and prioritise your workload."}
            </p>
          </div>
          <Button asChild className="shrink-0 gradient-brand text-white hover:opacity-95">
            <Link to="/tasks/new">
              <Plus className="mr-1 h-4 w-4" /> New task
            </Link>
          </Button>
        </header>

        <div className="rounded-2xl border bg-card shadow-sm">
          <div
            className={`grid gap-3 border-b p-4 ${isAdmin ? "md:grid-cols-[1fr_auto_auto_auto]" : "md:grid-cols-[1fr_auto_auto]"}`}
          >
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as TaskStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="todo">Pending</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            {isAdmin && (
              <Select
                value={owner}
                onValueChange={(v) => {
                  setOwner(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {`${u.firstName} ${u.lastName}`.trim() || u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" onClick={() => setSortDesc((s) => !s)}>
              <ArrowUpDown className="mr-1 h-4 w-4" /> Due date
            </Button>
          </div>

          {selected.size > 0 && (
            <div className="flex items-center justify-between border-b bg-primary/5 px-4 py-2 text-sm">
              <span>{selected.size} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setToDelete(Array.from(selected));
                  setConfirmOpen(true);
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No tasks match"
              description="Try adjusting your filters or create a new task."
              action={
                <Button asChild className="gradient-brand text-white">
                  <Link to="/tasks/new">Create task</Link>
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={pageItems.length > 0 && pageItems.every((t) => selected.has(t.id))}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Due date</TableHead>
                    {isAdmin && <TableHead className="hidden lg:table-cell">Owner</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((t: Task) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(t.id)}
                          onCheckedChange={() => toggle(t.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to="/tasks/$id" params={{ id: t.id }} className="hover:underline">
                          {t.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden max-w-[320px] truncate text-muted-foreground md:table-cell">
                        {t.description}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {new Date(t.dueDate).toLocaleDateString()}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="hidden lg:table-cell">{t.ownerName}</TableCell>
                      )}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/tasks/$id" params={{ id: t.id }}>
                            Open
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setToDelete([t.id]);
                            setConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t p-3 text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages} · {filtered.length} tasks
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {toDelete.length} task{toDelete.length > 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => del.mutate(toDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
