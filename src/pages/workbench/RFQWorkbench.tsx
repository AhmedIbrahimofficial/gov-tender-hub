import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function RFQWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "rfq", label: "RFQ Management", stageNumber: 6, procurementType: "RFQ", allModules: PROCUREMENT_MODULES }}
      title="RFQ Management Workbench"
      subtitle="Stage 6 of 26 — Request for Quotation, evaluation, award"
    />
  );
}
