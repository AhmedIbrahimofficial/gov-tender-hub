import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { seedIfEmpty } from "@/lib/local-store";
import { Navigate } from "react-router-dom";

// Full custom dashboards
import CPODashboard from "./CPODashboard";
import ProcurementOfficerDashboard from "./ProcurementOfficerDashboard";
import EvaluatorDashboard from "./EvaluatorDashboard";
import FinanceDashboard from "./FinanceDashboard";
import AuditorDashboard from "./AuditorDashboard";
import SupplierDashboard from "./SupplierDashboard";
import MinisterDashboard from "./MinisterDashboard";
import PresidentDashboard from "./PresidentDashboard";
import ChiefExecutiveDashboard from "./ChiefExecutiveDashboard";

// Universal role-specific dashboard (handles all other roles with unique configs)
import UniversalRoleDashboard from "./UniversalRoleDashboard";

export default function DashboardRouter() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) seedIfEmpty(user.name);
  }, [user]);

  switch (user?.role) {
    // ── Public supplier portal ──────────────────────────────────────────────
    case "public":
      return <Navigate to="/supplier-portal" replace />;

    // ── Head of State ───────────────────────────────────────────────────────
    case "president":
      return <PresidentDashboard />;

    // ── Chief Executive ─────────────────────────────────────────────────────
    case "chief_executive":
      return <ChiefExecutiveDashboard />;

    // ── Procurement leadership ──────────────────────────────────────────────
    case "cpo":
      return <CPODashboard />;
    case "procurement_officer":
      return <ProcurementOfficerDashboard />;
    case "evaluator":
      return <EvaluatorDashboard />;

    // ── Finance ─────────────────────────────────────────────────────────────
    case "finance_officer":
      return <FinanceDashboard />;

    // ── Oversight ───────────────────────────────────────────────────────────
    case "auditor":
      return <AuditorDashboard />;

    // ── Executive ───────────────────────────────────────────────────────────
    case "minister":
      return <MinisterDashboard />;

    // ── Suppliers ───────────────────────────────────────────────────────────
    case "supplier":
    case "sme_supplier":
    case "vendor_user":
      return <SupplierDashboard />;

    // ── All other roles → unique role-specific dashboard ────────────────────
    default:
      return <UniversalRoleDashboard />;
  }
}
