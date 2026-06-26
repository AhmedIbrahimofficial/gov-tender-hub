import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function AuditWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "audit", label: "Audit", stageNumber: 24, allModules: PROCUREMENT_MODULES }}
      title="Audit Workbench"
      subtitle="Stage 24 of 26 — Internal audit, external audit, findings, remediation"
    />
  );
}
