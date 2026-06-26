import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ContractExecutionWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "contract-execution", label: "Contract Execution", stageNumber: 15, allModules: PROCUREMENT_MODULES }}
      title="Contract Execution Workbench"
      subtitle="Stage 15 of 26 — Drafting, signing, performance bond, commencement"
    />
  );
}
