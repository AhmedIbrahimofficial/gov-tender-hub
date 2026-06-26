import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ContractClosureWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "contract-closure", label: "Contract Closure", stageNumber: 19, allModules: PROCUREMENT_MODULES }}
      title="Contract Closure Workbench"
      subtitle="Stage 19 of 26 — Final account, practical completion, archiving"
    />
  );
}
