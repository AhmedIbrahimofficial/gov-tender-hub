import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function RecommendationWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "recommendation", label: "Recommendation for Award", stageNumber: 13, allModules: PROCUREMENT_MODULES }}
      title="Recommendation for Award Workbench"
      subtitle="Stage 13 of 26 — Adjudication board, award justification, report"
    />
  );
}
