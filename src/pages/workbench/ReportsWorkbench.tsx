import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ReportsWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "reports", label: "Reports", stageNumber: 25, allModules: PROCUREMENT_MODULES }}
      title="Reports Workbench"
      subtitle="Stage 25 of 26 — Statutory reports, management dashboards, executive briefs"
    />
  );
}
