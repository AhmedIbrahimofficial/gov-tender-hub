import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ContractAwardWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "contract-award", label: "Contract Award", stageNumber: 14, allModules: PROCUREMENT_MODULES }}
      title="Contract Award Workbench"
      subtitle="Stage 14 of 26 — Award notice, standstill period, objections management"
    />
  );
}
