import EnterpriseWorkbench, { PROCUREMENT_MODULES } from "@/components/EnterpriseWorkbench";
export default function PaymentManagementWorkbench() {
  return (
    <EnterpriseWorkbench
      module={{ id: "payment-management", label: "Payment Management", stageNumber: 18, allModules: PROCUREMENT_MODULES }}
      title="Payment Management Workbench"
      subtitle="Stage 18 of 26 — Invoicing, 3-way match, EFT authorisation, IFMIS"
    />
  );
}
