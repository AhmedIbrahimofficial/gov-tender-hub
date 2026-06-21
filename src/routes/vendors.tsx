import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge, FeatureGrid } from "@/components/ModulePage";
import { vendors } from "@/lib/mock-data";
import { Plus, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/vendors")({
  head: () => ({ meta: [{ title: "Vendor Management — National Procurement Platform" }, { name: "description", content: "Vendor registration, KYC, qualification, risk scoring, and blacklist management." }] }),
  component: VendorsPage,
});

function VendorsPage() {
  return (
    <ModulePage
      phase="Phase 6"
      title="Supplier Lifecycle Management"
      description="National vendor registry: registration, KYC, tax & bank validation, financial and technical qualification, past performance, AI risk scoring, and blacklist management."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Registered Vendors</div><div className="text-2xl font-semibold mt-1">12,847</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">KYC Approved</div><div className="text-2xl font-semibold mt-1">11,204</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending Review</div><div className="text-2xl font-semibold mt-1">1,418</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Blacklisted</div><div className="text-2xl font-semibold mt-1 text-destructive">225</div></Card>
      </div>

      <div className="flex justify-end mb-3">
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Register Vendor
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader title="Vendor Registry" action={<Badge tone="blue"><ShieldCheck className="h-3 w-3 mr-1 inline" />AI Risk Scored</Badge>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs text-muted-foreground">
              <tr>{["Vendor ID", "Name", "Category", "Rating", "Contracts", "Risk", "Status"].map((h) => <th key={h} className="text-left font-medium px-5 py-2.5">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{v.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{v.name}</td>
                  <td className="px-5 py-3 text-foreground">{v.category}</td>
                  <td className="px-5 py-3 text-foreground">★ {v.rating}</td>
                  <td className="px-5 py-3 text-foreground">{v.contracts}</td>
                  <td className="px-5 py-3"><Badge tone={v.risk === "High" ? "red" : v.risk === "Medium" ? "amber" : "green"}>{v.risk}</Badge></td>
                  <td className="px-5 py-3"><Badge tone={v.status === "Blacklisted" ? "red" : v.status === "Under Review" ? "amber" : "green"}>{v.status}</Badge></td>
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
    </ModulePage>
  );
}
