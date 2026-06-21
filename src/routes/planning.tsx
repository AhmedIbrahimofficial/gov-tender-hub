import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/planning")({
  head: () => ({ meta: [{ title: "Procurement Planning & Demand — National Procurement Platform" }, { name: "description", content: "Annual, quarterly, project, and department procurement planning with AI demand forecasting." }] }),
  component: () => (
    <ModulePage phase="Phase 1" title="Procurement Planning & Demand Management" description="Procurement requisitions, budget validation, AI demand forecasting, annual / quarterly / project / department plans with funding validation and approval workflows.">
      <FeatureGrid features={[
        { title: "Procurement Requisition", desc: "Structured PR creation with item catalog, specifications, budget linkage, and approver routing." },
        { title: "Budget Validation", desc: "Real-time check against vote, fund, cost centre and project balance before commitment." },
        { title: "AI Demand Forecasting", desc: "Historical consumption, seasonality, and project pipeline to predict 12–24 month demand by category." },
        { title: "Annual Procurement Plan", desc: "Consolidated APP per entity, published to citizens, regulator-ready format." },
        { title: "Quarterly & Project Plans", desc: "Rolling planning cadence with variance tracking against the APP." },
        { title: "Funding Validation", desc: "Funding source (treasury, donor, grant, loan) verification with controls per source." },
      ]} />
    </ModulePage>
  ),
});
