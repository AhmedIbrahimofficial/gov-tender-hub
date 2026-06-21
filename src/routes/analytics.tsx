import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics & BI — National Procurement Platform" }, { name: "description", content: "National procurement analytics, spend intelligence, supplier insights, and executive BI." }] }),
  component: () => (
    <ModulePage title="Analytics & Business Intelligence" description="Executive analytics across spend, savings, suppliers, contracts, projects, compliance, and risk — drillable from national level down to individual transaction.">
      <FeatureGrid features={[
        { title: "Spend Analytics", desc: "By entity, category, province, supplier, time. Drill-down from USD billions to single invoice." },
        { title: "Contract Analytics", desc: "Portfolio risk, variation patterns, milestone health, supplier-level concentration." },
        { title: "Supplier Analytics", desc: "Performance distribution, market concentration, dependency risk, SME participation." },
        { title: "Project Analytics", desc: "Delivery vs plan, budget vs actual, milestone slippage, project portfolio health." },
        { title: "Compliance Analytics", desc: "Policy adherence, exception rates, audit-finding trends, AML / sanctions screening." },
        { title: "Executive BI", desc: "National command dashboards, ministerial briefing packs, automated cabinet reports." },
      ]} />
    </ModulePage>
  ),
});
