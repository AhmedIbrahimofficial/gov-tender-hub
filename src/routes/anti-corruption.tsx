import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/anti-corruption")({
  head: () => ({ meta: [{ title: "Anti-Corruption Module — National Procurement Platform" }, { name: "description", content: "AI-powered fraud detection, conflict of interest screening, whistleblower channel, and beneficial ownership disclosure." }] }),
  component: () => (
    <ModulePage title="Anti-Corruption Command" description="AI-driven detection of corruption red flags across the entire procurement lifecycle, with secure whistleblower channels and integration to the Zimbabwe Anti-Corruption Commission.">
      <FeatureGrid features={[
        { title: "Fraud Pattern Detection", desc: "Repeat winners, bid rotation, identical bids, abnormally low or high bids, last-minute specification changes." },
        { title: "Conflict of Interest Screening", desc: "Cross-check officers, evaluators, and approvers against vendor directors and beneficial owners." },
        { title: "Beneficial Ownership Registry", desc: "Mandatory disclosure of UBOs; matched against politically exposed person lists." },
        { title: "Whistleblower Portal", desc: "Encrypted, anonymous channel with case management and protection guarantees." },
        { title: "Sanction & PEP Screening", desc: "OFAC, UN, EU, and PRAZ blacklist screening on every vendor and transaction." },
        { title: "ZACC Integration", desc: "Secure case referral and evidence package generation for the Zimbabwe Anti-Corruption Commission." },
      ]} />
    </ModulePage>
  ),
});
