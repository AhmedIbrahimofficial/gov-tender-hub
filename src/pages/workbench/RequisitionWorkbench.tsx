import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function RequisitionWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "requisition", label: "Requisition", stageNumber: 2, allModules: PROCUREMENT_MODULES }}
      title="Procurement Requisition Workbench"
      subtitle="Stage 2 of 26 — Purchase requisition, line items, departmental approval"
    />
  );
}
