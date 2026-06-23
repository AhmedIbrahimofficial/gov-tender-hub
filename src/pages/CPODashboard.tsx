import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import NewTenderModal from "@/components/NewTenderModal";
import TodayActivity from "@/components/TodayActivity";
import SeniorFeed from "@/components/SeniorFeed";
import { useTenders, useRFQs, useVendors } from "@/hooks/use-store";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  FileText, DollarSign, Activity, Shield, AlertTriangle, Sparkles, Plus,
  TrendingUp, Clock, CheckCircle2, ArrowRight, Users, Bell,
} from "lucide-react";
import { spendTrend, categorySpend, provinceSpend } from "@/lib/mock-data";
import { pushSeniorAlert, saveAIReport } from "@/lib/local-store";

const TABS = ["Overview", "Senior Feed", "Tenders", "RFQs", "Vendors", "Analytics", "Today"] as const;
type Tab = typeof TABS[number];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function CPODashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [showNewTender, setShowNewTender] = useState(false);
  const { tenders } = useTenders();
  const { rfqs } = useRFQs();
  const { vendors } = useVendors();

  const handleRequestAIReport = () => {
    saveAIReport({
      officer: user?.name ?? "CPO",
      role: "Chief Procurement Officer",
      date: new Date().toISOString().split("T")[0],
      summary: "CPO requested full platform summary. All systems normal. 3 items require attention.",
      actions: [
        { time: new Date().toLocaleTimeString(), action: "Platform review", ref: "ALL", outcome: "94.2% compliance" },
        { time: new Date().toLocaleTimeString(), action: "Fraud alerts reviewed", ref: "FRD-2026-089", outcome: "ZACC referral confirmed" },
        { time: new Date().toLocaleTimeString(), action: "AI agents checked", ref: "8 agents", outcome: "All active" },
      ],
      sentToCPO: true,
    });
    alert("✅ AI daily summary compiled and saved to Senior Feed.\n\nKey findings:\n• 94.2% overall compliance\n• 23 fraud alerts — 3 critical\n• USD 2.84B spend YTD (+6.2%)\n• 1,287 active tenders\n• 8 AI agents active at 92.5% avg confidence");
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <PageHeader
          title={`Good morning, ${user?.name?.split(" ")[0]}`}
          description="Chief Procurement Officer · APPIIOMS Command Center"
          actions={
            <div className="flex gap-2">
              <button onClick={handleRequestAIReport}
                className="h-9 px-3 rounded-xl border border-black/10 bg-white text-sm font-medium hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">AI Summary</span>
              </button>
              <Link to="/analytics" className="h-9 px-3 sm:px-4 rounded-xl border border-black/10 bg-white text-sm font-medium hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5">
                <Activity className="h-4 w-4" /> <span className="hidden sm:inline">Analytics</span>
              </Link>
              <button onClick={() => setShowNewTender(true)}
                className="h-9 px-3 sm:px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 flex items-center gap-1.5 transition-colors">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New Tender</span>
              </button>
            </div>
          }
        />

        <div className="flex gap-1 mb-6 border-b border-black/10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap flex-shrink-0 ${tab === t ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>
              {t === "Senior Feed" ? (
                <span className="flex items-center gap-1.5"><Bell className="h-3.5 w-3.5" /> Senior Feed</span>
              ) : t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard label="Total Spend YTD" value="USD 2.84B" delta="+6.2% vs last year" icon={DollarSign} color="blue" />
              <KpiCard label="Active Tenders" value={String(tenders.filter(t => ["Bidding","Published","Evaluation"].includes(t.status)).length + 1284)} delta="+42 this week" icon={FileText} color="violet" />
              <KpiCard label="Compliance Score" value="94.2%" delta="+1.8 pts" icon={Shield} color="green" />
              <KpiCard label="Fraud Alerts" value="23" delta="+3 new" positive={false} icon={AlertTriangle} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader title="Procurement Spend & Savings" subtitle="Monthly, USD millions" action={<Badge tone="blue">Live</Badge>} />
                <div className="p-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendTrend}>
                      <defs>
                        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="month" stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 12, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2.5} fill="url(#sg)" name="Spend (USD M)" />
                      <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fill="url(#sg3)" strokeDasharray="4 2" name="Savings (USD M)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardHeader title="Spend by Category" />
                <div className="p-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categorySpend} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {categorySpend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 12, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader title="Recent Tenders" action={<Link to="/tenders" className="text-xs text-black/40 hover:text-black flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>} />
                <div className="divide-y divide-black/5">
                  {tenders.slice(0, 5).map(t => (
                    <div key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-black truncate">{t.title}</div>
                        <div className="text-[11px] text-black/40">{t.id} · {t.entity}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge tone={t.status === "Awarded" ? "green" : t.status === "Evaluation" ? "amber" : t.status === "Bidding" ? "blue" : "muted"}>{t.status}</Badge>
                        <button onClick={() => { pushSeniorAlert(`CPO reviewed tender ${t.id}`, "info", { from: user?.name, fromRole: "CPO", category: "action", ref: t.id }); alert(`Tender ${t.id} opened.\n\nTitle: ${t.title}\nEntity: ${t.entity}\nValue: ${t.value}\nStatus: ${t.status}\nClosing: ${t.closing}\nBids: ${t.bids}`); }}
                          className="h-7 px-2.5 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5] transition-colors">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="AI Agents — Live" action={<Badge tone="green">8 active</Badge>} />
                <div className="divide-y divide-black/5">
                  {[
                    { name: "Fraud Detection AI",      action: "Flagged 4 abnormal bids",         conf: 89 },
                    { name: "Tender Drafting AI",       action: "Generated BOQ — Solar Mini-Grids", conf: 92 },
                    { name: "Supplier Verification AI", action: "KYC: 12 vendors approved",         conf: 97 },
                    { name: "Compliance Checker AI",    action: "3 tenders reviewed — compliant",   conf: 98 },
                    { name: "Award Recommendation AI",  action: "Pending adjudication — ARV",       conf: 90 },
                  ].map(a => (
                    <div key={a.name} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-black grid place-items-center flex-shrink-0">
                          <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-black">{a.name}</div>
                          <div className="text-[10px] text-black/40">{a.action}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-black">{a.conf}%</div>
                        <button onClick={() => alert(`${a.name}\n\nLast action: ${a.action}\nConfidence: ${a.conf}%\nStatus: Active\n\nClick "Open Agent Console" in AI Operations to see full detail.`)}
                          className="h-6 px-2 rounded-lg border border-black/10 text-[10px] hover:bg-[#F5F5F5] transition-colors">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Senior Feed preview in Overview */}
            <SeniorFeed compact />
          </div>
        )}

        {/* ── Full Senior Feed tab ── */}
        {tab === "Senior Feed" && <SeniorFeed />}

        {tab === "Tenders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-black/50">{tenders.length} tenders in system</div>
              <button onClick={() => setShowNewTender(true)} className="h-9 px-4 rounded-xl bg-black text-white text-sm font-medium flex items-center gap-1.5 hover:bg-gray-800">
                <Plus className="h-4 w-4" /> New Tender
              </button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F5F5] text-xs text-black/40">
                    <tr>{["Reference","Title","Entity","Value","Status","Bids","Closing",""].map(h => <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {tenders.map(t => (
                      <tr key={t.id} className="hover:bg-[#F5F5F5]/50">
                        <td className="px-5 py-3 font-mono text-[11px] text-black/40">{t.id}</td>
                        <td className="px-5 py-3 font-medium text-black max-w-[220px] truncate">{t.title}</td>
                        <td className="px-5 py-3 text-black/60 whitespace-nowrap">{t.entity}</td>
                        <td className="px-5 py-3 font-medium text-black whitespace-nowrap">{t.value}</td>
                        <td className="px-5 py-3"><Badge tone={t.status === "Awarded" ? "green" : t.status === "Evaluation" ? "amber" : t.status === "Bidding" ? "blue" : "muted"}>{t.status}</Badge></td>
                        <td className="px-5 py-3 text-black/60">{t.bids}</td>
                        <td className="px-5 py-3 text-black/60 whitespace-nowrap">{t.closing}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => alert(`${t.title}\n\nID: ${t.id}\nEntity: ${t.entity}\nValue: ${t.value}\nMethod: ${t.method}\nBids: ${t.bids}\nClosing: ${t.closing}\nStatus: ${t.status}`)}
                            className="h-7 px-2.5 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5] transition-colors">Open</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === "RFQs" && (
          <Card>
            <CardHeader title="RFQ Register" subtitle={`${rfqs.length} active RFQs`} action={<Link to="/rfq" className="text-xs text-black/40 hover:text-black flex items-center gap-1">Manage <ArrowRight className="h-3 w-3" /></Link>} />
            <div className="divide-y divide-black/5">
              {rfqs.map(r => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-black">{r.title}</div>
                    <div className="text-[11px] text-black/40">{r.id} · {r.dept} · {r.value}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-[#F5F5F5] overflow-hidden"><div className="h-full rounded-full bg-black" style={{ width: `${(r.stage / 18) * 100}%` }} /></div>
                    <Badge tone={r.status === "Active" ? "blue" : r.status === "Awarded" ? "green" : "amber"}>{r.status}</Badge>
                    <button onClick={() => alert(`RFQ: ${r.title}\n\nID: ${r.id}\nDept: ${r.dept}\nValue: ${r.value}\nStage: ${r.stage}/18\nDeadline: ${r.deadline}\nStatus: ${r.status}`)}
                      className="h-7 px-2.5 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5] transition-colors">Open</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "Vendors" && (
          <Card>
            <CardHeader title="Vendor Registry" subtitle={`${vendors.length} registered vendors`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F5F5] text-xs text-black/40">
                  <tr>{["ID","Name","Category","Rating","Risk","Status",""].map(h => <th key={h} className="text-left font-medium px-5 py-2.5">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-[#F5F5F5]/50">
                      <td className="px-5 py-3 font-mono text-[11px] text-black/40">{v.id}</td>
                      <td className="px-5 py-3 font-medium text-black">{v.name}</td>
                      <td className="px-5 py-3 text-black/60">{v.category}</td>
                      <td className="px-5 py-3 text-black">★ {v.rating}</td>
                      <td className="px-5 py-3"><Badge tone={v.risk === "High" ? "red" : v.risk === "Medium" ? "amber" : "green"}>{v.risk}</Badge></td>
                      <td className="px-5 py-3"><Badge tone={v.status === "Approved" ? "green" : "amber"}>{v.status}</Badge></td>
                      <td className="px-5 py-3">
                        <button onClick={() => alert(`Vendor: ${v.name}\n\nID: ${v.id}\nCategory: ${v.category}\nRating: ${v.rating}/5\nRisk: ${v.risk}\nStatus: ${v.status}`)}
                          className="h-7 px-2.5 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5] transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "Analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Spend by Province" />
              <div className="p-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={provinceSpend.slice(0,8)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" stroke="#aaa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="province" stroke="#aaa" fontSize={10} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Spend (USD M)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader title="Spend Trend" />
              <div className="p-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendTrend}>
                    <defs>
                      <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#111" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#111" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="spend" stroke="#111" strokeWidth={2} fill="url(#sg2)" name="Spend" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {tab === "Today" && <TodayActivity />}
      </div>

      <NewTenderModal open={showNewTender} onClose={() => setShowNewTender(false)} />
      <AIAssistantPanel agentName="Procurement Copilot" agentRole="Full platform intelligence" context="CPO dashboard" color="blue"
        suggestedPrompts={["Which tenders are overdue?","Show contracts expiring next quarter","Flag suspicious vendors","Summarize this week's activity"]} />
    </AppShell>
  );
}
