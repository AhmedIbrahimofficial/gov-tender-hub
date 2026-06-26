import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function AppealsWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "appeals", label: "Appeals", stageNumber: 23, allModules: PROCUREMENT_MODULES }}
      title="Appeals Workbench"
      subtitle="Stage 23 of 26 — Objections, administrative review, decision notices"
    />
  );
}
