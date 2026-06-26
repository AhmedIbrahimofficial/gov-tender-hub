import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function BidOpeningWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "bid-opening", label: "Bid Opening", stageNumber: 11, allModules: PROCUREMENT_MODULES }}
      title="Bid Opening Workbench"
      subtitle="Stage 11 of 26 — Opening ceremony, opening register, public records"
    />
  );
}
