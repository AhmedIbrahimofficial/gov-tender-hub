import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge } from "@/components/ModulePage";
import { aiAgents } from "@/lib/mock-data";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/ai-agents")({
  head: () => ({ meta: [{ title: "AI Operations Center — National Procurement Platform" }, { name: "description", content: "Live monitoring of all AI agents: supplier verification, tender drafting, compliance, fraud detection, technical and financial evaluation, contract intelligence." }] }),
  component: AiAgentsPage,
});

function AiAgentsPage() {
  return (
    <ModulePage
      phase="AI Layer"
      title="AI Operations Center"
      description="Real-time status of every agentic AI operating across the national procurement lifecycle, with confidence scores, action histories, and human-in-the-loop approvals."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {aiAgents.map((a) => (
          <Card key={a.name} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-md bg-primary-soft text-primary grid place-items-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{a.name}</div>
                  <Badge tone={a.status === "Active" ? "green" : "muted"}>{a.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">{a.confidence}%</div>
                <div className="text-[10px] text-muted-foreground">confidence</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" /> {a.actions.toLocaleString()} actions
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {a.pending} pending review
              </div>
            </div>
            <button className="mt-3 w-full h-8 rounded-md bg-secondary text-xs font-medium hover:bg-primary-soft hover:text-primary">
              Open agent console
            </button>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Recent AI Decisions" subtitle="Last 24 hours · explainable AI trail" />
          <div className="divide-y divide-border">
            {[
              { agent: "Fraud Detection Agent", action: "Flagged 4 abnormally low bids on ZW-PRA-2026-00179", confidence: 94, approval: "Pending review" },
              { agent: "Tender Drafting Copilot", action: "Generated TOR & BOQ draft for District Hospitals tender", confidence: 89, approval: "Approved by PO" },
              { agent: "Supplier Verification Agent", action: "Auto-approved 12 vendor KYC submissions", confidence: 97, approval: "Auto-approved" },
              { agent: "Contract Intelligence Agent", action: "Extracted 134 obligations from 8 new contracts", confidence: 96, approval: "Auto-approved" },
              { agent: "Award Recommendation Agent", action: "Recommended Zimbabwe Pharma Holdings for ARV framework", confidence: 92, approval: "Pending adjudication" },
            ].map((d, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-foreground">{d.action}</div>
                  <div className="text-[11px] text-muted-foreground">{d.agent} · confidence {d.confidence}%</div>
                </div>
                <Badge tone={d.approval.includes("Pending") ? "amber" : "green"}>{d.approval}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ModulePage>
  );
}
