import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { pushNotification } from "@/lib/local-store";
import {
  Building2, Users, Settings, Wallet, ShoppingCart, HeadphonesIcon,
  UserCog, Monitor, ClipboardCheck, Scale, Crown, TrendingUp,
  Activity, FileText, Target, Zap, ChevronRight, BarChart3,
  CheckCircle2, Clock, AlertTriangle, Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

// ─── Department Registry ─────────────────────────────────────────────────────
export const DEPARTMENTS = [
  {
    id: "permanent-secretary",
    name: "Permanent Secretary",
    shortName: "PS Office",
    icon: Crown,
    color: "violet",
    processTitle: "Strategic Leadership & Organisational Oversight",
    steps: 13,
    description: "Sets institutional strategic direction, approves plans and budgets, monitors implementation and reports to Cabinet.",
    kpis: { staff: 12, openTasks: 8, compliance: 98, performanceScore: 94 },
    tags: ["Strategy", "Governance", "Leadership"],
  },
  {
    id: "strategy-policy-planning",
    name: "Strategy, Policy & Planning",
    shortName: "SPP",
    icon: Target,
    color: "blue",
    processTitle: "Policy Development & Strategic Planning",
    steps: 14,
    description: "Develops policies and strategic plans through research, stakeholder input, impact assessment, and iterative review.",
    kpis: { staff: 18, openTasks: 23, compliance: 95, performanceScore: 88 },
    tags: ["Policy", "Planning", "Research"],
  },
  {
    id: "finance-accounting",
    name: "Finance & Accounting",
    shortName: "Finance",
    icon: Wallet,
    color: "green",
    processTitle: "Budgeting & Financial Management",
    steps: 16,
    description: "Manages budgeting, expenditure, payments, reconciliations, financial reporting, and audit support.",
    kpis: { staff: 32, openTasks: 41, compliance: 96, performanceScore: 91 },
    tags: ["Budget", "Payments", "Reporting"],
  },
  {
    id: "procurement-supply-chain",
    name: "Procurement & Supply Chain",
    shortName: "Procurement",
    icon: ShoppingCart,
    color: "amber",
    processTitle: "Procurement of Goods & Services",
    steps: 20,
    description: "Full procurement lifecycle from needs identification through requisitioning, tendering, evaluation, awarding, delivery, and supplier performance.",
    kpis: { staff: 28, openTasks: 67, compliance: 94, performanceScore: 89 },
    tags: ["Tenders", "Suppliers", "Contracts"],
  },
  {
    id: "service-delivery",
    name: "Service Delivery & Client Services",
    shortName: "Service Delivery",
    icon: HeadphonesIcon,
    color: "cyan",
    processTitle: "Client Service Management",
    steps: 14,
    description: "Handles client inquiries, service requests, status communication, complaint resolution, and service improvement.",
    kpis: { staff: 45, openTasks: 112, compliance: 92, performanceScore: 87 },
    tags: ["Clients", "Service", "Feedback"],
  },
  {
    id: "operations",
    name: "Operations",
    shortName: "Operations",
    icon: Settings,
    color: "orange",
    processTitle: "Operational Service Execution",
    steps: 12,
    description: "Executes operational plans, allocates resources, monitors activities, records operational data, and drives continuous improvement.",
    kpis: { staff: 56, openTasks: 34, compliance: 91, performanceScore: 86 },
    tags: ["Operations", "Resources", "Performance"],
  },
  {
    id: "human-resources",
    name: "Human Resources",
    shortName: "HR",
    icon: Users,
    color: "pink",
    processTitle: "Recruitment & Employee Lifecycle Management",
    steps: 23,
    description: "Manages full employee lifecycle: recruitment, onboarding, performance, training, leave, discipline, and separation.",
    kpis: { staff: 24, openTasks: 55, compliance: 97, performanceScore: 92 },
    tags: ["Recruitment", "Performance", "Training"],
  },
  {
    id: "ict-digital",
    name: "ICT & Digital Transformation",
    shortName: "ICT",
    icon: Monitor,
    color: "blue",
    processTitle: "ICT Solution Development & Support",
    steps: 17,
    description: "Drives digital transformation through system development, user support, incident management, security reviews, and continuous improvement.",
    kpis: { staff: 21, openTasks: 29, compliance: 99, performanceScore: 93 },
    tags: ["Systems", "Digital", "Security"],
  },
  {
    id: "administration-facilities",
    name: "Administration & Facilities Management",
    shortName: "Admin & Facilities",
    icon: Building2,
    color: "muted",
    processTitle: "Facilities & Administrative Support Management",
    steps: 14,
    description: "Provides administrative and facilities support, logistics, maintenance, asset management, and service performance reviews.",
    kpis: { staff: 38, openTasks: 47, compliance: 90, performanceScore: 84 },
    tags: ["Facilities", "Logistics", "Maintenance"],
  },
  {
    id: "legal-compliance-audit-risk",
    name: "Legal, Compliance, Internal Audit & Risk",
    shortName: "Legal & Audit",
    icon: Scale,
    color: "red",
    processTitle: "Legal · Compliance · Audit · Risk Management",
    steps: 34,
    description: "Provides legal services, manages compliance frameworks, conducts internal audits, and drives enterprise risk management.",
    kpis: { staff: 19, openTasks: 38, compliance: 99, performanceScore: 95 },
    tags: ["Legal", "Audit", "Risk", "Compliance"],
  },
] as const;

export type DepartmentId = typeof DEPARTMENTS[number]["id"];

// ─── Colour helpers ───────────────────────────────────────────────────────────
const ICON_BG: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  blue:   "bg-blue-100 text-blue-600",
  green:  "bg-emerald-100 text-emerald-600",
  amber:  "bg-amber-100 text-amber-600",
  cyan:   "bg-cyan-100 text-cyan-600",
  orange: "bg-orange-100 text-orange-600",
  pink:   "bg-pink-100 text-pink-600",
  red:    "bg-red-100 text-red-600",
  muted:  "bg-gray-100 text-gray-600",
};
const BADGE_TONE: Record<string, "violet"|"blue"|"green"|"amber"|"red"|"muted"> = {
  violet: "violet", blue: "blue", green: "green",
  amber: "amber", cyan: "blue", orange: "amber",
  pink: "violet", red: "red", muted: "muted",
};

// ─── Performance data ─────────────────────────────────────────────────────────
const PERF_DATA = DEPARTMENTS.map(d => ({
  dept: d.shortName,
  score: d.kpis.performanceScore,
  compliance: d.kpis.compliance,
}));

const RADAR_DATA = [
  { subject: "Leadership",   A: 94 },
  { subject: "Compliance",   A: 96 },
  { subject: "Efficiency",   A: 88 },
  { subject: "Innovation",   A: 82 },
  { subject: "Service",      A: 87 },
  { subject: "HR",           A: 92 },
];

// ─── Department Card ──────────────────────────────────────────────────────────
function DeptCard({ dept, onOpen }: { dept: typeof DEPARTMENTS[number]; onOpen: () => void }) {
  const Icon = dept.icon;
  const ibg  = ICON_BG[dept.color] ?? ICON_BG.blue;
  const tone = BADGE_TONE[dept.color] ?? "blue";

  return (
    <div
      onClick={onOpen}
      className="bg-white border border-black/8 rounded-2xl p-5 hover:shadow-md hover:border-black/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`h-10 w-10 rounded-xl grid place-items-center flex-shrink-0 ${ibg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 text-black/20 group-hover:text-black/60 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
      </div>

      <div className="text-sm font-semibold text-black leading-tight mb-1">{dept.name}</div>
      <div className="text-[11px] text-black/45 leading-relaxed mb-3">{dept.description}</div>

      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {dept.tags.map(tag => (
          <Badge key={tag} tone={tone}>{tag}</Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/5">
        <div className="text-center">
          <div className="text-base font-bold text-black">{dept.kpis.staff}</div>
          <div className="text-[10px] text-black/40">Staff</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-black">{dept.kpis.performanceScore}%</div>
          <div className="text-[10px] text-black/40">Performance</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-black/40">Compliance</span>
          <span className="text-[10px] font-semibold text-black">{dept.kpis.compliance}%</span>
        </div>
        <div className="h-1 rounded-full bg-black/5 overflow-hidden">
          <div
            className={`h-full rounded-full ${dept.kpis.compliance >= 95 ? "bg-emerald-500" : dept.kpis.compliance >= 90 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${dept.kpis.compliance}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-black/40">
        <Activity className="h-3 w-3" />
        <span>{dept.steps} process steps</span>
        <span className="ml-auto text-[10px] font-medium text-black/60">{dept.kpis.openTasks} open tasks</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CorporatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "High Performing" | "Needs Attention">("All");

  const totalStaff        = DEPARTMENTS.reduce((s, d) => s + d.kpis.staff, 0);
  const totalOpenTasks    = DEPARTMENTS.reduce((s, d) => s + d.kpis.openTasks, 0);
  const avgPerformance    = Math.round(DEPARTMENTS.reduce((s, d) => s + d.kpis.performanceScore, 0) / DEPARTMENTS.length);
  const avgCompliance     = Math.round(DEPARTMENTS.reduce((s, d) => s + d.kpis.compliance, 0) / DEPARTMENTS.length);

  const filtered = DEPARTMENTS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === "All" ? true :
      filter === "High Performing" ? d.kpis.performanceScore >= 90 :
      d.kpis.performanceScore < 90;
    return matchSearch && matchFilter;
  });

  const openDept = (dept: typeof DEPARTMENTS[number]) => {
    navigate(`/corporate/${dept.id}`);
    pushNotification(`Opened ${dept.name} department`, "info");
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="violet">Corporate Module</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Corporate Module"
          description="Institutional management hub — all departments, their process towers, performance dashboards, and AI assistants in one place."
        />

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Total Staff"           value={String(totalStaff)}    delta="Across all depts"   icon={Users}        color="blue"   />
          <KpiCard label="Open Tasks"            value={String(totalOpenTasks)} delta="Across all depts"  icon={Clock}        color="amber"  positive={false} />
          <KpiCard label="Avg Performance Score" value={`${avgPerformance}%`}  delta="+2 pts this quarter" icon={TrendingUp}   color="green"  />
          <KpiCard label="Avg Compliance Rate"   value={`${avgCompliance}%`}   delta="Target: 95%"        icon={CheckCircle2} color="violet" />
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search departments…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div className="flex gap-1">
            {(["All", "High Performing", "Needs Attention"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-9 px-3 rounded-lg text-xs font-medium transition-colors ${
                  filter === f ? "bg-black text-white" : "border border-black/10 text-black/60 hover:bg-black/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filtered.map(dept => (
            <DeptCard key={dept.id} dept={dept} onOpen={() => openDept(dept)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-black/40">
              No departments match "{search}"
            </div>
          )}
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Department Performance Scores" subtitle="Compared to compliance rates" />
            <div className="p-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERF_DATA} margin={{ bottom: 20 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dept" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} angle={-30} textAnchor="end" interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="score"      fill="#3b82f6" radius={[3, 3, 0, 0]} name="Performance %" />
                  <Bar dataKey="compliance" fill="#10b981" radius={[3, 3, 0, 0]} name="Compliance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Institutional Health Radar" subtitle="Overall departmental balance" />
            <div className="p-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Summary Table */}
        <Card className="mb-6">
          <CardHeader title="Department Summary" subtitle="All 10 departments at a glance" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/8">
                  {["Department", "Head", "Staff", "Open Tasks", "Process Steps", "Compliance", "Performance", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-black/40 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {DEPARTMENTS.map((d, i) => {
                  const Icon = d.icon;
                  const ibg  = ICON_BG[d.color] ?? ICON_BG.blue;
                  const tone = BADGE_TONE[d.color] ?? "blue";
                  const heads = ["T. Moyo", "P. Dube", "A. Mpofu", "R. Chikwanda", "S. Nkosi", "J. Banda", "C. Sithole", "N. Ndlovu", "E. Mutasa", "F. Ncube"];
                  return (
                    <tr
                      key={d.id}
                      onClick={() => navigate(`/corporate/${d.id}`)}
                      className="hover:bg-black/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-lg grid place-items-center flex-shrink-0 ${ibg}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-black">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-black/60">{heads[i]}</td>
                      <td className="px-4 py-3 text-xs text-black">{d.kpis.staff}</td>
                      <td className="px-4 py-3 text-xs text-black">{d.kpis.openTasks}</td>
                      <td className="px-4 py-3 text-xs text-black">{d.steps}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-black/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.kpis.compliance >= 95 ? "bg-emerald-500" : "bg-amber-500"}`}
                              style={{ width: `${d.kpis.compliance}%` }}
                            />
                          </div>
                          <span className="text-xs text-black">{d.kpis.compliance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-black">{d.kpis.performanceScore}%</td>
                      <td className="px-4 py-3">
                        <Badge tone={d.kpis.performanceScore >= 90 ? "green" : "amber"}>
                          {d.kpis.performanceScore >= 90 ? "On Track" : "Review"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Row */}
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200/60 rounded-2xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 grid place-items-center flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-black mb-1">Corporate AI Assistant</div>
            <p className="text-xs text-black/60 leading-relaxed">
              Each department has a dedicated AI assistant. Open any department to access its process tower, performance dashboard, and embedded AI assistant for process guidance, anomaly alerts, and decision support.
            </p>
          </div>
          <button
            onClick={() => navigate("/corporate/permanent-secretary")}
            className="flex-shrink-0 h-8 px-4 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" /> Open First Dept
          </button>
        </div>
      </div>
    </AppShell>
  );
}
