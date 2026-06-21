import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge } from "@/components/ModulePage";
import { Sparkles, Brain, FileSearch, ScanLine } from "lucide-react";

export const Route = createFileRoute("/evaluations")({
  head: () => ({ meta: [{ title: "Evaluations — AI Evaluation Engine" }, { name: "description", content: "AI-powered administrative, technical, financial, and combined bid evaluation." }] }),
  component: EvaluationsPage,
});

const samples = [
  { tender: "ZW-PRA-2026-00183 — ARV Medicines Framework", phase: "Technical Evaluation", method: "QCBS", bidders: 8, status: "Scoring" },
  { tender: "ZW-PRA-2026-00179 — Audit Services", phase: "Financial Evaluation", method: "QCBS", bidders: 9, status: "Moderation" },
  { tender: "ZW-PRA-2026-00180 — Pfumvudza Fertiliser", phase: "Combined Evaluation", method: "Least Cost", bidders: 14, status: "Award Recommendation" },
];

function EvaluationsPage() {
  return (
    <ModulePage
      phase="Phases 11 – 14"
      title="AI Evaluation Engine"
      description="Administrative, Technical, Financial, and Combined evaluation workbench with dynamic weighted scoring, consensus, moderation, explainable AI narratives, and document intelligence."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
        {[
          { phase: "Phase 11", title: "Administrative", icon: ScanLine, desc: "Compliance matrix, mandatory requirements, eligibility, bid security, responsive determination." },
          { phase: "Phase 12", title: "Technical", icon: Brain, desc: "Supplies / Works / Services scoring with custom weights, pass marks, CV evaluation, OCR document intelligence, AI narratives." },
          { phase: "Phase 13", title: "Financial", icon: FileSearch, desc: "BOQ validation, arithmetic checks, cost realism, abnormally low bid detection, life-cycle costing." },
          { phase: "Phase 14", title: "Combined", icon: Sparkles, desc: "QCBS / QBS / LRB / LERB ranking engine with AI award recommendation and explainable scoring." },
        ].map((p) => (
          <Card key={p.title} className="p-4">
            <div className="flex items-center gap-2 mb-2"><p.icon className="h-4 w-4 text-primary" /><Badge tone="blue">{p.phase}</Badge></div>
            <div className="text-sm font-semibold text-foreground">{p.title} Evaluation</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader title="Active Evaluations" />
        <div className="divide-y divide-border">
          {samples.map((s, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-foreground">{s.tender}</div>
                <div className="text-[11px] text-muted-foreground">{s.phase} · {s.method} · {s.bidders} bidders</div>
              </div>
              <Badge tone="amber">{s.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Evaluator Workbench — Technical Scoring Sample" subtitle="ZW-PRA-2026-00183 · ARV Medicines Framework" action={<Badge tone="blue">AI assisted</Badge>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs text-muted-foreground">
              <tr>{["Bidder", "Specification (40%)", "Delivery (20%)", "Manufacturer Auth. (15%)", "Warranty (10%)", "Quality (15%)", "Weighted Score", "AI Rec."].map((h) => <th key={h} className="text-left font-medium px-5 py-2.5">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { v: "Zimbabwe Pharma Holdings", s: [92, 88, 95, 80, 90], rec: "Strong" },
                { v: "Continental Med Africa", s: [88, 82, 90, 85, 87], rec: "Strong" },
                { v: "Sable Pharma", s: [78, 70, 75, 70, 80], rec: "Acceptable" },
                { v: "Granite Med Supplies", s: [60, 55, 65, 60, 62], rec: "Marginal" },
              ].map((r) => {
                const w = [0.40, 0.20, 0.15, 0.10, 0.15];
                const score = r.s.reduce((a, b, i) => a + b * w[i], 0);
                return (
                  <tr key={r.v} className="hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium text-foreground">{r.v}</td>
                    {r.s.map((sc, i) => <td key={i} className="px-5 py-3 text-foreground">{sc}</td>)}
                    <td className="px-5 py-3 font-semibold text-primary">{score.toFixed(2)}</td>
                    <td className="px-5 py-3"><Badge tone={r.rec === "Strong" ? "green" : r.rec === "Acceptable" ? "blue" : "amber"}>{r.rec}</Badge></td>
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
