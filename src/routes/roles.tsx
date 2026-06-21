import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, Card, CardHeader, Badge } from "@/components/ModulePage";
import { roles } from "@/lib/mock-data";
import { GripVertical, Copy, Share2, ArrowRightLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Role Management Center — National Procurement Platform" }, { name: "description", content: "Visual drag-and-drop role builder: hierarchy, inheritance, cloning, sharing, migration, delegation, and audit trail across 32 roles." }] }),
  component: RolesPage,
});

const features = [
  "View Tenders", "Create Tender", "Approve Tender", "Publish Tender",
  "View Bids", "Open Bids", "Score Technical", "Score Financial",
  "Award Recommendation", "Approve Award", "Manage Contracts", "Approve Variations",
  "Approve Payments", "View Reports", "Export Data", "Manage Users",
  "Configure Workflows", "View Audit Trail", "Manage Vendors", "Blacklist Vendor",
];

function RolesPage() {
  return (
    <ModulePage
      title="Role Management Center"
      description="Visual drag-and-drop control for all 32 system roles. Build, clone, share, migrate, and audit roles without writing a single line of code."
    >
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5"><Copy className="h-4 w-4" /> Clone Role</button>
        <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary"><Share2 className="h-4 w-4" /> Share Feature</button>
        <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary"><ArrowRightLeft className="h-4 w-4" /> Migrate Role</button>
        <button className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary"><Shield className="h-4 w-4" /> Delegate</button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader title="All Roles" subtitle={`${roles.length} system roles`} />
          <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
            {roles.map((r, i) => (
              <div key={r} className={`px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-secondary/50 ${i === 0 ? "bg-primary-soft" : ""}`}>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${i === 0 ? "font-semibold text-primary" : "text-foreground"}`}>{r}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{Math.floor(Math.random() * 25) + 5}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-8">
          <CardHeader title="Chief Procurement Officer" subtitle="Drag features in or out · changes are versioned and audited" action={<Badge tone="blue">Editing</Badge>} />
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Assigned features</div>
            <div className="flex flex-wrap gap-2 mb-6 min-h-[80px] p-3 rounded-md bg-primary-soft/40 border border-dashed border-primary/40">
              {features.slice(0, 12).map((f) => (
                <div key={f} className="bg-card border border-border rounded-md px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-card cursor-grab">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  {f}
                </div>
              ))}
            </div>

            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Available features</div>
            <div className="flex flex-wrap gap-2 p-3 rounded-md bg-secondary/40 border border-dashed border-border">
              {features.slice(12).map((f) => (
                <div key={f} className="bg-card border border-border rounded-md px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-grab">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  {f}
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: "Approval Authority", v: "Up to USD 5M" },
                { l: "Workflow Inbox", v: "Enabled" },
                { l: "AI Copilot Access", v: "Full" },
                { l: "Audit Trail", v: "Immutable" },
              ].map((s) => (
                <div key={s.l} className="rounded-md border border-border bg-card p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.l}</div>
                  <div className="text-sm font-semibold mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </ModulePage>
  );
}
