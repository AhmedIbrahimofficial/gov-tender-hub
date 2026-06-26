import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function StrategyWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "strategy", label: "Procurement Strategy", stageNumber: 3, allModules: PROCUREMENT_MODULES }}
      title="Procurement Strategy Workbench"
      subtitle="Stage 3 of 26 — Method selection, market analysis, supplier landscape"
    />
  );
}
