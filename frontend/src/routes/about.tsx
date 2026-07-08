import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TaskFlow AI" },
      {
        name: "description",
        content:
          "TaskFlow AI is the frontend for a Full Stack take-home assignment showcasing an ASP.NET Core + React architecture.",
      },
      { property: "og:title", content: "About — TaskFlow AI" },
      {
        property: "og:description",
        content: "The story behind TaskFlow AI — a premium reference frontend for ASP.NET Core.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">About TaskFlow AI</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          TaskFlow AI is a reference frontend crafted for a Software Engineer Full Stack (Backend
          Focused) take-home assignment. It demonstrates a premium, production-ready UI ready to be
          wired to an ASP.NET Core Web API with JWT authentication, role-based access, and
          AI-assisted task workflows.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            ["Frontend", "React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion"],
            ["State & data", "TanStack Query, Axios service layer, Zod validation"],
            ["Backend (planned)", "ASP.NET Core Web API, EF Core, JWT, SignalR"],
            ["AI Layer", "Structured suggestions: subtasks, criteria, estimates"],
          ].map(([h, b]) => (
            <div key={h} className="rounded-2xl border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">{h}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
