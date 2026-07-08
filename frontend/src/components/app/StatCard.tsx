import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "brand" | "warning" | "success" | "danger" | "cyan";
  index?: number;
}

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  brand: "bg-primary/10 text-primary",
  warning: "bg-warning/15 text-warning-foreground dark:text-warning",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/10 text-destructive",
  cyan: "bg-accent-cyan/15 text-accent-cyan",
};

export function StatCard({ label, value, delta, icon: Icon, tone = "brand", index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
        </div>
        <span
          className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", toneStyles[tone])}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
