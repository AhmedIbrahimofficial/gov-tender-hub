import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function RFPWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "rfp", label: "RFP Management", stageNumber: 7, procurementType: "RFP", allModules: PROCUREMENT_MODULES }}
      title="RFP Management Workbench"
      subtitle="Stage 7 of 26 — Request for Proposals, TOR, evaluation, negotiation"
    />
  );
}
