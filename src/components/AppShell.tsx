import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, Sparkles, ClipboardList, FileText, Trophy,
  Building2, FileSignature, TrendingUp, Wallet, ShieldCheck, AlertOctagon,
  Landmark, UsersRound, Globe2, Search, Bell, Inbox, MessageSquare,
  ChevronDown, Scale, ShoppingCart, Gavel, LogOut, User, X, CheckCircle2,
} from "lucide-react";
import { navSections } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { useNotifications, useTenders } from "@/hooks/use-store";
import { markNotificationsRead } from "@/lib/local-store";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BarChart3, Sparkles, ClipboardList, FileText, Trophy,
  Building2, FileSignature, TrendingUp, Wallet, ShieldCheck, AlertOctagon,
  Landmark, UsersRound, Globe2, ScaleIcon: Scale, ShoppingCart, Gavel,
};

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const { notifications, unread, refresh: refreshNotifs } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const { tenders } = useTenders();

  const handleLogout = () => { logout(); navigate("/"); };

  const searchResults = search.length > 1
    ? tenders.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-foreground">
      {/* Top nav */}
      <header className="h-14 border-b border-black/10 bg-white flex items-center px-4 gap-4 sticky top-0 z-30 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 min-w-[220px]">
          <LogoIcon className="h-6 w-6 text-black" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-black tracking-tight">APPIIOMS</div>
            <div className="text-[9px] text-black/40 uppercase tracking-wider">Procurement Intelligence</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tenders, vendors, contracts…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-black/10 shadow-lg z-50">
              {searchResults.map(t => (
                <button key={t.id} onClick={() => { navigate("/tenders"); setSearch(""); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors border-b border-black/5 last:border-0">
                  <div className="text-sm font-medium text-black truncate">{t.title}</div>
                  <div className="text-xs text-black/40">{t.id} · {t.status}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications bell */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) { markNotificationsRead(); setTimeout(refreshNotifs, 200); } }}
            className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/50 hover:text-black transition-colors">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center">{unread > 9 ? "9+" : unread}</span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-black/10 shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
                <span className="text-sm font-semibold text-black">Notifications</span>
                <button onClick={() => setShowNotifs(false)}><X className="h-4 w-4 text-black/30" /></button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-black/5">
                {notifications.length === 0
                  ? <div className="px-4 py-6 text-center text-sm text-black/30">No notifications</div>
                  : notifications.slice(0, 10).map((n) => (
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}>
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${n.type === "success" ? "text-emerald-500" : n.type === "error" ? "text-red-500" : "text-black/30"}`} />
                      <div>
                        <div className="text-xs text-black">{n.msg}</div>
                        <div className="text-[10px] text-black/30 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <div className="h-7 w-7 rounded-full bg-black text-white text-xs font-semibold grid place-items-center">{user?.avatar ?? "U"}</div>
            <div className="text-left leading-tight hidden md:block">
              <div className="text-xs font-medium text-black">{user?.name ?? "Guest"}</div>
              <div className="text-[10px] text-black/40">{user?.department ?? ""}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-black/30" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-black/10 bg-white shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-black/10">
              <div className="text-xs font-semibold text-black">{user?.name}</div>
              <div className="text-[10px] text-black/40">{user?.entity}</div>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-black hover:bg-[#F5F5F5] transition-colors">
              <User className="h-3.5 w-3.5" /> My Dashboard
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[240px] border-r border-black/10 bg-white overflow-y-auto py-4 flex-shrink-0">
          <nav className="px-3 space-y-5">
            {navSections.map((section) => (
              <div key={section.label}>
                <div className="px-2 mb-1.5 text-[10px] uppercase tracking-wider text-black/30 font-semibold">{section.label}</div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = iconMap[item.icon] ?? LayoutDashboard;
                    const active = pathname === item.to;
                    return (
                      <Link key={item.to} to={item.to}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                          active ? "bg-black text-white" : "text-black/60 hover:bg-[#F5F5F5] hover:text-black"
                        }`}>
                        <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2.5 : 1.75} />
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
        <main className="flex-1 min-w-0 overflow-x-hidden bg-[#F5F5F5] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Shared UI primitives ──────────────────────────────────────────────── */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black" style={{ letterSpacing: "-0.02em" }}>{title}</h1>
        {description && <p className="text-sm text-black/50 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-black/10 rounded-2xl shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-black/10">
      <div>
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        {subtitle && <p className="text-xs text-black/40 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({ label, value, delta, positive = true, icon: Icon, color = "blue" }: {
  label: string; value: string; delta?: string; positive?: boolean; icon?: React.ElementType;
  color?: "blue" | "green" | "amber" | "red" | "violet" | "cyan" | "orange" | "pink";
}) {
  const iconColors: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-600",
    green:  "bg-emerald-100 text-emerald-600",
    amber:  "bg-amber-100 text-amber-600",
    red:    "bg-red-100 text-red-600",
    violet: "bg-violet-100 text-violet-600",
    cyan:   "bg-cyan-100 text-cyan-600",
    orange: "bg-orange-100 text-orange-600",
    pink:   "bg-pink-100 text-pink-600",
  };
  return (
    <div className="bg-white border border-black/8 rounded-2xl p-4 hover:shadow-md hover:border-black/15 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs text-black/50 font-medium leading-tight">{label}</div>
        {Icon && (
          <div className={`h-8 w-8 rounded-xl grid place-items-center flex-shrink-0 ${iconColors[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold text-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>{value}</div>
      {delta && (
        <div className={`mt-1 text-xs font-semibold flex items-center gap-1 ${positive ? "text-emerald-600" : "text-red-500"}`}>
          <span>{positive ? "▲" : "▼"}</span> {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "blue" | "green" | "amber" | "red" | "muted" }) {
  const tones: Record<string, string> = {
    default: "bg-gray-100 text-gray-600 border border-gray-200",
    blue:    "bg-blue-100 text-blue-700 border border-blue-200",
    green:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    amber:   "bg-amber-100 text-amber-700 border border-amber-200",
    red:     "bg-red-100 text-red-700 border border-red-200",
    muted:   "bg-gray-50 text-gray-400 border border-gray-100",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
