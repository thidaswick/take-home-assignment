import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const styles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground border-transparent",
  in_progress: "bg-primary/10 text-primary border-transparent",
  completed: "bg-success/15 text-success border-transparent",
  overdue: "bg-destructive/10 text-destructive border-transparent",
};

const labels: Record<TaskStatus, string> = {
  todo: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", styles[status], className)}>
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          status === "todo" && "bg-muted-foreground",
          status === "in_progress" && "bg-primary",
          status === "completed" && "bg-success",
          status === "overdue" && "bg-destructive",
        )}
      />
      {labels[status]}
    </Badge>
  );
}
