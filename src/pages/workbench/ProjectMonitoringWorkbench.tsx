import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function ProjectMonitoringWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "project-monitoring", label: "Project Monitoring", stageNumber: 17, allModules: PROCUREMENT_MODULES }}
      title="Project Monitoring Workbench"
      subtitle="Stage 17 of 26 — Milestone tracking, KPIs, site visits, delivery acceptance"
    />
  );
}
