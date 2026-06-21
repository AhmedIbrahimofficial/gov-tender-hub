import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge } from "@/components/ModulePage";
import { tenders, contracts, kpis } from "@/lib/mock-data";
import { Search, Download } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Public Transparency Portal — National Procurement, Zimbabwe" },
      { name: "description", content: "Open access to all national tenders, awards, contracts, supplier statistics, and procurement open data." },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  const published = tenders.filter((t) => ["Published", "Bidding", "Evaluation", "Awarded"].includes(t.status));
  const awarded = tenders.filter((t) => t.status === "Awarded");

  return (
    <ModulePage
      title="Public Transparency Portal"
      description="Citizens, journalists, civil society, and businesses can browse every published tender, award, contract, and supplier statistic of the Government of Zimbabwe — fully open data."
    >
      <Card className="p-5 mb-6 bg-primary text-primary-foreground border-primary">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Open Data · Updated live</div>
            <div className="text-xl font-semibold mt-1">{kpis.totalSpend.value} total national procurement spend disclosed YTD</div>
          </div>
          <button className="h-9 px-3 rounded-md bg-white text-primary text-sm font-semibold flex items-center gap-1.5"><Download className="h-4 w-4" /> Download Open Dataset</button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { l: "Published Tenders", v: published.length.toString() },
          { l: "Awards Issued YTD", v: "1,842" },
          { l: "Active Contracts", v: kpis.contractsInProgress.value },
          { l: "Registered Suppliers", v: "12,847" },
          { l: "Citizen Feedback", v: "3,128" },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-semibold mt-1 text-foreground">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader title="Search Published Tenders" />
        <div className="p-5">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by entity, category, or reference…" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm" />
          </div>
          <div className="mt-5 divide-y divide-border">
            {published.map((t) => (
              <div key={t.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.entity} · {t.id} · closes {t.closing}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{t.value}</div>
                  <Badge tone="blue">{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent Award Notices" />
        <div className="divide-y divide-border">
          {awarded.concat(contracts.slice(0, 3).map((c) => ({
            id: c.id, title: c.title, entity: c.vendor, category: "", value: c.value, method: "Open" as const,
            status: "Awarded" as const, closing: c.end, bids: 0,
          }))).map((t) => (
            <div key={t.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{t.title}</div>
                <div className="text-[11px] text-muted-foreground">{t.entity} · awarded · {t.value}</div>
              </div>
              <Badge tone="green">Awarded</Badge>
            </div>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
