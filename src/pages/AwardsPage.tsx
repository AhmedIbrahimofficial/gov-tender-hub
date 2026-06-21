import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { tenders } from "@/lib/mock-data";
import { Trophy, Clock, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

const appeals = [
  { ref: "APP-2026-014", tender: "ZW-PRA-2026-00175", bidder: "Granite Construction Group", grounds: "Specification bias", filed: "2026-06-10", status: "Under Review" },
  { ref: "APP-2026-013", tender: "ZW-PRA-2026-00172", bidder: "Eastern Highlands Logistics", grounds: "Evaluation error", filed: "2026-06-08", status: "Dismissed" },
  { ref: "APP-2026-012", tender: "ZW-PRA-2026-00170", bidder: "Sable ICT Solutions", grounds: "Procedural breach", filed: "2026-06-01", status: "Upheld" },
];

export default function AwardsPage() {
  const awarded = tenders.filter((t) => t.status === "Awarded");

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Phases 15 – 17</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Awards & Appeals Management"
          description="Due diligence, award approval, award notification, and full electronic appeals lifecycle aligned with the PPDPA Act."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Awards Issued YTD" value="1,842" delta="+142 this month" icon={Trophy} />
          <KpiCard label="Standstill Active" value="24" delta="14 days remaining avg" icon={Clock} />
          <KpiCard label="Open Appeals" value="14" delta="+3 this week" positive={false} icon={Scale} />
          <KpiCard label="Appeals Upheld" value="3" delta="This year" icon={CheckCircle2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader title="Recent Award Notices" />
            <div className="divide-y divide-border">
              {awarded.concat([
                { id: "ZW-PRA-2026-00175", title: "ZIMRA HQ Renovation", entity: "ZIMRA", category: "Infrastructure", value: "USD 4.2M", method: "Open", status: "Awarded", closing: "2026-05-20", bids: 8 } as typeof tenders[0],
                { id: "ZW-PRA-2026-00172", title: "Ministry Fleet Vehicles", entity: "Ministry of Transport", category: "Equipment", value: "USD 1.8M", method: "Framework", status: "Awarded", closing: "2026-05-15", bids: 6 } as typeof tenders[0],
              ]).map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground">{t.entity} · {t.id} · {t.value}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="green">Awarded</Badge>
                    <span className="text-[11px] text-muted-foreground">14d standstill</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Appeals Tribunal" subtitle="Active appeals" action={<Badge tone="amber">14 open</Badge>} />
            <div className="divide-y divide-border">
              {appeals.map((a) => (
                <div key={a.ref} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{a.ref}</span>
                    <Badge tone={a.status === "Under Review" ? "amber" : a.status === "Upheld" ? "green" : "muted"}>{a.status}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{a.bidder} · {a.grounds}</div>
                  <div className="text-[11px] text-muted-foreground">{a.tender} · Filed {a.filed}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <FeatureGrid features={[
          { title: "Due Diligence (Phase 15)", desc: "Background checks, financial revalidation, site visits, capacity verification before award." },
          { title: "Award Approval (Phase 16)", desc: "Multi-tier approval, adjudication committee, accounting officer authorization, PRAZ notification where required." },
          { title: "Award Notification (Phase 17)", desc: "Successful and unsuccessful bidder notifications with reasons, standstill period management." },
          { title: "Appeals Submission", desc: "Aggrieved bidder e-submission with grounds, evidence, and fee handling." },
          { title: "Appeals Tribunal Workflow", desc: "Independent review, hearing scheduling, decision publication, remedy execution." },
          { title: "Immutable Audit Trail", desc: "Every decision, approval, override, and AI recommendation is cryptographically logged." },
        ]} />
      </div>
    </AppShell>
  );
}
