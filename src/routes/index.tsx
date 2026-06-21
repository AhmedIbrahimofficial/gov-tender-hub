import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Card, CardHeader, KpiCard, Badge } from "@/components/AppShell";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { kpis, spendTrend, categorySpend, provinceSpend, tenders, aiAgents } from "@/lib/mock-data";
import { Sparkles, ArrowUpRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "National Procurement Command Center — Government of Zimbabwe" },
      { name: "description", content: "Real-time national procurement, tender, contract, vendor, compliance and AI operations command center." },
    ],
  }),
  component: CommandCenter,
});

const BLUE = "oklch(0.5 0.2 255)";
const BLUE_SOFT = "oklch(0.78 0.12 255)";
const PIE_COLORS = ["oklch(0.5 0.2 255)", "oklch(0.6 0.18 250)", "oklch(0.7 0.14 245)", "oklch(0.8 0.1 240)", "oklch(0.88 0.06 235)", "oklch(0.93 0.03 230)"];

function CommandCenter() {
  return (
    <AppShell>
      <div className="p-6 max-w-[1600px] mx-auto">
        <PageHeader
          title="National Procurement Command Center"
          description="Real-time oversight of all national procurement activity, spend, compliance, and AI agent operations across all Government of Zimbabwe entities."
          actions={
            <>
              <button className="h-9 px-3 rounded-md border border-border bg-card text-sm font-medium hover:bg-secondary">FY 2026</button>
              <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Ask AI Advisor
              </button>
            </>
          }
        />

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label={kpis.totalSpend.label} value={kpis.totalSpend.value} delta={kpis.totalSpend.delta} />
          <KpiCard label={kpis.activeTenders.label} value={kpis.activeTenders.value} delta={kpis.activeTenders.delta} />
          <KpiCard label={kpis.openEvaluations.label} value={kpis.openEvaluations.value} delta={kpis.openEvaluations.delta} />
          <KpiCard label={kpis.contractsInProgress.label} value={kpis.contractsInProgress.value} delta={kpis.contractsInProgress.delta} />
          <KpiCard label={kpis.procurementSavings.label} value={kpis.procurementSavings.value} delta={kpis.procurementSavings.delta} />
          <KpiCard label={kpis.complianceScore.label} value={kpis.complianceScore.value} delta={kpis.complianceScore.delta} />
          <KpiCard label={kpis.fraudAlerts.label} value={kpis.fraudAlerts.value} delta={kpis.fraudAlerts.delta} positive={false} />
          <KpiCard label={kpis.budgetUtilization.label} value={kpis.budgetUtilization.value} delta={kpis.budgetUtilization.delta} />
        </div>

        {/* Spend trend + category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader title="National Procurement Spend & Savings" subtitle="Monthly, USD millions" action={<Badge tone="blue">Live</Badge>} />
            <div className="p-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTrend}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.93 0.01 250)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.01 250)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="spend" stroke={BLUE} strokeWidth={2} fill="url(#spendGrad)" name="Spend" />
                  <Area type="monotone" dataKey="savings" stroke={BLUE_SOFT} strokeWidth={2} fill="transparent" name="Savings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Spend by Category" subtitle="Year to date" />
            <div className="p-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySpend} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {categorySpend.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.01 250)", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Provinces + AI agents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Procurement by Province" subtitle="Spend (USD M) and active tenders per province" />
            <div className="p-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceSpend} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid stroke="oklch(0.93 0.01 250)" horizontal={false} />
                  <XAxis type="number" stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="province" stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} width={140} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.01 250)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="spend" fill={BLUE} radius={[0, 4, 4, 0]} name="Spend (USD M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="AI Agents" subtitle="Live operations" action={<Badge tone="green">11 active</Badge>} />
            <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
              {aiAgents.slice(0, 7).map((a) => (
                <div key={a.name} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.actions.toLocaleString()} actions · {a.pending} pending</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">{a.confidence}%</div>
                    <div className="text-[10px] text-muted-foreground">confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent tenders + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Recent National Tenders" subtitle="Across all government entities" action={<a href="/tenders" className="text-xs text-primary font-medium flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></a>} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-5 py-2">Reference</th>
                    <th className="text-left font-medium px-5 py-2">Title</th>
                    <th className="text-left font-medium px-5 py-2">Value</th>
                    <th className="text-left font-medium px-5 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tenders.slice(0, 6).map((t) => (
                    <tr key={t.id} className="hover:bg-secondary/40">
                      <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{t.id}</td>
                      <td className="px-5 py-3">
                        <div className="text-foreground font-medium truncate max-w-[340px]">{t.title}</div>
                        <div className="text-[11px] text-muted-foreground">{t.entity}</div>
                      </td>
                      <td className="px-5 py-3 text-foreground">{t.value}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Risk & Fraud Alerts" subtitle="Flagged by AI" action={<Badge tone="red">23 open</Badge>} />
            <div className="divide-y divide-border">
              {[
                { sev: "High", title: "Abnormally low bid detected", ctx: "ZW-PRA-2026-00179 · Audit Services", time: "12 min ago" },
                { sev: "High", title: "Repeat winner pattern in Bulawayo", ctx: "VEN-00478 · 4 awards in 30 days", time: "1 h ago" },
                { sev: "Med", title: "Director conflict of interest match", ctx: "ZW-PRA-2026-00181 · Highway Sec. 4", time: "3 h ago" },
                { sev: "Med", title: "Specification mirrors single vendor", ctx: "ZW-PRA-2026-00177 · Hospitals", time: "5 h ago" },
                { sev: "Low", title: "Budget threshold 90% reached", ctx: "Min. Education · FY26 Q3", time: "1 d ago" },
              ].map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${a.sev === "High" ? "text-destructive" : a.sev === "Med" ? "text-[oklch(0.65_0.16_60)]" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{a.title}</div>
                    <div className="text-[11px] text-muted-foreground">{a.ctx} · {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, "blue" | "amber" | "green" | "muted" | "red"> = {
    Draft: "muted", Published: "blue", Bidding: "blue", Evaluation: "amber",
    Awarded: "green", Cancelled: "red",
  };
  return <Badge tone={tone[status] ?? "default"}>{status}</Badge>;
}
