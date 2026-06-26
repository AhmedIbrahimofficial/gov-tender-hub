import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function TenderPreparationWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "tender-preparation", label: "Tender Preparation", stageNumber: 4, allModules: PROCUREMENT_MODULES }}
      title="Tender Preparation Workbench"
      subtitle="Stage 4 of 26 — BOQ, specifications, evaluation criteria, approvals"
    />
  );
}
