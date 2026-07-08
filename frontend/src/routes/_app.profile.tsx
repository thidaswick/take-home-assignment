import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageTransition } from "@/components/app/PageTransition";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and account.
          </p>
        </header>

        <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl gradient-brand text-xl font-semibold text-white">
            {(user.firstName[0] ?? "") + (user.lastName[0] ?? "")}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-2 capitalize" variant="secondary">
              {user.role}
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold">Personal information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>First name</Label>
              <Input defaultValue={user.firstName} />
            </div>
            <div className="space-y-1.5">
              <Label>Last name</Label>
              <Input defaultValue={user.lastName} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} type="email" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => toast.success("Profile saved")}
              className="gradient-brand text-white hover:opacity-95"
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold">Change password</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Current password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => toast.success("Password updated")}>
              Update password
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="mr-1 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
