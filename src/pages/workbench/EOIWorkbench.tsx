import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function EOIWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "eoi", label: "EOI Management", stageNumber: 8, procurementType: "EOI", allModules: PROCUREMENT_MODULES }}
      title="EOI Management Workbench"
      subtitle="Stage 8 of 26 — Expression of Interest, shortlisting, notification"
    />
  );
}
