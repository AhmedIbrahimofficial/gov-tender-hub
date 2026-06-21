import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge, FeatureGrid } from "@/components/ModulePage";
import { contracts } from "@/lib/mock-data";

export const Route = createFileRoute("/contracts")({
  head: () => ({ meta: [{ title: "Contract Management — National Procurement Platform" }, { name: "description", content: "Contract lifecycle, monitoring, variations, milestones, and closeout." }] }),
  component: ContractsPage,
});

function ContractsPage() {
  return (
    <ModulePage
      phase="Phases 18 – 19, 25"
      title="Contract Management"
      description="Full contract lifecycle: drafting, signature, milestones, variations, performance monitoring, deliverables, payments tracking, and closeout."
    >
      <Card className="mb-6">
        <CardHeader title="Active Contracts" subtitle={`${contracts.length} contracts in progress`} />
        <div className="divide-y divide-border">
          {contracts.map((c) => (
            <div key={c.id} className="px-5 py-4 grid grid-cols-12 items-center gap-4 hover:bg-secondary/40">
              <div className="col-span-3">
                <div className="text-sm font-semibold text-foreground">{c.title}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{c.id}</div>
              </div>
              <div className="col-span-3 text-sm text-foreground">{c.vendor}</div>
              <div className="col-span-2 text-sm font-medium text-foreground">{c.value}</div>
              <div className="col-span-2">
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{c.progress}% · ends {c.end}</div>
              </div>
              <div className="col-span-2 text-right">
                <Badge tone={c.status === "Completed" ? "green" : c.status === "At Risk" ? "amber" : "blue"}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="text-sm font-semibold mb-3">Contract Lifecycle Capabilities</h2>
      <FeatureGrid features={[
        { title: "Contract Drafting", desc: "Template library, clause library, AI-assisted drafting, version control, redlining." },
        { title: "E-Signature", desc: "Qualified digital signatures, multi-party signing workflows, signed-PDF vault." },
        { title: "Milestones & Deliverables", desc: "Schedule, deliverables register, acceptance certificates, document attachments." },
        { title: "Variations & Amendments", desc: "Change orders, scope/price/time variations with approval workflow and audit trail." },
        { title: "Performance Monitoring", desc: "SLA tracking, KPI scoring, defect logs, deduction calculations." },
        { title: "AI Contract Intelligence", desc: "Clause extraction, risk highlights, obligation tracking, expiry alerts, renewal recommendations." },
      ]} />
    </ModulePage>
  );
}
