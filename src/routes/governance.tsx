import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/governance")({
  head: () => ({ meta: [{ title: "Governance & Master Data — National Procurement Platform" }, { name: "description", content: "Organization, departments, projects, funding sources, cost centres, approval and delegation matrices, policy repository." }] }),
  component: () => (
    <ModulePage phase="Phase 0" title="Governance & Master Data" description="Foundational configuration for the entire platform: organizations, departments, projects, funding sources, cost centres, approval and delegation matrices, committees, and the national policy repository.">
      <FeatureGrid features={[
        { title: "Organization Setup", desc: "Ministries, departments, agencies, state enterprises, local authorities — full national hierarchy." },
        { title: "Projects & Funding Sources", desc: "Capital projects, donor-funded projects, treasury, grants, loans — linked to budget lines." },
        { title: "Cost Centres & Business Units", desc: "Granular financial structure for spend control and reporting." },
        { title: "Approval Matrix", desc: "Threshold-based approvals by value, category, and method — configurable per entity." },
        { title: "Delegation Matrix", desc: "Acting roles, delegation of authority, leave coverage, temporary assignments." },
        { title: "Policy Repository", desc: "PPDPA Act, regulations, treasury instructions, entity SOPs — version-controlled and searchable." },
        { title: "Committee Management", desc: "Evaluation, adjudication, and special committees with conflict of interest tracking." },
        { title: "AI Policy Advisor", desc: "Natural-language Q&A across all procurement law and policy with cited sources." },
        { title: "Master Data Governance", desc: "Vendor master, item catalog, UNSPSC categories, units of measure with stewardship workflows." },
      ]} />
    </ModulePage>
  ),
});
