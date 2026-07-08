import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="text-base font-semibold tracking-tight">
          Task<span className="text-gradient-brand">Flow</span> AI
        </span>
      )}
    </Link>
  );
}
