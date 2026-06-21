import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Shield, AlertTriangle, CheckCircle2, FileText } from "lucide-react";

const auditLog = [
  { id: "AUD-2026-4281", event: "Tender specification modified post-publication", entity: "Min. Energy", risk: "High", timestamp: "2026-06-21 09:14", resolved: false },
  { id: "AUD-2026-4280", event: "Bid vault accessed outside opening window", entity: "Min. Health", risk: "High", timestamp: "2026-06-21 08:42", resolved: false },
  { id: "AUD-2026-4279", event: "Approval threshold exceeded without override", entity: "ZIMRA", risk: "Med", timestamp: "2026-06-20 17:22", resolved: true },
  { id: "AUD-2026-4278", event: "Contract variation approved without committee", entity: "Min. Transport", risk: "Med", timestamp: "2026-06-20 14:05", resolved: false },
  { id: "AUD-2026-4277", event: "Tax clearance certificate expired — vendor active", entity: "ZINARA", risk: "Low", timestamp: "2026-06-19 11:18", resolved: true },
];

const complianceTrend = [
  { month: "Jan", score: 91.2 },
  { month: "Feb", score: 92.1 },
  { month: "Mar", score: 90.8 },
  { month: "Apr", score: 93.4 },
  { month: "May", score: 93.8 },
  { month: "Jun", score: 94.2 },
];

export default function AuditPage() {
  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Phase 23</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Audit & Compliance"
          description="Continuous-audit engine, real-time policy adherence monitoring, exception management, and audit-ready trails for the Office of the Auditor-General and PRAZ."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Compliance Score" value="94.2%" delta="+1.8 pts" icon={Shield} />
          <KpiCard label="Open Exceptions" value="47" delta="+5 today" positive={false} icon={AlertTriangle} />
          <KpiCard label="Resolved This Month" value="312" delta="87% resolution rate" icon={CheckCircle2} />
          <KpiCard label="Audit Events Today" value="8,421" delta="All logged" icon={FileText} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader title="Compliance Score Trend" subtitle="Rolling 6-month compliance" />
            <div className="p-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrend}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[88, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} name="Compliance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Exceptions by Category" subtitle="Current period" />
            <div className="p-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { category: "Approval", count: 14 },
                  { category: "Documentation", count: 11 },
                  { category: "Procurement Method", count: 8 },
                  { category: "Vendor Eligibility", count: 7 },
                  { category: "Timeline", count: 4 },
                  { category: "Financial", count: 3 },
                ]}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Exceptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader title="Live Audit Trail" subtitle="Real-time exception log" action={<Badge tone="blue">Continuous</Badge>} />
          <div className="divide-y divide-border">
            {auditLog.map((e) => (
              <div key={e.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${e.risk === "High" ? "bg-red-500" : e.risk === "Med" ? "bg-amber-500" : "bg-blue-400"}`} />
                  <div>
                    <div className="text-sm font-medium text-foreground">{e.event}</div>
                    <div className="text-[11px] text-muted-foreground">{e.entity} · {e.id} · {e.timestamp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge tone={e.risk === "High" ? "red" : e.risk === "Med" ? "amber" : "muted"}>{e.risk}</Badge>
                  <Badge tone={e.resolved ? "green" : "amber"}>{e.resolved ? "Resolved" : "Open"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <FeatureGrid features={[
          { title: "Immutable Audit Trail", desc: "Every event, decision, override, AI action, and document version cryptographically hashed." },
          { title: "Continuous Audit Engine", desc: "Rules engine evaluates every transaction against PPDPA, Treasury Instructions, and entity policies." },
          { title: "Exception Management", desc: "Auto-routed exception queues with root-cause analysis and corrective-action tracking." },
          { title: "Auditor Workspace", desc: "Dedicated workspace for OAG and internal auditors with read-only access, sampling tools, and working papers." },
          { title: "Compliance Dashboards", desc: "Entity-level compliance scoring, peer benchmarking, trend analysis." },
          { title: "Regulatory Reporting", desc: "Pre-built PRAZ, OAG, Parliament, and donor-ready reports." },
        ]} />
      </div>
    </AppShell>
  );
}
