import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function GovernanceWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "governance", label: "Governance", stageNumber: 22, allModules: PROCUREMENT_MODULES }}
      title="Governance Workbench"
      subtitle="Stage 22 of 26 — Procurement committees, policy compliance, ethics"
    />
  );
}
