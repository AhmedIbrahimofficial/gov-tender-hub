import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Invoices & Payments — National Procurement Platform" }, { name: "description", content: "Three-way matching, invoice processing, treasury payment workflows, and supplier payment tracking." }] }),
  component: () => (
    <ModulePage phase="Phases 20 – 21" title="Invoice & Payment Management" description="From invoice submission to treasury disbursement: three-way matching, statutory deductions, tax withholding, and supplier payment tracking.">
      <FeatureGrid features={[
        { title: "Invoice Submission", desc: "Supplier portal e-invoicing, ZIMRA fiscal compliance, automatic PO matching." },
        { title: "Three-Way Matching", desc: "Automatic match of PO, GRN, and invoice with exception routing." },
        { title: "Tax & Statutory Deductions", desc: "Withholding tax, VAT handling, IMTT, and NSSA where applicable." },
        { title: "Payment Authorization", desc: "Multi-tier approval, accounting officer sign-off, treasury authorization." },
        { title: "Treasury Disbursement", desc: "Integration with PFMS / RBZ payment rails, batch payments, payment proofs." },
        { title: "Supplier Payment Tracking", desc: "Real-time payment status visible to suppliers via portal — citizen transparency on ageing payables." },
      ]} />
    </ModulePage>
  ),
});
