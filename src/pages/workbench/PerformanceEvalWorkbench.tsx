import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function PerformanceEvalWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "performance-eval", label: "Performance Evaluation", stageNumber: 21, allModules: PROCUREMENT_MODULES }}
      title="Performance Evaluation Workbench"
      subtitle="Stage 21 of 26 — Vendor KPI scoring, performance review, vendor registry"
    />
  );
}
