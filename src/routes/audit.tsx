import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit & Compliance — National Procurement Platform" }, { name: "description", content: "Continuous audit, compliance monitoring, exception management, and audit-ready reporting." }] }),
  component: () => (
    <ModulePage phase="Phase 23" title="Audit & Compliance" description="Continuous-audit engine, real-time policy adherence monitoring, exception management, and audit-ready trails for the Office of the Auditor-General and PRAZ.">
      <FeatureGrid features={[
        { title: "Immutable Audit Trail", desc: "Every event, decision, override, AI action, and document version cryptographically hashed." },
        { title: "Continuous Audit Engine", desc: "Rules engine evaluates every transaction against PPDPA, Treasury Instructions, and entity policies." },
        { title: "Exception Management", desc: "Auto-routed exception queues with root-cause analysis and corrective-action tracking." },
        { title: "Auditor Workspace", desc: "Dedicated workspace for OAG and internal auditors with read-only access, sampling tools, and working papers." },
        { title: "Compliance Dashboards", desc: "Entity-level compliance scoring, peer benchmarking, trend analysis." },
        { title: "Regulatory Reporting", desc: "Pre-built PRAZ, OAG, Parliament, and donor-ready reports." },
      ]} />
    </ModulePage>
  ),
});
