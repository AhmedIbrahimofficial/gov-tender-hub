import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";

export default function ProcurementPlanningWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "planning", label: "Procurement Planning", stageNumber: 1, allModules: PROCUREMENT_MODULES }}
      title="Procurement Planning Workbench"
      subtitle="Stage 1 of 26 — Annual procurement plan, budget allocation, demand forecasting"
    />
  );
}
