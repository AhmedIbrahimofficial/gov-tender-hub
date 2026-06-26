import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ContractManagementWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "contract-management", label: "Contract Management", stageNumber: 16, allModules: PROCUREMENT_MODULES }}
      title="Contract Management Workbench"
      subtitle="Stage 16 of 26 — Variation orders, extensions, dispute resolution"
    />
  );
}
