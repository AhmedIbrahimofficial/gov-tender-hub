import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { AlertOctagon, ShieldCheck, Eye, MessageSquare } from "lucide-react";

const alerts = [
  { id: "FRD-2026-089", type: "Bid Rotation", tender: "ZW-PRA-2026-00179", vendors: "VEN-00476, VEN-00481", severity: "Critical", status: "Referred to ZACC" },
  { id: "FRD-2026-088", type: "Conflict of Interest", tender: "ZW-PRA-2026-00181", vendors: "VEN-00478", severity: "High", status: "Under Investigation" },
  { id: "FRD-2026-087", type: "Abnormally Low Bid", tender: "ZW-PRA-2026-00183", vendors: "VEN-00476", severity: "High", status: "Flagged for Review" },
  { id: "FRD-2026-086", type: "PEP Match", tender: "ZW-PRA-2026-00177", vendors: "VEN-00480", severity: "Med", status: "Screening" },
  { id: "FRD-2026-085", type: "Spec Tailoring", tender: "ZW-PRA-2026-00182", vendors: "VEN-00479", severity: "Med", status: "Closed — No Evidence" },
];

export default function AntiCorruptionPage() {
  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="red">Anti-Corruption</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Anti-Corruption Command"
          description="AI-driven detection of corruption red flags across the entire procurement lifecycle, with secure whistleblower channels and integration to the Zimbabwe Anti-Corruption Commission."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Active Fraud Alerts" value="23" delta="+3 today" positive={false} icon={AlertOctagon} />
          <KpiCard label="Cases Referred to ZACC" value="7" delta="This year" icon={ShieldCheck} />
          <KpiCard label="Whistleblower Reports" value="12" delta="4 under review" icon={MessageSquare} />
          <KpiCard label="PEP Matches" value="8" delta="Active screening" positive={false} icon={Eye} />
        </div>

        <Card className="mb-6">
          <CardHeader title="Active Fraud & Corruption Alerts" subtitle="AI-generated, requires human review" action={<Badge tone="red">23 open</Badge>} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  {["Alert ID", "Type", "Tender", "Vendor(s)", "Severity", "Status", ""].map((h) => (
                    <th key={h} className="text-left font-medium px-5 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{a.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{a.type}</td>
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{a.tender}</td>
                    <td className="px-5 py-3 text-foreground">{a.vendors}</td>
                    <td className="px-5 py-3">
                      <Badge tone={a.severity === "Critical" ? "red" : a.severity === "High" ? "red" : "amber"}>{a.severity}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={a.status.includes("ZACC") ? "red" : a.status.includes("Closed") ? "muted" : "amber"}>{a.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button className="h-7 px-2.5 rounded-md border border-border text-xs hover:bg-secondary">Investigate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FeatureGrid features={[
          { title: "Fraud Pattern Detection", desc: "Repeat winners, bid rotation, identical bids, abnormally low or high bids, last-minute specification changes." },
          { title: "Conflict of Interest Screening", desc: "Cross-check officers, evaluators, and approvers against vendor directors and beneficial owners." },
          { title: "Beneficial Ownership Registry", desc: "Mandatory disclosure of UBOs; matched against politically exposed person lists." },
          { title: "Whistleblower Portal", desc: "Encrypted, anonymous channel with case management and protection guarantees." },
          { title: "Sanction & PEP Screening", desc: "OFAC, UN, EU, and PRAZ blacklist screening on every vendor and transaction." },
          { title: "ZACC Integration", desc: "Secure case referral and evidence package generation for the Zimbabwe Anti-Corruption Commission." },
        ]} />
      </div>
    </AppShell>
  );
}
