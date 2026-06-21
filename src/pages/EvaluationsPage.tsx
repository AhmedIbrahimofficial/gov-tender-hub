import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { Sparkles, Brain, FileSearch, ScanLine, CheckCircle2, AlertTriangle } from "lucide-react";

const EVAL_SAMPLES = [
  { tender: "ZW-PRA-2026-00183 — ARV Medicines Framework", phase: "Technical Evaluation", method: "QCBS", bidders: 8, status: "Scoring" },
  { tender: "ZW-PRA-2026-00179 — Audit Services", phase: "Financial Evaluation", method: "QCBS", bidders: 9, status: "Moderation" },
  { tender: "ZW-PRA-2026-00180 — Pfumvudza Fertiliser", phase: "Combined Evaluation", method: "Least Cost", bidders: 14, status: "Award Recommendation" },
  { tender: "ZW-PRA-2026-00178 — School Textbooks", phase: "Administrative", method: "Open", bidders: 12, status: "Compliance Check" },
];

const BIDS = [
  { v: "Zimbabwe Pharma Holdings", s: [92, 88, 95, 80, 90], rec: "Strong" },
  { v: "Continental Med Africa", s: [88, 82, 90, 85, 87], rec: "Strong" },
  { v: "Sable Pharma", s: [78, 70, 75, 70, 80], rec: "Acceptable" },
  { v: "Granite Med Supplies", s: [60, 55, 65, 60, 62], rec: "Marginal" },
];

const W = [0.40, 0.20, 0.15, 0.10, 0.15];

export default function EvaluationsPage() {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    { phase: "Phase 11", title: "Administrative", icon: ScanLine, desc: "Compliance matrix, mandatory requirements, eligibility, bid security, responsive determination." },
    { phase: "Phase 12", title: "Technical", icon: Brain, desc: "Supplies / Works / Services scoring with custom weights, pass marks, CV evaluation, OCR document intelligence." },
    { phase: "Phase 13", title: "Financial", icon: FileSearch, desc: "BOQ validation, arithmetic checks, cost realism, abnormally low bid detection, life-cycle costing." },
    { phase: "Phase 14", title: "Combined", icon: Sparkles, desc: "QCBS / QBS / LRB / LERB ranking engine with AI award recommendation and explainable scoring." },
  ];

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Phases 11 – 14</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="AI Evaluation Engine"
          description="Administrative, Technical, Financial, and Combined evaluation workbench with dynamic weighted scoring, consensus, moderation, and explainable AI narratives."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Active Evaluations" value="42" delta="+3 new today" />
          <KpiCard label="Pending Moderation" value="8" delta="2 overdue" positive={false} />
          <KpiCard label="AI Recommendations" value="34" delta="Awaiting approval" />
          <KpiCard label="Completed This Month" value="127" delta="+18%" />
        </div>

        {/* Phase tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
          {phases.map((p, i) => (
            <div
              key={p.title}
              onClick={() => setActivePhase(i)}
            >
            <Card
              className={`p-4 cursor-pointer transition-all hover:border-primary/40 ${activePhase === i ? "border-primary bg-primary/5" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <p.icon className="h-4 w-4 text-primary" />
                <Badge tone="blue">{p.phase}</Badge>
              </div>
              <div className="text-sm font-semibold text-foreground">{p.title} Evaluation</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </Card>
            </div>
          ))}
        </div>

        {/* Active evaluations */}
        <Card className="mb-6">
          <CardHeader title="Active Evaluations" />
          <div className="divide-y divide-border">
            {EVAL_SAMPLES.map((s, i) => (
              <div key={i} className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{s.tender}</div>
                  <div className="text-[11px] text-muted-foreground">{s.phase} · {s.method} · {s.bidders} bidders</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge tone={s.status === "Award Recommendation" ? "green" : s.status === "Moderation" ? "amber" : "blue"}>{s.status}</Badge>
                  <button className="h-7 px-2.5 rounded-md border border-border text-xs hover:bg-secondary transition-colors">Open</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Evaluator Workbench */}
        <Card>
          <CardHeader
            title="Evaluator Workbench — Technical Scoring"
            subtitle="ZW-PRA-2026-00183 · ARV Medicines Framework"
            action={<Badge tone="blue"><Sparkles className="h-3 w-3 mr-1" />AI assisted</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  {["Bidder", "Specification (40%)", "Delivery (20%)", "Mfr Auth. (15%)", "Warranty (10%)", "Quality (15%)", "Weighted Score", "AI Rec."].map((h) => (
                    <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {BIDS.map((r) => {
                  const score = r.s.reduce((a, b, i) => a + b * W[i], 0);
                  return (
                    <tr key={r.v} className="hover:bg-secondary/40">
                      <td className="px-5 py-3 font-medium text-foreground whitespace-nowrap">{r.v}</td>
                      {r.s.map((sc, i) => (
                        <td key={i} className={`px-5 py-3 font-medium ${sc >= 85 ? "text-emerald-600" : sc >= 70 ? "text-foreground" : "text-amber-600"}`}>{sc}</td>
                      ))}
                      <td className="px-5 py-3 font-bold text-primary">{score.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {r.rec === "Strong" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                          <Badge tone={r.rec === "Strong" ? "green" : r.rec === "Acceptable" ? "blue" : "amber"}>{r.rec}</Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-emerald-50 border-t border-border flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">AI Recommendation: Zimbabwe Pharma Holdings — Highest weighted score at 90.45. Proceed to Financial Evaluation.</span>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
