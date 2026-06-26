import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function BidEvaluationWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "bid-evaluation", label: "Bid Evaluation", stageNumber: 12, allModules: PROCUREMENT_MODULES }}
      title="Bid Evaluation Workbench"
      subtitle="Stage 12 of 26 — Administrative, technical, financial scoring"
    />
  );
}
