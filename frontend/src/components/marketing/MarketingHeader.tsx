import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/features", label: "Features" },
            { to: "/about", label: "About" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="gradient-brand text-white shadow-sm hover:opacity-95"
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The AI-powered task platform for teams that ship.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "AI Assistant", "Analytics", "Roadmap"] },
          { title: "Company", items: ["About", "Careers", "Blog", "Contact"] },
          { title: "Legal", items: ["Privacy", "Terms", "Security", "DPA"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i}>
                  <a className="hover:text-foreground" href="#">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:px-6">
          <span>© {new Date().getFullYear()} TaskFlow AI. All rights reserved.</span>
          <span>Built for the ASP.NET Core take-home assignment.</span>
        </div>
      </div>
    </footer>
  );
}
