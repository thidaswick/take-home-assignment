import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingHeader";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const items = [
  {
    icon: ShieldCheck,
    title: "JWT Authentication",
    desc: "Access + refresh tokens, secure storage, and RBAC integrated end-to-end.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    desc: "SignalR channels keep every connected client in sync, instantly.",
  },
  {
    icon: Sparkles,
    title: "AI Task Assistant",
    desc: "Improve descriptions, estimate hours, and generate subtasks in one click.",
  },
  {
    icon: Users,
    title: "Role Based Access",
    desc: "Admin and user dashboards with policy-based route protection.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Beautiful charts for status, velocity and overdue trends.",
  },
  {
    icon: CheckCircle2,
    title: "Production Ready",
    desc: "Typed API service layer, TanStack Query cache, and Zod validation.",
  },
];

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — TaskFlow AI" },
      {
        name: "description",
        content:
          "Explore TaskFlow AI features: JWT auth, real-time updates, AI assistant, RBAC and analytics.",
      },
      { property: "og:title", content: "Features — TaskFlow AI" },
      {
        property: "og:description",
        content:
          "Explore TaskFlow AI features: JWT auth, real-time updates, AI assistant, RBAC and analytics.",
      },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Built for teams that ship
          </h1>
          <p className="mt-4 text-muted-foreground">
            Every feature is designed for a premium day-to-day experience — and a clean ASP.NET Core
            integration.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <Button
            asChild
            size="lg"
            className="gradient-brand text-white shadow-lg shadow-primary/20"
          >
            <Link to="/register">
              Start Managing Tasks <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
