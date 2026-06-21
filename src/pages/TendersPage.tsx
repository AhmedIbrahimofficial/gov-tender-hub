import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { useTenders } from "@/hooks/use-store";
import { Plus, Download, Search, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import NewTenderModal from "@/components/NewTenderModal";

const STATUS_COLORS: Record<string, "blue" | "amber" | "green" | "muted" | "red"> = {
  Draft: "muted", Published: "blue", Bidding: "blue", Evaluation: "amber",
  Awarded: "green", Cancelled: "red",
};

export default function TendersPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showNewTender, setShowNewTender] = useState(false);
  const { tenders } = useTenders();

  const filtered = tenders.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.entity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = tenders.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="blue">Phases 3 – 10</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Tender Management"
          description="Prepare, approve, publish, receive bids on, and close national tenders across all Government of Zimbabwe entities."
          actions={
            <button onClick={() => setShowNewTender(true)} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" /> New Tender
            </button>
          }
        />

        {/* Status KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Active Tenders" value="1,287" delta="+42 this week" icon={FileText} />
          <KpiCard label="Bidding Open" value={String(statusCounts["Bidding"] || 0)} delta="Accepting bids" icon={Clock} />
          <KpiCard label="Awarded" value={String(statusCounts["Awarded"] || 0)} delta="This period" icon={CheckCircle2} />
          <KpiCard label="Cancelled" value={String(statusCounts["Cancelled"] || 0)} delta="This period" positive={false} icon={XCircle} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenders…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-1">
            {["All", "Published", "Bidding", "Evaluation", "Awarded", "Draft"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary ml-auto">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        <Card className="mb-6">
          <CardHeader title="All Tenders" subtitle={`${filtered.length} records · live`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  {["Reference", "Title", "Entity", "Category", "Method", "Value", "Closing", "Bids", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-8 text-center text-muted-foreground text-sm">No tenders match your search.</td></tr>
                ) : filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/40 cursor-pointer">
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{t.id}</td>
                    <td className="px-5 py-3 max-w-[260px]"><div className="truncate text-foreground font-medium">{t.title}</div></td>
                    <td className="px-5 py-3 text-foreground whitespace-nowrap">{t.entity}</td>
                    <td className="px-5 py-3 text-foreground whitespace-nowrap">{t.category}</td>
                    <td className="px-5 py-3 whitespace-nowrap"><Badge tone="muted">{t.method}</Badge></td>
                    <td className="px-5 py-3 text-foreground font-medium whitespace-nowrap">{t.value}</td>
                    <td className="px-5 py-3 text-foreground whitespace-nowrap">{t.closing}</td>
                    <td className="px-5 py-3 text-foreground">{t.bids}</td>
                    <td className="px-5 py-3 whitespace-nowrap"><Badge tone={STATUS_COLORS[t.status] ?? "default"}>{t.status}</Badge></td>
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
          { title: "Phase 10 — Bid Opening", desc: "Opening committee portal, attendance, session recording, opening minutes, opening register, audit logs." },
        ]} />
      </div>
    </AppShell>
  );
}
