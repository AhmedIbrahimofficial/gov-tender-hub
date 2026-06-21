import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { vendors } from "@/lib/mock-data";
import { Plus, ShieldCheck, Search, Filter, Star } from "lucide-react";

export default function VendorsPage() {
  const [search, setSearch] = useState("");

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Phase 6</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Supplier Lifecycle Management"
          description="National vendor registry: registration, KYC, tax & bank validation, financial and technical qualification, past performance, AI risk scoring, and blacklist management."
          actions={
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
              <Plus className="h-4 w-4" /> Register Vendor
            </button>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Registered Vendors" value="12,847" delta="+284 this month" />
          <KpiCard label="KYC Approved" value="11,204" delta="87.2% approval rate" />
          <KpiCard label="Pending Review" value="1,418" delta="Processing" />
          <KpiCard label="Blacklisted" value="225" delta="+8 this month" positive={false} />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        <Card className="mb-6">
          <CardHeader
            title="Vendor Registry"
            action={<Badge tone="blue"><ShieldCheck className="h-3 w-3 mr-1 inline" />AI Risk Scored</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  {["Vendor ID", "Name", "Category", "Rating", "Contracts", "Risk", "Status", ""].map((h) => (
                    <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-secondary/40 cursor-pointer">
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{v.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{v.name}</td>
                    <td className="px-5 py-3 text-foreground">{v.category}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-medium">{v.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground">{v.contracts}</td>
                    <td className="px-5 py-3">
                      <Badge tone={v.risk === "High" ? "red" : v.risk === "Medium" ? "amber" : "green"}>{v.risk}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={v.status === "Blacklisted" ? "red" : v.status === "Under Review" ? "amber" : "green"}>{v.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button className="h-7 px-2.5 rounded-md border border-border text-xs hover:bg-secondary transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <h2 className="text-sm font-semibold mb-3">Vendor Lifecycle Capabilities</h2>
        <FeatureGrid features={[
          { title: "Registration & KYC", desc: "Company details, directors, beneficial ownership, ID verification, document upload, e-signature." },
          { title: "Tax & Bank Validation", desc: "Real-time ZIMRA tax clearance check, bank account verification, NSSA compliance." },
          { title: "Financial Assessment", desc: "3-year financial statements, turnover, liquidity ratios, credit history analysis." },
          { title: "Technical Qualification", desc: "Certifications, ISO standards, technical capacity, manufacturer authorizations." },
          { title: "Past Performance", desc: "Contract history, delivery scores, defect rates, dispute history across all government entities." },
          { title: "AI Supplier Risk Agent", desc: "Continuous monitoring of news, sanctions lists, ownership changes, and behavioural anomalies." },
        ]} />
      </div>
    </AppShell>
  );
}
