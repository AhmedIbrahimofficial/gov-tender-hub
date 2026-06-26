import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function AssetManagementWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "asset-management", label: "Asset Management", stageNumber: 20, allModules: PROCUREMENT_MODULES }}
      title="Asset Management Workbench"
      subtitle="Stage 20 of 26 — Asset registration, maintenance scheduling, disposal"
    />
  );
}
