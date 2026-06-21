import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/awards")({
  head: () => ({ meta: [{ title: "Awards & Appeals — National Procurement Platform" }, { name: "description", content: "Award approval, publication, supplier notifications, and appeals tribunal workflow." }] }),
  component: () => (
    <ModulePage phase="Phases 15 – 17" title="Awards & Appeals Management" description="Due diligence, award approval, award notification, and full electronic appeals lifecycle aligned with the Public Procurement and Disposal of Public Assets Act.">
      <FeatureGrid features={[
        { title: "Due Diligence (Phase 15)", desc: "Background checks, financial revalidation, site visits, capacity verification before award." },
        { title: "Award Approval (Phase 16)", desc: "Multi-tier approval, adjudication committee, accounting officer authorization, PRAZ notification where required." },
        { title: "Award Notification (Phase 17)", desc: "Successful and unsuccessful bidder notifications with reasons, standstill period management." },
        { title: "Appeals Submission", desc: "Aggrieved bidder e-submission with grounds, evidence, and fee handling." },
        { title: "Appeals Tribunal Workflow", desc: "Independent review, hearing scheduling, decision publication, remedy execution." },
        { title: "Audit Trail", desc: "Immutable trail of every decision, approval, override, and AI recommendation." },
      ]} />
    </ModulePage>
  ),
});
