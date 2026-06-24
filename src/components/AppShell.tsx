import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ToastContainer from "@/components/ToastContainer";
import {
  LayoutDashboard, BarChart3, Sparkles, ClipboardList, FileText, Trophy,
  Building2, FileSignature, TrendingUp, Wallet, ShieldCheck, AlertOctagon,
  Landmark, UsersRound, Globe2, Globe, Image, Search, Bell, Inbox, MessageSquare,
  ChevronDown, Scale, ShoppingCart, Gavel, LogOut, User, X, CheckCircle2, Menu,
  Package, Wrench, PiggyBank, Trash2, Tag, Boxes, PackageCheck, Warehouse, ScanLine, RefreshCcw,
  Briefcase, CheckCircle, BookOpen, Newspaper, Megaphone, Radio, DollarSign,
  Mail, Send, Clock, AlertTriangle, Settings,
  Crown, Target, Headphones, Monitor, Users,
} from "lucide-react";
import { navSections } from "@/lib/mock-data";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { useNotifications, useTenders } from "@/hooks/use-store";
import { markNotificationsRead } from "@/lib/local-store";

/* ─── Click-outside hook ────────────────────────────────────────────────── */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

/* ─── Notifications Panel ───────────────────────────────────────────────── */
const NOTIF_ICONS: Record<string, { cls: string; Icon: React.ElementType }> = {
  success: { cls: "text-emerald-500 bg-emerald-50", Icon: CheckCircle2 },
  error:   { cls: "text-red-500 bg-red-50",         Icon: AlertTriangle },
  warning: { cls: "text-amber-500 bg-amber-50",     Icon: AlertTriangle },
  info:    { cls: "text-blue-500 bg-blue-50",        Icon: Bell },
};

function NotificationsPanel({ notifications, onClose, onMarkAllRead }: {
  notifications: { id: string; msg: string; type: string; time: string; read: boolean }[];
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n => n.read);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-black/10 shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/8">
        <div>
          <span className="text-sm font-semibold text-black">Notifications</span>
          {unread.length > 0 && (
            <span className="ml-2 text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-full">{unread.length} new</span>
          )}
        </div>
        <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 hover:text-black transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[420px] divide-y divide-black/5">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-black/30">
            <Bell className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
        {unread.length > 0 && (
          <>
            <div className="px-5 py-2 bg-[#F5F5F5]">
              <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">New</span>
            </div>
            {unread.slice(0, 8).map(n => {
              const { cls, Icon } = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.info;
              return (
                <div key={n.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#F5F5F5]/60 transition-colors cursor-pointer">
                  <div className={`h-8 w-8 rounded-full grid place-items-center flex-shrink-0 mt-0.5 ${cls}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-black leading-relaxed">{n.msg}</p>
                    <p className="text-[10px] text-black/35 mt-1 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{n.time}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-black mt-1.5 flex-shrink-0" />
                </div>
              );
            })}
          </>
        )}
        {read.length > 0 && (
          <>
            <div className="px-5 py-2 bg-[#F5F5F5]">
              <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">Earlier</span>
            </div>
            {read.slice(0, 5).map(n => {
              const { cls, Icon } = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.info;
              return (
                <div key={n.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F5F5F5]/60 transition-colors cursor-pointer opacity-60">
                  <div className={`h-7 w-7 rounded-full grid place-items-center flex-shrink-0 mt-0.5 ${cls}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-black leading-relaxed">{n.msg}</p>
                    <p className="text-[10px] text-black/35 mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div className="border-t border-black/8 px-5 py-3 flex items-center justify-between bg-[#fafafa]">
        <span className="text-xs text-black/40">{notifications.length} total notifications</span>
        <button onClick={onMarkAllRead} className="text-xs font-medium text-black hover:underline transition-colors">Mark all read</button>
      </div>
    </div>
  );
}

/* ─── Messages Panel ────────────────────────────────────────────────────── */
const DEMO_MESSAGES = [
  { id: "m1", from: "T. Moyo",       avatar: "TM", role: "CPO",               subject: "Solar Mini-Grids — Evaluation Update",      preview: "Please review the updated scoresheet before the committee meeting at 14:00.",  time: "09:14", unread: true  },
  { id: "m2", from: "R. Chikwanda",  avatar: "RC", role: "Finance Officer",    subject: "INV-2026-4821 Approved",                     preview: "Invoice approved and queued for payment. EFT reference will follow.",            time: "08:42", unread: true  },
  { id: "m3", from: "P. Dube",       avatar: "PD", role: "Evaluator",          subject: "ARV Framework — Technical Scores",           preview: "Attached are the consolidated technical evaluation scores for your review.",       time: "Yesterday", unread: false },
  { id: "m4", from: "S. Nkosi",      avatar: "SN", role: "Auditor",            subject: "Audit Finding — FA-2026-041",                preview: "Ghost vendor pattern detected in Transport Dept. Immediate action required.",      time: "Yesterday", unread: false },
  { id: "m5", from: "A. Mpofu",      avatar: "AM", role: "Procurement Officer",subject: "Infrastructure Working Group — Agenda",      preview: "Agenda for Thursday's working group meeting is now available on the shared drive.", time: "Mon",       unread: false },
];

function MessagesPanel({ user, onClose }: { user: { name?: string; avatar?: string } | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState(""); const [subject, setSubject] = useState(""); const [body, setBody] = useState("");
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  useClickOutside(ref, onClose);

  const handleSend = () => {
    if (!to.trim() || !subject.trim()) return;
    setSentMsg(`Message sent to ${to} — Subject: "${subject}"`);
    setCompose(false); setTo(""); setSubject(""); setBody("");
    setTimeout(() => setSentMsg(null), 3000);
  };

  const handleViewAll = () => { navigate("/teams"); onClose(); };
  const handleOpenMessage = (m: typeof DEMO_MESSAGES[0]) => {
    navigate("/teams");
    onClose();
  };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-black/10 shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">Messages</span>
          <span className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-full">2 unread</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCompose(c => !c)} className="h-7 px-2.5 rounded-lg bg-black text-white text-xs font-medium flex items-center gap-1 hover:bg-gray-800 transition-colors">
            <Send className="h-3 w-3" /> Compose
          </button>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 transition-colors"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {sentMsg && (
        <div className="px-5 py-2 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-700 font-medium">{sentMsg}</div>
      )}

      {compose && (
        <div className="border-b border-black/8 bg-[#fafafa] p-4 space-y-2">
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="To: name@gov.zw" className="w-full h-8 px-3 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full h-8 px-3 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-black/10" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Message…" rows={3} className="w-full px-3 py-2 rounded-lg border border-black/10 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-black/10" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setCompose(false)} className="h-7 px-3 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5]">Discard</button>
            <button onClick={handleSend} disabled={!to.trim() || !subject.trim()} className="h-7 px-3 rounded-lg bg-black text-white text-xs flex items-center gap-1 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"><Send className="h-3 w-3" /> Send</button>
          </div>
        </div>
      )}

      <div className="overflow-y-auto max-h-[360px] divide-y divide-black/5">
        {DEMO_MESSAGES.map(m => (
          <div key={m.id} onClick={() => handleOpenMessage(m)} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-[#F5F5F5]/60 transition-colors cursor-pointer ${m.unread ? "" : "opacity-60"}`}>
            <div className="h-8 w-8 rounded-full bg-black text-white text-xs font-bold grid place-items-center flex-shrink-0">{m.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs ${m.unread ? "font-semibold text-black" : "font-medium text-black/70"} truncate`}>{m.from}</span>
                <span className="text-[10px] text-black/35 flex-shrink-0">{m.time}</span>
              </div>
              <p className={`text-xs truncate ${m.unread ? "text-black" : "text-black/60"}`}>{m.subject}</p>
              <p className="text-[11px] text-black/40 truncate mt-0.5">{m.preview}</p>
            </div>
            {m.unread && <div className="h-2 w-2 rounded-full bg-black flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
      <div className="border-t border-black/8 px-5 py-2.5 bg-[#fafafa]">
        <button onClick={handleViewAll} className="text-xs font-medium text-black hover:underline">View all messages →</button>
      </div>
    </div>
  );
}

/* ─── Inbox Panel ───────────────────────────────────────────────────────── */
const DEMO_INBOX = [
  { id: "i1", title: "Solar Mini-Grids Tender — Awaiting Approval",  type: "Approval",  priority: "High",   from: "P. Dube",       time: "09:30", status: "Pending"   },
  { id: "i2", title: "INV-2026-4821 — Payment Authorisation Request", type: "Payment",   priority: "High",   from: "R. Chikwanda",  time: "08:55", status: "Pending"   },
  { id: "i3", title: "Contract Variation — Beitbridge Sect 3",        type: "Variation", priority: "Medium", from: "A. Mpofu",      time: "Yesterday", status: "Pending" },
  { id: "i4", title: "Vendor Registration — VEN-00489",               type: "Review",    priority: "Low",    from: "System",        time: "Yesterday", status: "Pending" },
  { id: "i5", title: "Budget Reallocation Request — Transport",       type: "Approval",  priority: "Medium", from: "F. Mutanga",    time: "Mon",    status: "Approved"  },
];
const ITEM_COLORS: Record<string, string> = {
  Approval: "bg-blue-100 text-blue-700", Payment: "bg-emerald-100 text-emerald-700",
  Variation: "bg-amber-100 text-amber-700", Review: "bg-violet-100 text-violet-700",
};

function InboxPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useClickOutside(ref, onClose);
  const [approvedItems, setApprovedItems] = useState<string[]>(["i5"]);
  const pending = DEMO_INBOX.filter(i => !approvedItems.includes(i.id));

  const handleApprove = (id: string, title: string) => {
    setApprovedItems(prev => [...prev, id]);
    markNotificationsRead();
  };

  const handleReview = (id: string, title: string) => {
    // navigate to relevant page based on item type
  };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-[400px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-black/10 shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">Action Inbox</span>
          {pending.length > 0 && <span className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-full">{pending.length} pending</span>}
        </div>
        <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 transition-colors"><X className="h-4 w-4" /></button>
      </div>
      <div className="overflow-y-auto max-h-[380px] divide-y divide-black/5">
        {DEMO_INBOX.map(item => {
          const isApproved = approvedItems.includes(item.id);
          return (
            <div key={item.id} className="px-5 py-3.5 hover:bg-[#F5F5F5]/60 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${ITEM_COLORS[item.type] ?? "bg-gray-100 text-gray-600"}`}>{item.type}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${!isApproved ? "text-black" : "text-black/50"}`}>{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-black/40">From: {item.from}</span>
                    <span className="text-[10px] text-black/25">·</span>
                    <span className="text-[10px] text-black/40">{item.time}</span>
                  </div>
                </div>
                {!isApproved ? (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleApprove(item.id, item.title)} className="h-6 px-2 rounded-md bg-black text-white text-[10px] font-medium hover:bg-gray-800 transition-colors">Approve</button>
                    <button onClick={() => handleReview(item.id, item.title)} className="h-6 px-2 rounded-md border border-black/10 text-[10px] text-black/60 hover:bg-[#F5F5F5] transition-colors">Review</button>
                  </div>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-600 flex-shrink-0">✓ Done</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-black/8 px-5 py-2.5 bg-[#fafafa]">
        <button onClick={() => { navigate("/tenders"); onClose(); }} className="text-xs font-medium text-black hover:underline">View full inbox →</button>
      </div>
    </div>
  );
}

/* ─── Role-based nav whitelist ──────────────────────────────────────────── */
const ROLE_NAV_WHITELIST: Partial<Record<UserRole, string[]>> = {
  // Procurement officer — manages tenders, RFQs, lifecycle
  procurement_officer: ["/dashboard", "/teams", "/tenders", "/tenders-lifecycle", "/lifecycle", "/rfq", "/rfp-eoi", "/planning", "/vendors", "/certificates", "/utility", "/utility/catalogue", "/utility/communications", "/utility/gazette", "/utility/announcements"],

  // Evaluator — only evaluation-related pages
  evaluator: ["/dashboard", "/teams", "/tenders", "/evaluations", "/awards", "/certificates"],

  // Finance officer — payments, invoices, budget
  finance_officer: ["/dashboard", "/teams", "/finance", "/budget", "/budget/execution", "/budget/expenditure", "/budget/commitments", "/budget/revenue", "/budget/treasury", "/utility/catalogue"],

  // Auditor — audit, anti-corruption, compliance
  auditor: ["/dashboard", "/teams", "/audit", "/anti-corruption", "/analytics", "/bi-dashboards", "/utility/public-records", "/budget", "/budget/fraud", "/budget/execution"],

  // Contract manager / officer
  contract_manager:  ["/dashboard", "/teams", "/contracts", "/vendors", "/performance", "/finance", "/certificates", "/utility/catalogue", "/utility/communications"],
  contract_officer:  ["/dashboard", "/teams", "/contracts", "/vendors", "/certificates"],

  // Budget / treasury officer
  budget_officer:    ["/dashboard", "/teams", "/budget", "/budget/centres", "/budget/formulation", "/budget/execution", "/budget/commitments", "/budget/expenditure", "/budget/revenue", "/budget/treasury", "/budget/fraud", "/budget/ai-agents", "/finance", "/analytics", "/utility/catalogue"],
  treasury_officer:  ["/dashboard", "/teams", "/budget", "/budget/treasury", "/budget/revenue", "/budget/execution", "/finance"],

  // Planning officer
  planning_officer:  ["/dashboard", "/teams", "/planning", "/tenders", "/utility/catalogue"],

  // Compliance officer
  compliance_officer:["/dashboard", "/teams", "/audit", "/anti-corruption", "/governance", "/utility/public-records", "/utility/announcements", "/corporate"],

  // Legal officer
  legal_officer:     ["/dashboard", "/teams", "/contracts", "/audit", "/governance", "/utility/announcements"],

  // Stores officer
  stores_officer:    ["/dashboard", "/teams", "/inventory", "/inventory/items", "/inventory/receiving", "/inventory/requests", "/inventory/warehouse", "/inventory/stock-count", "/inventory/reconciliation", "/inventory/ai-agents", "/contracts", "/utility/catalogue"],

  // Project manager
  project_manager:   ["/dashboard", "/teams", "/staff-productivity", "/department-activities", "/contracts", "/performance", "/vendors", "/utility/catalogue"],

  // Anti-corruption / ethics
  anti_corruption_officer: ["/dashboard", "/teams", "/anti-corruption", "/audit", "/vendors"],
  ethics_officer:          ["/dashboard", "/teams", "/anti-corruption", "/governance"],

  // Performance officer
  performance_officer: ["/dashboard", "/teams", "/staff-productivity", "/department-activities", "/performance", "/vendors", "/contracts", "/analytics", "/corporate"],

  // IT officer / system admin — full access
  it_officer:   ["/dashboard", "/teams", "/staff-productivity", "/department-activities", "/analytics", "/bi-dashboards", "/ai-agents", "/roles", "/governance", "/organisations", "/utility", "/corporate"],
  system_admin: ["/dashboard", "/teams", "/staff-productivity", "/department-activities", "/analytics", "/bi-dashboards", "/ai-agents", "/roles", "/governance", "/organisations", "/utility", "/corporate"],

  // Risk officer
  risk_officer: ["/dashboard", "/teams", "/audit", "/anti-corruption", "/analytics", "/contracts"],

  // Adjudication officer
  adjudication_officer: ["/dashboard", "/teams", "/evaluations", "/awards", "/tenders", "/certificates", "/utility/announcements"],

  // Audit officer / public auditor
  audit_officer:  ["/dashboard", "/teams", "/audit", "/anti-corruption", "/analytics"],
  public_auditor: ["/dashboard", "/audit", "/portal", "/utility/public-records"],

  // Records officer
  records_officer: ["/dashboard", "/teams", "/audit", "/governance", "/utility/public-records"],

  // Inspection / QA
  inspection_officer: ["/dashboard", "/teams", "/contracts", "/performance"],
  qa_officer:         ["/dashboard", "/teams", "/contracts", "/vendors", "/performance"],

  // Asset manager
  asset_manager: ["/dashboard", "/teams", "/assets", "/assets/maintenance", "/assets/financials", "/assets/disposal", "/contracts", "/governance", "/utility/catalogue"],

  // Logistics officer
  logistics_officer: ["/dashboard", "/teams", "/inventory", "/inventory/receiving", "/inventory/requests", "/inventory/warehouse", "/contracts", "/vendors", "/utility/catalogue"],

  // Vendor / supplier access
  supplier:     ["/dashboard", "/portal"],
  sme_supplier: ["/dashboard", "/portal"],
  vendor_user:  ["/dashboard", "/portal"],

  // Communications officer — gets full utility access
  communications_officer: ["/dashboard", "/teams", "/tenders", "/portal", "/governance", "/utility", "/utility/communications", "/utility/gazette", "/utility/announcements", "/utility/public-records", "/utility/media"],

  // HSE / environment
  health_safety_officer: ["/dashboard", "/teams", "/contracts", "/governance"],
  environment_officer:   ["/dashboard", "/teams", "/contracts", "/governance"],

  // Citizen / end user
  citizen:  ["/dashboard", "/portal"],
  end_user: ["/dashboard", "/teams", "/tenders", "/planning"],

  // Board / executive director — strategic overview only
  executive_director: ["/dashboard", "/teams", "/analytics", "/contracts", "/finance", "/utility/announcements", "/corporate"],
  board_member:       ["/dashboard", "/analytics", "/governance", "/corporate"],

  // Regulator
  regulator: ["/dashboard", "/teams", "/analytics", "/audit", "/anti-corruption", "/governance", "/vendors", "/tenders", "/utility/public-records", "/utility/gazette"],

  // AI governance
  ai_governance_officer:  ["/dashboard", "/teams", "/ai-agents", "/analytics", "/governance"],
  data_analytics_officer: ["/dashboard", "/teams", "/staff-productivity", "/analytics", "/bi-dashboards", "/ai-agents"],
};


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
  Package, Wrench, PiggyBank, Trash2, Tag, Boxes, PackageCheck, Warehouse, ScanLine, RefreshCcw,
  BookOpen, MessageSquare, Newspaper, Megaphone, Radio, DollarSign,
  // Corporate Module icons
  Crown, Target, Headphones, Monitor, Users, Settings, Scale,
  OfficeBuildingIcon: Building2,
  Globe, Image,
};

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const { notifications, unread, refresh: refreshNotifs } = useNotifications();
  const [showNotifs, setShowNotifs]   = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showInbox, setShowInbox]     = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen]   = useState(false);
  // Desktop sidebar collapsed/expanded (persisted in localStorage)
  const [collapsed, setCollapsed]     = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });
  const [search, setSearch] = useState("");
  const { tenders } = useTenders();

  const toggleCollapsed = () => {
    setCollapsed(v => {
      const next = !v;
      try { localStorage.setItem("sidebar-collapsed", String(next)); } catch {}
      return next;
    });
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const closeAll = () => { setShowNotifs(false); setShowMessages(false); setShowInbox(false); };

  const toggleNotifs = () => {
    const next = !showNotifs;
    closeAll();
    setShowNotifs(next);
    if (next) { markNotificationsRead(); setTimeout(refreshNotifs, 200); }
  };
  const toggleMessages = () => { closeAll(); setShowMessages(v => !v); };
  const toggleInbox    = () => { closeAll(); setShowInbox(v => !v); };

  // Filter nav items based on the user's role whitelist
  const allowedRoutes = user?.role ? ROLE_NAV_WHITELIST[user.role] : undefined;

  const isRouteAllowed = (itemTo: string) => {
    if (!allowedRoutes) return true;
    return allowedRoutes.some(
      allowed =>
        allowed === itemTo ||
        allowed.startsWith(itemTo + "/") ||
        itemTo.startsWith(allowed + "/")
    );
  };

  const filteredNavSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => isRouteAllowed(item.to)),
  })).filter(section => section.items.length > 0);

  const searchResults = search.length > 1
    ? tenders.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  // Sidebar width tokens
  const sidebarW = collapsed ? "w-[52px]" : "w-[240px]";

  // ── Shared nav content renderer ──────────────────────────────────────────
  const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <nav className="px-2 py-3 space-y-4">
      {filteredNavSections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <div className="px-2 mb-1 text-[10px] uppercase tracking-wider text-black/30 font-semibold">{section.label}</div>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = iconMap[item.icon] ?? LayoutDashboard;
              const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to + "/"));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onLinkClick}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 rounded-lg transition-colors group relative
                    ${collapsed ? "px-0 py-2 justify-center h-9 w-9 mx-auto" : "px-2.5 py-1.5"}
                    ${active ? "bg-black text-white" : "text-black/60 hover:bg-[#F5F5F5] hover:text-black"}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                  {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black text-white text-xs whitespace-nowrap
                      opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5] text-foreground overflow-hidden">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-black/10 bg-white flex items-center px-3 md:px-4 gap-2 md:gap-3 flex-shrink-0 z-30 shadow-sm">

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/50 hover:text-black transition-colors flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleCollapsed}
          className="hidden md:grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/50 hover:text-black transition-colors flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          }
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <LogoIcon className="h-6 w-6 text-black" />
          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-black tracking-tight">APPIIOMS</div>
            <div className="text-[9px] text-black/40 uppercase tracking-wider">Procurement Intelligence</div>
          </div>
          <div className="leading-tight sm:hidden">
            <div className="text-sm font-semibold text-black tracking-tight">APPIIOMS</div>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
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

        <div className="flex-1 md:hidden" />

        {/* Mobile search toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/50 hover:text-black transition-colors flex-shrink-0"
          aria-label="Toggle search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Action Inbox */}
        <div className="relative flex-shrink-0">
          <button onClick={toggleInbox}
            className={`relative h-9 w-9 grid place-items-center rounded-lg transition-colors ${showInbox ? "bg-black text-white" : "hover:bg-[#F5F5F5] text-black/50 hover:text-black"}`}
            aria-label="Action inbox">
            <Inbox className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold grid place-items-center">4</span>
          </button>
          {showInbox && <InboxPanel onClose={() => setShowInbox(false)} />}
        </div>

        {/* Messages */}
        <div className="relative flex-shrink-0">
          <button onClick={toggleMessages}
            className={`relative h-9 w-9 grid place-items-center rounded-lg transition-colors ${showMessages ? "bg-black text-white" : "hover:bg-[#F5F5F5] text-black/50 hover:text-black"}`}
            aria-label="Messages">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center">2</span>
          </button>
          {showMessages && <MessagesPanel user={user} onClose={() => setShowMessages(false)} />}
        </div>

        {/* Notifications */}
        <div className="relative flex-shrink-0">
          <button onClick={toggleNotifs}
            className={`relative h-9 w-9 grid place-items-center rounded-lg transition-colors ${showNotifs ? "bg-black text-white" : "hover:bg-[#F5F5F5] text-black/50 hover:text-black"}`}
            aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center">{unread > 9 ? "9+" : unread}</span>
            )}
          </button>
          {showNotifs && (
            <NotificationsPanel
              notifications={notifications as { id: string; msg: string; type: string; time: string; read: boolean }[]}
              onClose={() => setShowNotifs(false)}
              onMarkAllRead={() => { markNotificationsRead(); setTimeout(refreshNotifs, 200); setShowNotifs(false); }}
            />
          )}
        </div>

        {/* User menu */}
        <div className="relative group flex-shrink-0">
          <button className="flex items-center gap-1.5 pl-2 pr-1 h-9 rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <div className="h-7 w-7 rounded-full bg-black text-white text-xs font-semibold grid place-items-center">{user?.avatar ?? "U"}</div>
            <div className="text-left leading-tight hidden md:block">
              <div className="text-xs font-medium text-black">{user?.name ?? "Guest"}</div>
              <div className="text-[10px] text-black/40">{user?.department ?? ""}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-black/30 hidden md:block" />
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

      {/* ── Mobile search bar ────────────────────────────────────────────── */}
      {showSearch && (
        <div className="md:hidden px-3 py-2 bg-white border-b border-black/10 flex-shrink-0 z-20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tenders, vendors, contracts…"
              className="w-full h-9 pl-9 pr-8 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <button onClick={() => { setShowSearch(false); setSearch(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-black/30">
              <X className="h-4 w-4" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1 bg-white rounded-xl border border-black/10 shadow-lg overflow-hidden">
              {searchResults.map(t => (
                <button key={t.id} onClick={() => { navigate("/tenders"); setSearch(""); setShowSearch(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors border-b border-black/5 last:border-0">
                  <div className="text-sm font-medium text-black truncate">{t.title}</div>
                  <div className="text-xs text-black/40">{t.id} · {t.status}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Body row (sidebar + main) ────────────────────────────────────── */}
      {/* Key: flex row fills remaining height, both children overflow-y-auto independently */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Desktop sidebar ───────────────────────────────────────────── */}
        <aside className={`
          hidden md:flex flex-col flex-shrink-0
          border-r border-black/10 bg-white
          transition-[width] duration-200 ease-in-out
          overflow-hidden
          ${sidebarW}
        `}>
          {/* Scrollable nav — only this column scrolls when hovering sidebar */}
          <div className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden py-2 min-h-0">
            <NavContent />
          </div>

          {/* Collapse toggle pinned at bottom of sidebar */}
          <div className="flex-shrink-0 border-t border-black/8 p-2">
            <button
              onClick={toggleCollapsed}
              className="w-full h-8 flex items-center justify-center gap-2 rounded-lg hover:bg-[#F5F5F5] text-black/40 hover:text-black transition-colors text-xs"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed
                ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                : <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    <span>Collapse</span>
                  </>
              }
            </button>
          </div>
        </aside>

        {/* ── Mobile sidebar backdrop ──────────────────────────────────── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile sidebar drawer ────────────────────────────────────── */}
        <aside className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-black/10 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="flex items-center justify-between px-4 h-14 border-b border-black/10 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <LogoIcon className="h-6 w-6 text-black" />
              <span className="text-sm font-semibold text-black">APPIIOMS</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="sidebar-scroll flex-1 overflow-y-auto min-h-0">
            <NavContent onLinkClick={() => setMobileOpen(false)} />
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        {/* overflow-y-auto here means only this column scrolls when hovering page */}
        <main className="main-scroll flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden bg-[#F5F5F5]">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

/* ─── Shared UI primitives ──────────────────────────────────────────────── */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-black" style={{ letterSpacing: "-0.02em" }}>{title}</h1>
        {description && <p className="text-sm text-black/50 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-black/10 rounded-2xl shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-black/10">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        {subtitle && <p className="text-xs text-black/40 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
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
      <div className="mt-2 text-xl sm:text-2xl font-bold text-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>{value}</div>
      {delta && (
        <div className={`mt-1 text-xs font-semibold flex items-center gap-1 ${positive ? "text-emerald-600" : "text-red-500"}`}>
          <span>{positive ? "▲" : "▼"}</span> {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "blue" | "green" | "amber" | "red" | "muted" | "violet" | "purple" | "yellow" }) {
  const tones: Record<string, string> = {
    default: "bg-gray-100 text-gray-600 border border-gray-200",
    blue:    "bg-blue-100 text-blue-700 border border-blue-200",
    green:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    amber:   "bg-amber-100 text-amber-700 border border-amber-200",
    red:     "bg-red-100 text-red-700 border border-red-200",
    muted:   "bg-gray-50 text-gray-400 border border-gray-100",
    violet:  "bg-violet-100 text-violet-700 border border-violet-200",
    purple:  "bg-purple-100 text-purple-700 border border-purple-200",
    yellow:  "bg-yellow-100 text-yellow-700 border border-yellow-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${tones[tone] ?? tones.default}`}>{children}</span>;
}
