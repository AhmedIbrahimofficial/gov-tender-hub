import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function BidSubmissionWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "bid-submission", label: "Bid Submission", stageNumber: 10, allModules: PROCUREMENT_MODULES }}
      title="Bid Submission Workbench"
      subtitle="Stage 10 of 26 — Encrypted vault, bid validation, receipt management"
    />
  );
}
