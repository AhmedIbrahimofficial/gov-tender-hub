import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function AIAnalyticsWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "ai-analytics", label: "AI Analytics", stageNumber: 26, allModules: PROCUREMENT_MODULES }}
      title="AI Analytics Workbench"
      subtitle="Stage 26 of 26 — Predictive insights, anomaly detection, executive intelligence"
    />
  );
}
