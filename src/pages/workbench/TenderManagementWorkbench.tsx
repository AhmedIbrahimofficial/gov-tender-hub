import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function TenderManagementWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "tender-management", label: "Tender Management", stageNumber: 5, allModules: PROCUREMENT_MODULES }}
      title="Tender Management Workbench"
      subtitle="Stage 5 of 26 — Publication, clarifications, Q&A, addenda"
    />
  );
}
