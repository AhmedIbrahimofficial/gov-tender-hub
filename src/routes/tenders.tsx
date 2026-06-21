import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid, Card, CardHeader, Badge } from "@/components/ModulePage";
import { tenders } from "@/lib/mock-data";
import { Plus, Filter, Download } from "lucide-react";

export const Route = createFileRoute("/tenders")({
  head: () => ({ meta: [{ title: "Tender Management — National Procurement Platform" }, { name: "description", content: "End-to-end tender preparation, approval, publication, bidding, and award workflows." }] }),
  component: TendersPage,
});

function TendersPage() {
  return (
    <ModulePage
      phase="Phases 3 – 10"
      title="Tender Management"
      description="Prepare, approve, publish, receive bids on, and close national tenders. Covers tender drafting, TOR/BOQ generation, evaluation design, committee assignment, electronic submission, secure vault, and bid opening."
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary"><Filter className="h-4 w-4" /> Filter</button>
          <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary"><Download className="h-4 w-4" /> Export</button>
        </div>
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
          <Plus className="h-4 w-4" /> New Tender
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader title="All Tenders" subtitle={`${tenders.length} records · live`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs text-muted-foreground">
              <tr>
                {["Reference", "Title", "Entity", "Category", "Method", "Value", "Closing", "Bids", "Status"].map((h) => (
                  <th key={h} className="text-left font-medium px-5 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tenders.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40 cursor-pointer">
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{t.id}</td>
                  <td className="px-5 py-3 max-w-[300px]"><div className="truncate text-foreground font-medium">{t.title}</div></td>
                  <td className="px-5 py-3 text-foreground">{t.entity}</td>
                  <td className="px-5 py-3 text-foreground">{t.category}</td>
                  <td className="px-5 py-3"><Badge tone="muted">{t.method}</Badge></td>
                  <td className="px-5 py-3 text-foreground font-medium">{t.value}</td>
                  <td className="px-5 py-3 text-foreground">{t.closing}</td>
                  <td className="px-5 py-3 text-foreground">{t.bids}</td>
                  <td className="px-5 py-3"><Badge tone={t.status === "Awarded" ? "green" : t.status === "Evaluation" ? "amber" : t.status === "Cancelled" ? "red" : "blue"}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="text-sm font-semibold text-foreground mb-3">Lifecycle Phases</h2>
      <FeatureGrid features={[
        { title: "Phase 3 — Tender Preparation", desc: "Workspace, drafting, specification builder, TOR & BOQ generators, evaluation design, committee assignment, COI management, version control." },
        { title: "Phase 4 — Tender Approval", desc: "Legal review, compliance review, finance review, publication authorization workflows with full audit trail." },
        { title: "Phase 5 — Publication", desc: "Website, portal, email, and SMS publishing with AI publication optimizer and supplier notifications." },
        { title: "Phase 7 — Clarifications", desc: "Pre-bid meetings, Q&A management, broadcast clarifications to all registered bidders." },
        { title: "Phase 8 — Bid Submission", desc: "Electronic submission, digital signatures, encryption, secure vault, auto compliance validation." },
        { title: "Phase 9 — Tender Closing", desc: "Late bid prevention, automated closure, encrypted preservation until opening." },
        { title: "Phase 10 — Bid Opening", desc: "Opening committee portal, attendance, session recording, opening minutes, opening register, audit logs." },
      ]} />
    </ModulePage>
  );
}
