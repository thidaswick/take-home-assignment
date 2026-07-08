import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingHeader";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: ShieldCheck,
    title: "JWT Authentication",
    desc: "Secure, stateless auth with role-based access baked in.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    desc: "SignalR-powered live task sync across every connected client.",
  },
  {
    icon: Sparkles,
    title: "AI Task Assistant",
    desc: "Turn a title into subtasks, estimates and acceptance criteria.",
  },
  {
    icon: Users,
    title: "Role Based Access",
    desc: "Granular Admin & User surfaces with policy-based guards.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track velocity, status mix and overdue trends at a glance.",
  },
  {
    icon: CheckCircle2,
    title: "Built to Ship",
    desc: "Production-grade ASP.NET Core API + typed React frontend.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
              >
                <Sparkles className="mr-1.5 h-3 w-3" /> New — AI Assistant is live
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                Ship work faster with <span className="text-gradient-brand">AI-powered</span> task
                management
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
                TaskFlow AI blends a premium dashboard with real-time collaboration and an AI
                copilot that turns rough ideas into concrete, shippable tasks — powered by an
                ASP.NET Core backend.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gradient-brand text-white shadow-lg shadow-primary/20 hover:opacity-95"
                >
                  <Link to="/register">
                    Start Managing Tasks <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/features">Explore features</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="relative mx-auto mt-16 max-w-5xl"
            >
              <div className="rounded-2xl border bg-card/70 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
                <div className="rounded-xl border bg-gradient-to-b from-background to-muted/40 p-4">
                  <DashboardPreview />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">
              Features
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Everything a modern team needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              A cohesive workflow — from capturing an idea to shipping the change.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-brand group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border gradient-brand p-10 text-white shadow-xl md:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Ready to give your team superpowers?
                </h3>
                <p className="mt-2 text-white/80">
                  Spin up a workspace in under a minute. No credit card required.
                </p>
              </div>
              <Button size="lg" variant="secondary" asChild className="shrink-0">
                <Link to="/register">
                  Start Managing Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
      <div className="hidden flex-col gap-2 rounded-lg border bg-card p-3 md:flex">
        {["Dashboard", "My Tasks", "Analytics", "AI Assistant", "Profile"].map((l, i) => (
          <div
            key={l}
            className={
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs " +
              (i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground")
            }
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-full " + (i === 0 ? "bg-primary" : "bg-muted-foreground/50")
              }
            />
            {l}
          </div>
        ))}
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Total", v: "128", t: "text-primary" },
            { l: "Pending", v: "42", t: "text-muted-foreground" },
            { l: "In progress", v: "31", t: "text-accent-cyan" },
            { l: "Completed", v: "55", t: "text-success" },
          ].map((c) => (
            <div key={c.l} className="rounded-lg border bg-card p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {c.l}
              </div>
              <div className={"mt-1 text-lg font-semibold " + c.t}>{c.v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium">Recent tasks</span>
            <span className="text-muted-foreground">Today</span>
          </div>
          <div className="space-y-2">
            {[
              { t: "Design onboarding flow", s: "In progress", c: "text-primary bg-primary/10" },
              { t: "Implement JWT refresh", s: "Pending", c: "text-muted-foreground bg-muted" },
              { t: "Write integration tests", s: "Completed", c: "text-success bg-success/15" },
            ].map((r) => (
              <div
                key={r.t}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
              >
                <span className="truncate">{r.t}</span>
                <span className={"rounded-full px-2 py-0.5 text-[10px] font-medium " + r.c}>
                  {r.s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
