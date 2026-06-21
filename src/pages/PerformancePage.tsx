import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { vendors } from "@/lib/mock-data";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend } from "recharts";
import { Star, TrendingUp, AlertTriangle } from "lucide-react";

export default function PerformancePage() {
  const radarData = [
    { subject: "Delivery", A: 92, B: 78, fullMark: 100 },
    { subject: "Quality", A: 88, B: 82, fullMark: 100 },
    { subject: "Compliance", A: 96, B: 74, fullMark: 100 },
    { subject: "Responsiveness", A: 84, B: 70, fullMark: 100 },
    { subject: "Price", A: 78, B: 85, fullMark: 100 },
    { subject: "Innovation", A: 72, B: 65, fullMark: 100 },
  ];

  return (
    <AppShell>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="blue">Phase 22</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Vendor Performance Management"
          description="Continuous performance evaluation per contract and aggregated supplier scorecards across all government entities."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Avg Supplier Rating" value="4.3 / 5.0" delta="+0.2 this quarter" icon={Star} />
          <KpiCard label="On-Time Delivery" value="87.4%" delta="+1.2 pts" icon={TrendingUp} />
          <KpiCard label="Quality Issues" value="142" delta="+12 this month" positive={false} icon={AlertTriangle} />
          <KpiCard label="PIPs Active" value="18" delta="Performance plans" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader title="Vendor Scorecards" subtitle="Top 7 vendors by contract value" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs text-muted-foreground">
                  <tr>
                    {["Vendor", "Delivery", "Quality", "Compliance", "Overall", "Trend"].map((h) => (
                      <th key={h} className="text-left font-medium px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendors.map((v) => {
                    const scores = { delivery: v.rating * 18 + 5, quality: v.rating * 17 + 8, compliance: v.rating * 19 };
                    const overall = ((scores.delivery + scores.quality + scores.compliance) / 3).toFixed(0);
                    return (
                      <tr key={v.id} className="hover:bg-secondary/40">
                        <td className="px-4 py-2.5 font-medium text-foreground">{v.name}</td>
                        <td className="px-4 py-2.5">{scores.delivery.toFixed(0)}%</td>
                        <td className="px-4 py-2.5">{scores.quality.toFixed(0)}%</td>
                        <td className="px-4 py-2.5">{scores.compliance.toFixed(0)}%</td>
                        <td className="px-4 py-2.5 font-bold text-primary">{overall}%</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={Number(overall) > 85 ? "green" : Number(overall) > 70 ? "blue" : "amber"}>
                            {Number(overall) > 85 ? "Excellent" : Number(overall) > 70 ? "Good" : "Watch"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Performance Radar" subtitle="Top vendor vs market average" />
            <div className="p-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Radar name="Best Vendor" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Radar name="Market Avg" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <FeatureGrid features={[
          { title: "Delivery Score", desc: "On-time delivery, partial delivery, lead-time variance per line item." },
          { title: "Quality Score", desc: "Inspection results, defect rates, returns, warranty claims." },
          { title: "Compliance Score", desc: "Documentation completeness, tax clearance currency, statutory compliance." },
          { title: "Responsiveness", desc: "Query response times, issue resolution, dispute frequency." },
          { title: "Aggregate Rating", desc: "Cross-entity supplier scorecard influencing pre-qualification and shortlisting." },
          { title: "Performance Sanctions", desc: "Warning letters, performance improvement plans, suspension, blacklist escalation." },
        ]} />
      </div>
    </AppShell>
  );
}
