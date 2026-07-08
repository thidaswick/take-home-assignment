import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, PlusCircle, BarChart3, Sparkles, User as UserIcon, Shield, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/tasks/new", label: "Create Task", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="flex h-full w-full flex-col gap-2 border-r bg-sidebar px-4 py-5">
      <div className="px-1 pb-3">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const label = item.to === "/tasks" && isAdmin ? "All Tasks" : item.label;
          const active =
            pathname === item.to ||
            (item.to !== "/dashboard" && pathname.startsWith(item.to + "/"));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={onNavigate}
            className={cn(
              "mt-1 inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
            )}
          >
            <Shield className={cn("h-4 w-4", pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground")} />
            <span>Admin</span>
            <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Admin</span>
          </Link>
        )}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-brand text-sm font-semibold text-white">
              {user ? (user.firstName[0] ?? "") + (user.lastName[0] ?? "") : "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => { logout(); onNavigate?.(); }}
          className="inline-flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
