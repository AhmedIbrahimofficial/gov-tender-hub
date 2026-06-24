import { useState } from "react";
import { ModulePage, Card, CardHeader, Badge } from "@/components/ModulePage";
import { useAuth } from "@/lib/auth-context";
import { ZW_MINISTRIES } from "@/lib/zw-ministries";
import {
  Landmark, Building2, UsersRound, Wallet, FileText, ShieldCheck,
  AlertOctagon, TrendingUp, Sparkles, Crown, Globe2, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";

const fmt = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

/* Aggregate roll-up across all ministries */
const ministrySpend = ZW_MINISTRIES.map((m, i) => ({
  ministry: m.code,
  name:     m.name.replace("Ministry of ", ""),
  budget:   80 + ((i * 73) % 540),     // $M
  spent:    50 + ((i * 47) % 420),
  tenders:  3 + ((i * 11) % 28),
  contracts:5 + ((i * 7) % 22),
  staff:    120 + ((i * 137) % 1800),
  compliance: 65 + ((i * 13) % 32),
}));

const totalBudget   = ministrySpend.reduce((s, m) => s + m.budget, 0) * 1_000_000;
const totalSpent    = ministrySpend.reduce((s, m) => s + m.spent, 0) * 1_000_000;
const totalTenders  = ministrySpend.reduce((s, m) => s + m.tenders, 0);
const totalContracts= ministrySpend.reduce((s, m) => s + m.contracts, 0);
const totalStaff    = ministrySpend.reduce((s, m) => s + m.staff, 0);
const totalDepts    = ZW_MINISTRIES.reduce((s, m) => s + m.departments.length, 0);
const totalSOEs     = ZW_MINISTRIES.reduce((s, m) => s + m.stateEntities.length, 0);

const quarterly = [
  { q: "Q1 2025", spend: 412, revenue: 380, deficit: -32 },
  { q: "Q2 2025", spend: 488, revenue: 442, deficit: -46 },
  { q: "Q3 2025", spend: 521, revenue: 471, deficit: -50 },
  { q: "Q4 2025", spend: 567, revenue: 524, deficit: -43 },
  { q: "Q1 2026", spend: 594, revenue: 562, deficit: -32 },
  { q: "Q2 2026", spend: 628, revenue: 597, deficit: -31 },
];

const complianceByMin = ministrySpend
  .map(m => ({ name: m.ministry, score: m.compliance }))
  .sort((a, b) => b.score - a.score);

const auditFindings = [
  { ministry: "Energy",     critical: 4, high: 7, medium: 12, low: 18 },
  { ministry: "Transport",  critical: 3, high: 9, medium: 14, low: 22 },
  { ministry: "Health",     critical: 2, high: 5, medium: 11, low: 16 },
  { ministry: "Education",  critical: 1, high: 4, medium:  9, low: 14 },
  { ministry: "Defence",    critical: 2, high: 6, medium:  8, low: 12 },
  { ministry: "Mines",      critical: 3, high: 5, medium: 10, low: 13 },
  { ministry: "Finance",    critical: 1, high: 3, medium:  7, low: 11 },
  { ministry: "Agriculture",critical: 2, high: 6, medium: 13, low: 19 },
];

const presidentialPriorities = [
  { theme: "Vision 2030 Infrastructure", on: 18, atRisk: 5, delayed: 2 },
  { theme: "Health Sector Reform",       on: 9,  atRisk: 3, delayed: 1 },
  { theme: "Education Modernisation",    on: 12, atRisk: 2, delayed: 0 },
  { theme: "Energy Self-Sufficiency",    on: 7,  atRisk: 4, delayed: 3 },
  { theme: "Digital Government",         on: 14, atRisk: 3, delayed: 1 },
  { theme: "Agriculture Transformation", on: 11, atRisk: 5, delayed: 2 },
];

const aiAlerts = [
  { sev: "critical", text: "Anomaly: Energy ministry awarded 3 sole-source contracts >$10M in 7 days",     ts: "12 min ago" },
  { sev: "high",     text: "Hwange Unit 7&8 project — 62% probability of >90-day slip",                     ts: "45 min ago" },
  { sev: "high",     text: "Treasury cash position will breach reserve floor in 11 days at current burn",   ts: "1h ago" },
  { sev: "medium",   text: "Vendor concentration: 4 vendors hold 38% of all active contract value",          ts: "2h ago" },
  { sev: "medium",   text: "PRAZ compliance score for Mines dropped 6 pts over last 30 days",                ts: "4h ago" },
  { sev: "low",      text: "Budget variance >5% detected in 6 ministries — quarterly review due",            ts: "1d ago" },
];

const SEV_TONE: Record<string, "red" | "amber" | "blue" | "green"> = {
  critical: "red", high: "red", medium: "amber", low: "blue",
};

function KPI({ label, value, delta, icon: Icon }: { label: string; value: string; delta?: string; icon?: React.ElementType }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] text-black/50 uppercase tracking-wider font-medium">{label}</div>
        {Icon && <div className="h-8 w-8 rounded-xl grid place-items-center bg-blue-50 text-blue-600 flex-shrink-0"><Icon className="h-4 w-4" /></div>}
      </div>
      <div className="text-2xl font-semibold mt-2 text-black">{value}</div>
      {delta && <div className="text-[11px] text-black/40 mt-1">{delta}</div>}
    </Card>
  );
}

function ChartCard({ title, subtitle, children, height = 240 }: { title: string; subtitle?: string; children: React.ReactNode; height?: number }) {
  return (
    <Card className="p-4">
      <CardHeader title={title} subtitle={subtitle} />
      <div style={{ width: "100%", height }} className="mt-2">{children}</div>
    </Card>
  );
}

export default function PresidentDashboard() {
  const { user } = useAuth();
  const [scope, setScope] = useState<string>("all");

  return (
    <ModulePage
      title="Office of the President — National Command Center"
      description="Whole-of-government oversight across every ministry, department, state entity, project, contract and officer."
      phase="Executive"
    >
      {/* Hero ribbon */}
      <Card className="p-5 mb-5 bg-gradient-to-r from-blue-700 to-blue-900 border-0 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center"><Crown className="h-6 w-6" /></div>
            <div>
              <div className="text-sm text-white/70">Welcome,</div>
              <div className="text-xl font-semibold">{user?.name ?? "Mr. President"}</div>
              <div className="text-xs text-white/60 mt-0.5">Cabinet Office · Office of the President and Cabinet</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs">Live · {new Date().toLocaleString("en-GB")}</div>
            <select value={scope} onChange={e => setScope(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none">
              <option value="all" className="text-black">All Ministries (whole-of-government)</option>
              {ZW_MINISTRIES.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* National KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
        <KPI label="Ministries"      value={String(ZW_MINISTRIES.length)} icon={Landmark} />
        <KPI label="Departments"     value={String(totalDepts)} icon={Building2} />
        <KPI label="State Entities"  value={String(totalSOEs)} icon={Globe2} />
        <KPI label="Civil Servants"  value={totalStaff.toLocaleString()} icon={UsersRound} />
        <KPI label="National Budget" value={fmt(totalBudget)} icon={Wallet} delta={`${Math.round((totalSpent / totalBudget) * 100)}% utilised`} />
        <KPI label="Active Tenders"  value={String(totalTenders)} icon={FileText} />
        <KPI label="Live Contracts"  value={String(totalContracts)} icon={ShieldCheck} />
        <KPI label="Compliance Avg"  value={`${Math.round(complianceByMin.reduce((s, x) => s + x.score, 0) / complianceByMin.length)}%`} icon={TrendingUp} />
      </div>

      {/* Macro fiscal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <ChartCard title="Quarterly Spend vs Revenue" subtitle="National treasury — $M" height={260}>
          <ResponsiveContainer>
            <AreaChart data={quarterly}>
              <defs>
                <linearGradient id="ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.4} /><stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} /></linearGradient>
                <linearGradient id="pr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="q" fontSize={10} /><YAxis fontSize={11} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="spend"   name="Spend"   stroke="#1d4ed8" fill="url(#ps)" />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#pr)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fiscal Deficit Trend" subtitle="Quarterly deficit — $M" height={260}>
          <ResponsiveContainer>
            <LineChart data={quarterly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="q" fontSize={10} /><YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="deficit" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 Ministries by Budget" height={260}>
          <ResponsiveContainer>
            <BarChart data={[...ministrySpend].sort((a, b) => b.budget - a.budget).slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={11} tickFormatter={(v: number) => `${v}M`} />
              <YAxis dataKey="ministry" type="category" fontSize={10} width={50} />
              <Tooltip formatter={(v: number) => `$${v}M`} />
              <Bar dataKey="budget" fill="#1d4ed8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Compliance & audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <ChartCard title="Compliance Score by Ministry (PPDPA)" subtitle="Higher is better — colour scaled" height={300}>
          <ResponsiveContainer>
            <BarChart data={complianceByMin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" fontSize={9} angle={-30} textAnchor="end" height={50} interval={0} />
              <YAxis fontSize={11} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {complianceByMin.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 85 ? "#10b981" : entry.score >= 70 ? "#3b82f6" : entry.score >= 60 ? "#f59e0b" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Audit Findings — Top 8 Ministries" subtitle="By severity, current quarter" height={300}>
          <ResponsiveContainer>
            <BarChart data={auditFindings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="ministry" fontSize={10} angle={-25} textAnchor="end" height={50} interval={0} />
              <YAxis fontSize={11} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="critical" stackId="a" name="Critical" fill="#ef4444" />
              <Bar dataKey="high"     stackId="a" name="High"     fill="#f59e0b" />
              <Bar dataKey="medium"   stackId="a" name="Medium"   fill="#3b82f6" />
              <Bar dataKey="low"      stackId="a" name="Low"      fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Presidential priorities + AI alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <Card className="p-0 overflow-hidden lg:col-span-2">
          <div className="px-4 py-3 border-b border-black/8 flex items-center justify-between">
            <div className="text-sm font-semibold">Presidential Priority Programmes</div>
            <Badge tone="blue">{presidentialPriorities.length} themes</Badge>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#fafafa] text-black/50 uppercase text-[10px]">
              <tr><th className="text-left px-4 py-2">Theme</th><th className="text-center px-4 py-2">On Track</th><th className="text-center px-4 py-2">At Risk</th><th className="text-center px-4 py-2">Delayed</th><th className="text-left px-4 py-2 w-40">Overall</th></tr>
            </thead>
            <tbody>
              {presidentialPriorities.map(p => {
                const total = p.on + p.atRisk + p.delayed;
                const score = Math.round((p.on / total) * 100);
                return (
                  <tr key={p.theme} className="border-t border-black/5">
                    <td className="px-4 py-2.5 font-medium text-black">{p.theme}</td>
                    <td className="px-4 py-2.5 text-center"><Badge tone="green">{p.on}</Badge></td>
                    <td className="px-4 py-2.5 text-center"><Badge tone="amber">{p.atRisk}</Badge></td>
                    <td className="px-4 py-2.5 text-center"><Badge tone="red">{p.delayed}</Badge></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-[10px] w-8 text-right">{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-black/8 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">AI Executive Alerts</div>
          </div>
          <div className="divide-y divide-black/5 max-h-[360px] overflow-y-auto">
            {aiAlerts.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-2">
                <Badge tone={SEV_TONE[a.sev] ?? "blue"}>{a.sev.toUpperCase()}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-black leading-snug">{a.text}</div>
                  <div className="text-[10px] text-black/40 mt-0.5">{a.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ministry leaderboard */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-black/8 flex items-center justify-between">
          <div className="text-sm font-semibold">Ministry Leaderboard — every ministry, every metric</div>
          <Badge tone="blue">{ZW_MINISTRIES.length} ministries</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#fafafa] text-black/50 uppercase text-[10px]">
              <tr>
                <th className="text-left px-4 py-2">Ministry</th>
                <th className="text-center px-4 py-2">Code</th>
                <th className="text-center px-4 py-2">Depts</th>
                <th className="text-center px-4 py-2">SOEs</th>
                <th className="text-right px-4 py-2">Budget</th>
                <th className="text-right px-4 py-2">Spent</th>
                <th className="text-center px-4 py-2">Tenders</th>
                <th className="text-center px-4 py-2">Contracts</th>
                <th className="text-center px-4 py-2">Staff</th>
                <th className="text-center px-4 py-2">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {ZW_MINISTRIES.map((m, i) => {
                const s = ministrySpend[i];
                return (
                  <tr key={m.id} className="border-t border-black/5 hover:bg-[#fafafa]">
                    <td className="px-4 py-2 font-medium text-black truncate max-w-[260px]">{m.name}</td>
                    <td className="px-4 py-2 text-center font-mono text-black/60">{m.code}</td>
                    <td className="px-4 py-2 text-center">{m.departments.length}</td>
                    <td className="px-4 py-2 text-center">{m.stateEntities.length}</td>
                    <td className="px-4 py-2 text-right tabular-nums">${s.budget}M</td>
                    <td className="px-4 py-2 text-right tabular-nums text-black/60">${s.spent}M</td>
                    <td className="px-4 py-2 text-center">{s.tenders}</td>
                    <td className="px-4 py-2 text-center">{s.contracts}</td>
                    <td className="px-4 py-2 text-center">{s.staff.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge tone={s.compliance >= 85 ? "green" : s.compliance >= 70 ? "blue" : s.compliance >= 60 ? "amber" : "red"}>
                        {s.compliance}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </ModulePage>
  );
}
