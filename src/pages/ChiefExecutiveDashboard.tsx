import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { pushNotification } from "@/lib/local-store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, DollarSign, Users, Shield, Target, Briefcase, FileText,
  AlertTriangle, CheckCircle2, Sparkles, Download, BarChart3, MessageSquare,
  Building2, Activity, Star, Clock, ChevronRight,
} from "lucide-react";

type Tab = "Executive Overview" | "Financial Control" | "HR & People" | "Operations" | "Strategic Goals" | "Board Reports";
const TABS: Tab[] = ["Executive Overview","Financial Control","HR & People","Operations","Strategic Goals","Board Reports"];

const DEPT_PERF = [
  { dept: "Procurement", score: 96, budget: 84, actual: 78 },
  { dept: "Finance", score: 94, budget: 72, actual: 68 },
  { dept: "HR", score: 88, budget: 36, actual: 32 },
  { dept: "Operations", score: 91, budget: 48, actual: 44 },
  { dept: "ICT", score: 82, budget: 20, actual: 22 },
  { dept: "Legal", score: 95, budget: 12, actual: 11 },
  { dept: "Audit", score: 93, budget: 8, actual: 7 },
  { dept: "Logistics", score: 87, budget: 15, actual: 14 },
];

const FINANCIAL_DATA = [
  { month: "Jan", budget: 22000000, actual: 19800000, revenue: 24000000 },
  { month: "Feb", budget: 24000000, actual: 22100000, revenue: 26000000 },
  { month: "Mar", budget: 26000000, actual: 25400000, revenue: 28000000 },
  { month: "Apr", budget: 28000000, actual: 27800000, revenue: 31000000 },
  { month: "May", budget: 30000000, actual: 29200000, revenue: 33000000 },
  { month: "Jun", budget: 32000000, actual: 30800000, revenue: 35000000 },
];

const STAFF_DATA = [
  { dept: "Procurement", total: 284, filled: 264, vacant: 20 },
  { dept: "Finance", total: 182, filled: 174, vacant: 8 },
  { dept: "HR", total: 96, filled: 88, vacant: 8 },
  { dept: "Operations", total: 421, filled: 398, vacant: 23 },
  { dept: "ICT", total: 148, filled: 136, vacant: 12 },
  { dept: "Legal", total: 42, filled: 41, vacant: 1 },
];

const RISK_DATA = [
  { category: "Procurement Fraud", level: "High", score: 78, mitigation: "AI monitoring active" },
  { category: "Budget Overrun", level: "Medium", score: 52, mitigation: "Budget controls in place" },
  { category: "Supplier Default", level: "Medium", score: 48, mitigation: "Performance bonds held" },
  { category: "Regulatory Non-compliance", level: "Low", score: 24, mitigation: "Compliance programme" },
  { category: "ICT System Failure", level: "High", score: 71, mitigation: "DR plan tested" },
  { category: "Talent Retention", level: "Medium", score: 55, mitigation: "Retention scheme active" },
];

const STRATEGIC_GOALS = [
  { id: "SG-1", goal: "Achieve 98% procurement compliance by Dec 2026", progress: 96, status: "On Track" },
  { id: "SG-2", goal: "Reduce procurement cycle time by 30%", progress: 22, status: "On Track" },
  { id: "SG-3", goal: "Digitise 100% of procurement processes", progress: 84, status: "On Track" },
  { id: "SG-4", goal: "Achieve ZWD 284M in annual procurement value", progress: 64, status: "On Track" },
  { id: "SG-5", goal: "Zero fraud incidents — AI-monitored detection", progress: 91, status: "On Track" },
  { id: "SG-6", goal: "Complete ERP/IFMIS integration", progress: 38, status: "At Risk" },
  { id: "SG-7", goal: "95% vendor satisfaction rating", progress: 84, status: "On Track" },
  { id: "SG-8", goal: "Achieve AGPO 30% spend target", progress: 21, status: "Behind" },
  { id: "SG-9", goal: "Carbon-neutral procurement operations 2027", progress: 44, status: "On Track" },
  { id: "SG-10", goal: "Complete national asset verification", progress: 72, status: "On Track" },
];

const PIE_SPEND = [
  { name: "Infrastructure", value: 42, fill: "#3b82f6" },
  { name: "Health & Pharma", value: 24, fill: "#22c55e" },
  { name: "ICT & Digital", value: 14, fill: "#8b5cf6" },
  { name: "Education", value: 11, fill: "#f59e0b" },
  { name: "Agriculture", value: 9, fill: "#14b8a6" },
];

function act(msg: string) { pushNotification(msg, "success"); }

export default function ChiefExecutiveDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Executive Overview");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { from: "ai" as const, text: `Good morning ${user?.name?.split(" ")[0] ?? ""}. Here's your executive briefing: Revenue is up 12% vs last year. 6 strategic goals are on track, 1 at risk (ERP integration), 1 behind (AGPO target). Procurement compliance stands at 96%. Two high-level risks require attention today.` }
  ]);

  function sendAiMessage() {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev,
      { from: "user" as const, text: msg },
      { from: "ai" as const, text: `Based on your query "${msg}", here is my executive analysis: All key performance indicators have been reviewed. The most critical action items for today are the ERP integration schedule review and the AGPO spend gap. I recommend scheduling a board briefing on these items.` }
    ]);
  }

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="rounded-2xl bg-gray-900 text-white px-6 py-5 mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium opacity-50 uppercase tracking-widest mb-1">Executive Office</div>
            <h1 className="text-2xl font-semibold">Chief Executive Officer</h1>
            <p className="text-sm opacity-60 mt-1">Entity-level strategic management, financial control & performance oversight</p>
            {user && <p className="text-xs opacity-40 mt-1">{user.name} · {user.entity}</p>}
          </div>
          <div className="text-right text-xs opacity-40">
            <div>{new Date().toLocaleDateString("en-ZW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          <KpiCard label="Revenue YTD" value="USD 184M" delta="+12% vs 2025" positive={true} color="green" icon={DollarSign} />
          <KpiCard label="Operating Budget" value="USD 142M" delta="68% utilised" positive={true} color="blue" icon={BarChart3} />
          <KpiCard label="Staff Complement" value="2,841" delta="92% filled" positive={true} color="indigo" icon={Users} />
          <KpiCard label="Strategic Goals" value="7/10" delta="On track" positive={true} color="teal" icon={Target} />
          <KpiCard label="Compliance Score" value="A" delta="Top rated entity" positive={true} color="green" icon={Shield} />
          <KpiCard label="Open Issues" value="6" delta="Escalated to you" positive={false} color="red" icon={AlertTriangle} />
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-5 border-b border-black/10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${tab === t ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── EXECUTIVE OVERVIEW ── */}
        {tab === "Executive Overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Dept performance chart */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader title="Department Performance Index" description="Overall performance score per department" />
                  <div className="px-5 pb-5">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={DEPT_PERF}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                        <YAxis domain={[70,100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#111827" radius={[4,4,0,0]} name="Score %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              {/* Spend by sector */}
              <Card>
                <CardHeader title="Procurement Spend by Sector" />
                <div className="px-5 pb-5">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={PIE_SPEND} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {PIE_SPEND.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* AI Briefing + Recent activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <Card>
                <CardHeader title="AI Executive Briefing" description="Daily CEO briefing from AI" />
                <div className="flex flex-col" style={{ height: 300 }}>
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                    {aiMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-black/8 flex gap-2">
                    <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                      placeholder="Ask your AI briefing officer..." className="flex-1 h-9 px-3 rounded-xl border border-black/10 text-sm outline-none focus:border-black/30" />
                    <button onClick={sendAiMessage} className="h-9 px-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">Send</button>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader title="Communications from Department Heads" />
                <div className="divide-y divide-black/5">
                  {[
                    { from: "CPO — T. Moyo", msg: "Tender ZW-PRA-2026-00184 approved. 11 bids received.", time: "1h ago", type: "success" as const },
                    { from: "Finance Director", msg: "Q2 budget overrun risk — ICT dept at 108% utilisation", time: "3h ago", type: "warning" as const },
                    { from: "HR Director", msg: "Staff turnover rate at 4.2% — below target 5%", time: "Yesterday", type: "info" as const },
                    { from: "IT Manager", msg: "ERP integration delayed by 3 months — resource constraints", time: "Yesterday", type: "error" as const },
                    { from: "Audit Director", msg: "Internal audit completed — 3 critical findings issued", time: "2 days ago", type: "warning" as const },
                  ].map((m, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-start gap-3 cursor-pointer hover:bg-gray-50" onClick={() => act(`Opening message from ${m.from}`)}>
                      <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${m.type === "success" ? "bg-green-500" : m.type === "error" ? "bg-red-500" : m.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-semibold text-black">{m.from}</span>
                          <span className="text-[10px] text-black/40">{m.time}</span>
                        </div>
                        <p className="text-xs text-black/60 mt-0.5">{m.msg}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-black/20 flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {[
                { label: "Approve Tenders", icon: CheckCircle2, route: "/tenders" },
                { label: "Contract Portfolio", icon: Briefcase, route: "/contracts" },
                { label: "Vendor Register", icon: Users, route: "/vendors" },
                { label: "Analytics", icon: BarChart3, route: "/analytics" },
                { label: "Audit Trail", icon: Shield, route: "/audit" },
              ].map((a, i) => (
                <button key={i} onClick={() => { act(a.label); navigate(a.route); }}
                  className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-100 transition-all text-sm font-medium text-black/70">
                  <a.icon className="h-5 w-5" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FINANCIAL CONTROL ── */}
        {tab === "Financial Control" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard label="Total Revenue" value="USD 184M" delta="+12% YTD" positive={true} color="green" />
              <KpiCard label="Operating Expenses" value="USD 142M" delta="77.2% of revenue" positive={true} color="blue" />
              <KpiCard label="EBITDA" value="USD 42M" delta="Margin: 22.8%" positive={true} color="teal" />
              <KpiCard label="Cash Position" value="USD 24.1M" delta="Strong liquidity" positive={true} color="emerald" />
            </div>
            <Card>
              <CardHeader title="Budget vs Actual vs Revenue (6-Month)" />
              <div className="px-5 pb-5">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={FINANCIAL_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(v: number) => `USD ${(v/1000000).toFixed(1)}M`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" dot={false} />
                    <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Budget" strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#111827" strokeWidth={2} name="Actual Spend" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader title="Department Budget vs Actual (USD M)" />
              <div className="px-5 pb-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEPT_PERF}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budget" fill="#3b82f6" radius={[4,4,0,0]} name="Budget (USD M)" />
                    <Bar dataKey="actual" fill="#111827" radius={[4,4,0,0]} name="Actual (USD M)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* ── HR & PEOPLE ── */}
        {tab === "HR & People" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard label="Total Staff" value="2,841" delta="All departments" positive={true} color="blue" />
              <KpiCard label="Vacancies" value="241" delta="8.5% vacancy rate" positive={false} color="amber" />
              <KpiCard label="Turnover Rate" value="4.2%" delta="Below 5% target" positive={true} color="green" />
              <KpiCard label="Training Hours" value="8,421" delta="This quarter" positive={true} color="teal" />
            </div>
            <Card>
              <CardHeader title="Staff Complement by Department" />
              <div className="px-5 pb-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={STAFF_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="filled" fill="#111827" radius={[4,4,0,0]} name="Filled Posts" />
                    <Bar dataKey="vacant" fill="#e5e7eb" radius={[4,4,0,0]} name="Vacant Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader title="HR Performance Indicators" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 pb-5">
                {[
                  { label: "Performance Reviews Completed", value: "84%", sub: "Annual reviews" },
                  { label: "Training Compliance", value: "91%", sub: "Mandatory training" },
                  { label: "Grievances Open", value: "8", sub: "Under review" },
                  { label: "Promotions This Year", value: "42", sub: "Merit-based" },
                  { label: "New Hires", value: "84", sub: "This year" },
                  { label: "Payroll Variance", value: "0.2%", sub: "Within tolerance" },
                ].map((k, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-black/5">
                    <div className="text-xl font-bold text-black">{k.value}</div>
                    <div className="text-xs font-medium text-black mt-1">{k.label}</div>
                    <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── OPERATIONS ── */}
        {tab === "Operations" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard label="Active Contracts" value="42" delta="In delivery phase" positive={true} color="blue" />
              <KpiCard label="On-Time Delivery" value="88.2%" delta="+2.1% this month" positive={true} color="green" />
              <KpiCard label="Assets Managed" value="14,284" delta="USD 142M value" positive={true} color="indigo" />
              <KpiCard label="Procurement Compliance" value="96%" delta="Above 95% target" positive={true} color="teal" />
            </div>
            <Card>
              <CardHeader title="Risk Register Summary" />
              <div className="divide-y divide-black/5">
                {RISK_DATA.map((r, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">{r.category}</div>
                      <div className="text-xs text-black/50 mt-0.5">{r.mitigation}</div>
                    </div>
                    <div className="w-24">
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${r.score > 70 ? "bg-red-500" : r.score > 45 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${r.score}%` }} />
                      </div>
                      <div className="text-[10px] text-black/40 mt-0.5 text-right">{r.score}/100</div>
                    </div>
                    <Badge tone={r.level === "High" ? "red" : r.level === "Medium" ? "amber" : "green"}>{r.level}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── STRATEGIC GOALS ── */}
        {tab === "Strategic Goals" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard label="Total Goals" value="10" delta="FY 2026" positive={true} color="blue" />
              <KpiCard label="On Track" value="7" delta="70% of goals" positive={true} color="green" />
              <KpiCard label="At Risk" value="1" delta="ERP integration" positive={false} color="amber" />
              <KpiCard label="Behind" value="1" delta="AGPO target" positive={false} color="red" />
            </div>
            <Card>
              <CardHeader title="Strategic Goals Progress" />
              <div className="divide-y divide-black/5">
                {STRATEGIC_GOALS.map((g, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-black/40 uppercase mr-2">{g.id}</span>
                        <span className="text-sm text-black">{g.goal}</span>
                      </div>
                      <Badge tone={g.status === "On Track" ? "green" : g.status === "At Risk" ? "amber" : "red"}>{g.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${g.status === "At Risk" ? "bg-amber-500" : g.status === "Behind" ? "bg-red-500" : "bg-black"}`} style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="text-xs text-black/40 w-8 text-right">{g.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── BOARD REPORTS ── */}
        {tab === "Board Reports" && (
          <div className="space-y-5">
            <Card>
              <CardHeader title="Board Reports & Publications" />
              <div className="divide-y divide-black/5">
                {[
                  { title: "CEO Executive Summary — Q2 2026", date: "July 1, 2026", status: "Ready" },
                  { title: "Financial Performance Report — H1 2026", date: "June 30, 2026", status: "Ready" },
                  { title: "Strategic Goals Progress Report — June 2026", date: "June 28, 2026", status: "Ready" },
                  { title: "Risk Register Report — Q2 2026", date: "June 25, 2026", status: "Draft" },
                  { title: "Annual Report — FY 2025", date: "April 30, 2026", status: "Published" },
                  { title: "Board Resolution Register 2026", date: "Updated monthly", status: "Live" },
                ].map((r, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-black">{r.title}</div>
                      <div className="text-xs text-black/40">{r.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={r.status === "Ready" || r.status === "Published" || r.status === "Live" ? "green" : "amber"}>{r.status}</Badge>
                      <button onClick={() => act(`Downloading: ${r.title}`)} className="h-7 w-7 rounded-lg border border-black/10 flex items-center justify-center hover:bg-gray-100">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Generate Board Pack", route: undefined },
                { label: "View Tenders", route: "/tenders" },
                { label: "View Contracts", route: "/contracts" },
                { label: "Analytics", route: "/analytics" },
                { label: "Audit Trail", route: "/audit" },
              ].map((a, i) => (
                <button key={i} onClick={() => { act(a.label); if (a.route) navigate(a.route); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 text-sm font-medium hover:bg-gray-100 transition-colors text-black/70 hover:text-black">
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
