import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { contracts } from "@/lib/mock-data";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function ContractsPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="blue">Phases 18 – 19, 25</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Contract Management"
          description="Full contract lifecycle: drafting, signature, milestones, variations, performance monitoring, deliverables, payments tracking, and closeout."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Active Contracts" value="964" delta="+8 new" />
          <KpiCard label="On Track" value="821" delta="85.2%" />
          <KpiCard label="At Risk" value="103" delta="10.7%" positive={false} />
          <KpiCard label="Completed YTD" value="340" delta="+22%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Active Contracts" subtitle={`${contracts.length} contracts in progress`} />
            <div className="divide-y divide-border">
              {contracts.map((c) => (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/40">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{c.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{c.id} · {c.vendor}</div>
                  </div>
                  <div className="text-sm font-medium text-foreground whitespace-nowrap">{c.value}</div>
                  <div className="w-32">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${c.progress >= 100 ? "bg-emerald-500" : c.status === "At Risk" ? "bg-amber-500" : "bg-primary"}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{c.progress}% · ends {c.end}</div>
                  </div>
                  <Badge tone={c.status === "Completed" ? "green" : c.status === "At Risk" ? "amber" : "blue"}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Contract Progress Distribution" subtitle="By completion %" />
            <div className="p-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { range: "0–20%", count: 42 },
                  { range: "21–40%", count: 118 },
                  { range: "41–60%", count: 231 },
                  { range: "61–80%", count: 298 },
                  { range: "81–99%", count: 167 },
                  { range: "100%", count: 108 },
                ]}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Contracts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <h2 className="text-sm font-semibold mb-3">Contract Lifecycle Capabilities</h2>
        <FeatureGrid features={[
          { title: "Contract Drafting", desc: "Template library, clause library, AI-assisted drafting, version control, redlining." },
          { title: "E-Signature", desc: "Qualified digital signatures, multi-party signing workflows, signed-PDF vault." },
          { title: "Milestones & Deliverables", desc: "Schedule, deliverables register, acceptance certificates, document attachments." },
          { title: "Variations & Amendments", desc: "Change orders, scope/price/time variations with approval workflow and audit trail." },
          { title: "Performance Monitoring", desc: "SLA tracking, KPI scoring, defect logs, deduction calculations." },
          { title: "AI Contract Intelligence", desc: "Clause extraction, risk highlights, obligation tracking, expiry alerts, renewal recommendations." },
        ]} />
      </div>
    </AppShell>
  );
}
