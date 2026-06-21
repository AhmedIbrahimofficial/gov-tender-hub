import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BarChart3, Sparkles, ClipboardList, FileText, Trophy,
  Building2, FileSignature, TrendingUp, Wallet, ShieldCheck, AlertOctagon,
  Landmark, UsersRound, Globe2, Search, Bell, Inbox, MessageSquare,
  ChevronDown, Scale,
} from "lucide-react";
import { navSections } from "@/lib/mock-data";

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, BarChart3, Sparkles, ClipboardList, FileText, Trophy,
  Building2, FileSignature, TrendingUp, Wallet, ShieldCheck, AlertOctagon,
  Landmark, UsersRound, Globe2, ScaleIcon: Scale,
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top nav */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2 min-w-[260px]">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            ZW
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">National Procurement Platform</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Government of Zimbabwe</div>
          </div>
        </Link>

        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search tenders, vendors, contracts, policies…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Sparkles className="h-4 w-4" /> Procurement AI Copilot
        </button>

        <div className="flex items-center gap-1">
          <IconButton icon={Inbox} count={7} label="Workflow Inbox" />
          <IconButton icon={Bell} count={12} label="Notifications" />
          <IconButton icon={MessageSquare} count={3} label="Messages" />
        </div>

        <button className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-md hover:bg-secondary">
          <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold grid place-items-center">TM</div>
          <div className="text-left leading-tight hidden md:block">
            <div className="text-xs font-medium text-foreground">T. Moyo</div>
            <div className="text-[10px] text-muted-foreground">Chief Procurement Officer</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[260px] border-r border-border bg-card overflow-y-auto py-4">
          <nav className="px-3 space-y-6">
            {navSections.map((section) => (
              <div key={section.label}>
                <div className="px-2 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {section.label}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = iconMap[item.icon] ?? LayoutDashboard;
                    const active = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={
                          "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors " +
                          (active
                            ? "bg-primary-soft text-primary font-medium"
                            : "text-foreground/80 hover:bg-secondary hover:text-foreground")
                        }
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 overflow-x-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, count, label }: { icon: typeof Bell; count?: number; label: string }) {
  return (
    <button title={label} className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-secondary text-foreground/70 hover:text-foreground">
      <Icon className="h-4 w-4" />
      {count !== undefined && count > 0 && (
        <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold grid place-items-center">
          {count}
        </span>
      )}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-card ${className}`}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-border">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({ label, value, delta, positive = true }: { label: string; value: string; delta?: string; positive?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foreground tracking-tight">{value}</div>
      {delta && (
        <div className={`mt-1 text-xs font-medium ${positive ? "text-[oklch(0.55_0.17_155)]" : "text-destructive"}`}>
          {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "blue" | "green" | "amber" | "red" | "muted" }) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    blue: "bg-primary-soft text-primary",
    green: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.15_155)]",
    amber: "bg-[oklch(0.96_0.08_85)] text-[oklch(0.45_0.15_60)]",
    red: "bg-[oklch(0.96_0.05_25)] text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
