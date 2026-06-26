import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function AuctionWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "auction", label: "Auction Management", stageNumber: 9, procurementType: "Auction", allModules: PROCUREMENT_MODULES }}
      title="Auction Management Workbench"
      subtitle="Stage 9 of 26 — Asset auctions, live bidding, award, handover"
    />
  );
}
