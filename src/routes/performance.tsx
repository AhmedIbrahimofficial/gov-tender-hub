import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Vendor Performance — National Procurement Platform" }, { name: "description", content: "Continuous vendor performance scoring across delivery, quality, compliance, and responsiveness." }] }),
  component: () => (
    <ModulePage phase="Phase 22" title="Vendor Performance Management" description="Continuous performance evaluation per contract and aggregated supplier scorecards across all government entities.">
      <FeatureGrid features={[
        { title: "Delivery Score", desc: "On-time delivery, partial delivery, lead-time variance per line item." },
        { title: "Quality Score", desc: "Inspection results, defect rates, returns, warranty claims." },
        { title: "Compliance Score", desc: "Documentation completeness, tax clearance currency, statutory compliance." },
        { title: "Responsiveness", desc: "Query response times, issue resolution, dispute frequency." },
        { title: "Aggregate Rating", desc: "Cross-entity supplier scorecard influencing pre-qualification and shortlisting." },
        { title: "Performance Sanctions", desc: "Warning letters, performance improvement plans, suspension, blacklist escalation." },
      ]} />
    </ModulePage>
  ),
});
