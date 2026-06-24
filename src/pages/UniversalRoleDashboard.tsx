import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { pushNotification } from "@/lib/local-store";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import {
  FileText, CheckCircle2, AlertTriangle, Shield, DollarSign, Users, TrendingUp,
  Briefcase, Search, Download, Package, BookOpen, Gavel, Settings, Activity,
  BarChart3, Wrench, Leaf, Heart, Star, Globe2, Archive, Zap, Eye, Plus,
  RefreshCcw, Clock, Mail, Target, Sparkles, MessageSquare, Edit, Calendar,
  Upload, Lock, Award, Map, Headphones, Warehouse, PackageCheck, ScanLine,
  Printer, FolderOpen, X, Share, Truck, Image,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, CheckCircle2, AlertTriangle, Shield, DollarSign, Users, TrendingUp,
  Briefcase, Search, Download, Package, BookOpen, Gavel, Settings, Activity,
  BarChart3, Wrench, Leaf, Heart, Star, Globe2, Archive, Zap, Eye, Plus,
  RefreshCcw, Clock, Mail, Target, Sparkles, MessageSquare, Edit, Calendar,
  Upload, Lock, Award, Map, Headphones, Warehouse, PackageCheck, ScanLine,
  Printer, FolderOpen, X, Share, Truck, Image,
};

const THEME_COLORS: Record<string, { bg: string; accent: string; text: string; bar: string; chart: string[] }> = {
  blue:    { bg: "bg-blue-50",    accent: "border-blue-500",  text: "text-blue-700",  bar: "#3b82f6", chart: ["#3b82f6","#60a5fa","#93c5fd"] },
  green:   { bg: "bg-green-50",   accent: "border-green-500", text: "text-green-700", bar: "#22c55e", chart: ["#22c55e","#4ade80","#86efac"] },
  violet:  { bg: "bg-violet-50",  accent: "border-violet-500",text: "text-violet-700",bar: "#8b5cf6", chart: ["#8b5cf6","#a78bfa","#c4b5fd"] },
  amber:   { bg: "bg-amber-50",   accent: "border-amber-500", text: "text-amber-700", bar: "#f59e0b", chart: ["#f59e0b","#fbbf24","#fcd34d"] },
  red:     { bg: "bg-red-50",     accent: "border-red-500",   text: "text-red-700",   bar: "#ef4444", chart: ["#ef4444","#f87171","#fca5a5"] },
  slate:   { bg: "bg-slate-50",   accent: "border-slate-500", text: "text-slate-700", bar: "#64748b", chart: ["#64748b","#94a3b8","#cbd5e1"] },
  teal:    { bg: "bg-teal-50",    accent: "border-teal-500",  text: "text-teal-700",  bar: "#14b8a6", chart: ["#14b8a6","#2dd4bf","#5eead4"] },
  indigo:  { bg: "bg-indigo-50",  accent: "border-indigo-500",text: "text-indigo-700",bar: "#6366f1", chart: ["#6366f1","#818cf8","#a5b4fc"] },
  orange:  { bg: "bg-orange-50",  accent: "border-orange-500",text: "text-orange-700",bar: "#f97316", chart: ["#f97316","#fb923c","#fdba74"] },
  pink:    { bg: "bg-pink-50",    accent: "border-pink-500",  text: "text-pink-700",  bar: "#ec4899", chart: ["#ec4899","#f472b6","#f9a8d4"] },
  cyan:    { bg: "bg-cyan-50",    accent: "border-cyan-500",  text: "text-cyan-700",  bar: "#06b6d4", chart: ["#06b6d4","#22d3ee","#67e8f9"] },
  emerald: { bg: "bg-emerald-50", accent: "border-emerald-500",text: "text-emerald-700",bar: "#10b981", chart: ["#10b981","#34d399","#6ee7b7"] },
};

type Tab = "Overview" | "My Work" | "Reports" | "Communications" | "AI Assistant" | "Settings";
const TABS: Tab[] = ["Overview","My Work","Reports","Communications","AI Assistant","Settings"];

export default function UniversalRoleDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = getRoleDashboardConfig(user?.role ?? "");
  const tc = THEME_COLORS[config.theme] ?? THEME_COLORS.slate;
  const [tab, setTab] = useState<Tab>("Overview");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{from:"user"|"ai"; text:string}>>([
    { from: "ai", text: `Hello ${user?.name?.split(" ")[0] ?? "there"}! I'm ${config.aiName}. How can I help you today?` }
  ]);

  function act(msg: string) {
    pushNotification(msg, "success");
  }

  function handleAction(label: string, route?: string) {
    act(`Action: ${label}`);
    if (route) navigate(route);
  }

  function sendAiMessage() {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [
      ...prev,
      { from: "user", text: userMsg },
      { from: "ai", text: `Understood. Based on your query about "${userMsg}", here's what I found: All relevant ${config.department} data has been reviewed. I recommend checking the latest reports and ensuring all compliance items are up to date.` }
    ]);
  }

  const Icon = (name: string) => {
    const I = ICON_MAP[name] ?? FileText;
    return <I className="h-4 w-4" />;
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className={`rounded-2xl ${config.color} text-white px-6 py-5 mb-6 flex items-start justify-between gap-4`}>
          <div>
            <div className="text-xs font-medium opacity-60 uppercase tracking-widest mb-1">{config.department}</div>
            <h1 className="text-2xl font-semibold">{config.title}</h1>
            <p className="text-sm opacity-70 mt-1">{config.subtitle}</p>
            {user && <p className="text-xs opacity-50 mt-1">Logged in as: {user.name} · {user.entity}</p>}
          </div>
          <div className="text-right text-xs opacity-50">
            <div>{new Date().toLocaleDateString("en-ZW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {config.kpis.map((kpi, i) => (
            <KpiCard
              key={i}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              positive={kpi.positive}
              color={kpi.color as "blue"|"green"|"amber"|"red"|"teal"|"indigo"|"violet"}
            />
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-5 border-b border-black/10 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                tab === t ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {tab === "Overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Chart */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader title={config.chartTitle} />
                <div className="px-5 pb-5">
                  {config.chartData.length > 0 && config.chartData[0].value2 !== undefined ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={config.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill={tc.bar} radius={[4,4,0,0]} name="Primary" />
                        <Bar dataKey="value2" fill={tc.chart[1]} radius={[4,4,0,0]} name="Secondary" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : config.chartData.length > 4 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={config.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={tc.bar} fill={tc.bar} fillOpacity={0.15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={config.chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, percent }) => `${label} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                          {config.chartData.map((_, i) => <Cell key={i} fill={tc.chart[i % tc.chart.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader title="Recent Activity" />
                <div className="divide-y divide-black/5">
                  {config.recentActivity.map((a, i) => (
                    <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                      <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                        a.type === "success" ? "bg-green-500" :
                        a.type === "error" ? "bg-red-500" :
                        a.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <div>
                        <p className="text-xs text-black leading-relaxed">{a.action}</p>
                        <p className="text-[10px] text-black/40 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                  {config.recentActivity.length === 0 && (
                    <div className="px-5 py-8 text-center text-xs text-black/30">No recent activity</div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: My Work */}
        {tab === "My Work" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {config.quickActions.map((action, i) => {
              const I = ICON_MAP[action.icon] ?? FileText;
              return (
                <button
                  key={i}
                  onClick={() => handleAction(action.label, action.route)}
                  className={`text-left p-5 rounded-2xl border-2 ${tc.accent} ${tc.bg} hover:shadow-md transition-all group`}
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${tc.text} bg-white/60`}>
                    <I className="h-4 w-4" />
                  </div>
                  <div className={`text-sm font-semibold ${tc.text} mb-1`}>{action.label}</div>
                  <div className="text-xs text-black/50">{action.desc}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB: Reports */}
        {tab === "Reports" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <Card>
              <CardHeader title="Available Reports" />
              <div className="divide-y divide-black/5">
                {[
                  { name: `${config.title} — Monthly Activity Report`, period: "June 2026", status: "Ready" },
                  { name: `${config.title} — Quarterly Performance Report`, period: "Q2 2026", status: "Ready" },
                  { name: `${config.title} — Annual Summary 2025`, period: "FY 2025", status: "Archived" },
                  { name: `AI Activity Digest — ${config.aiName}`, period: "June 2026", status: "Ready" },
                  { name: `${config.department} — KPI Scorecard`, period: "June 2026", status: "Draft" },
                ].map((r, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-black">{r.name}</div>
                      <div className="text-xs text-black/40">{r.period}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={r.status === "Ready" ? "green" : r.status === "Draft" ? "amber" : "blue"}>{r.status}</Badge>
                      <button onClick={() => act(`Downloading: ${r.name}`)} className="h-7 w-7 rounded-lg border border-black/10 flex items-center justify-center hover:bg-gray-100">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title={config.chartTitle} />
              <div className="px-5 pb-5">
                {config.chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={config.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill={tc.bar} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="px-5 pb-5">
                <button onClick={() => act("Exporting report data")} className={`w-full h-9 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 ${config.color} hover:opacity-90`}>
                  <Download className="h-4 w-4" /> Export Data
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB: Communications */}
        {tab === "Communications" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <Card>
              <CardHeader title="Messages & Notifications" />
              <div className="divide-y divide-black/5">
                {[
                  { from: "System", subject: "Weekly activity report ready", time: "Today 09:14", unread: true },
                  { from: "CPO Office", subject: "Approval request — tender ZW-PRA-2026-00184", time: "Yesterday", unread: true },
                  { from: "Compliance Team", subject: "PPDPA compliance update — Q2 2026", time: "3 days ago", unread: false },
                  { from: config.aiName, subject: "AI-generated daily briefing ready", time: "Today 07:00", unread: false },
                  { from: "PRAZ Regulator", subject: "Regulatory advisory — threshold update", time: "1 week ago", unread: false },
                ].map((m, i) => (
                  <div key={i} className={`px-5 py-3.5 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${m.unread ? "bg-blue-50/30" : ""}`} onClick={() => act(`Opening message: ${m.subject}`)}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${tc.bg} ${tc.text}`}>
                      {m.from[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-black">{m.from}</span>
                        <span className="text-[10px] text-black/40">{m.time}</span>
                      </div>
                      <p className={`text-xs mt-0.5 ${m.unread ? "text-black font-medium" : "text-black/60"}`}>{m.subject}</p>
                    </div>
                    {m.unread && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4">
                <button onClick={() => act("Compose new message")} className={`w-full h-9 rounded-xl text-sm font-medium text-white ${config.color} hover:opacity-90`}>
                  Compose Message
                </button>
              </div>
            </Card>
            <Card>
              <CardHeader title="Announcements" />
              <div className="divide-y divide-black/5">
                {[
                  { title: "System Maintenance — Sunday 02:00–04:00", type: "warning" as const },
                  { title: "PPDPA Threshold Update Effective July 1", type: "info" as const },
                  { title: "New Training Module: Ethics in Procurement", type: "success" as const },
                  { title: "Q3 2026 Procurement Calendar Published", type: "info" as const },
                ].map((a, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${a.type === "warning" ? "bg-amber-500" : a.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                    <p className="text-xs text-black">{a.title}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB: AI Assistant */}
        {tab === "AI Assistant" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <Card>
                <CardHeader title={config.aiName} description="AI-powered assistant for your role" />
                <div className="flex flex-col" style={{ height: 360 }}>
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                    {aiMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.from === "user"
                            ? `${config.color} text-white`
                            : "bg-gray-100 text-black"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-black/8 flex gap-2">
                    <input
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                      placeholder={`Ask ${config.aiName}...`}
                      className="flex-1 h-9 px-3 rounded-xl border border-black/10 text-sm outline-none focus:border-black/30"
                    />
                    <button onClick={sendAiMessage} className={`h-9 px-4 rounded-xl text-sm font-medium text-white ${config.color} hover:opacity-90`}>Send</button>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="AI Capabilities" />
                <div className="px-5 pb-5 space-y-2">
                  {config.aiCapabilities.map((cap, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl ${tc.bg}`}>
                      <Sparkles className={`h-3.5 w-3.5 flex-shrink-0 ${tc.text}`} />
                      <span className="text-black/70">{cap}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4 space-y-2">
                  {["Summarise today's activity", "What needs my attention?", "Generate status report"].map(q => (
                    <button key={q} onClick={() => { setAiInput(q); }} className="w-full text-left text-xs px-3 py-2 rounded-xl border border-black/10 hover:bg-gray-50 transition-colors text-black/60 hover:text-black">
                      {q}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: Settings */}
        {tab === "Settings" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <Card>
              <CardHeader title="Profile Settings" />
              <div className="px-5 pb-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-black/60 block mb-1">Full Name</label>
                  <div className="h-9 px-3 flex items-center border border-black/10 rounded-xl text-sm text-black">{user?.name}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60 block mb-1">Role</label>
                  <div className="h-9 px-3 flex items-center border border-black/10 rounded-xl text-sm text-black">{config.title}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60 block mb-1">Department</label>
                  <div className="h-9 px-3 flex items-center border border-black/10 rounded-xl text-sm text-black">{config.department}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60 block mb-1">Entity</label>
                  <div className="h-9 px-3 flex items-center border border-black/10 rounded-xl text-sm text-black">{user?.entity}</div>
                </div>
                <button onClick={() => act("Profile updated")} className={`h-9 px-5 rounded-xl text-sm font-medium text-white ${config.color} hover:opacity-90`}>
                  Save Changes
                </button>
              </div>
            </Card>
            <Card>
              <CardHeader title="Notification Preferences" />
              <div className="px-5 pb-5 space-y-3">
                {["Email notifications", "SMS alerts for approvals", "Daily AI digest", "Compliance reminders", "New tender alerts"].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-black/5">
                    <span className="text-sm text-black/70">{pref}</span>
                    <button onClick={() => act(`Toggled: ${pref}`)} className={`h-6 w-11 rounded-full relative transition-colors ${i % 2 === 0 ? "bg-black" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${i % 2 === 0 ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Module shortcuts */}
        {config.subModules.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {config.subModules.map((m, i) => {
              const I = ICON_MAP[m.icon] ?? FileText;
              return (
                <button key={i} onClick={() => navigate(m.route)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 text-sm font-medium hover:bg-gray-100 transition-colors text-black/70 hover:text-black">
                  <I className="h-3.5 w-3.5" />{m.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
