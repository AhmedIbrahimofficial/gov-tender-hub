import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { seedIfEmpty } from "@/lib/local-store";
import { Navigate } from "react-router-dom";

// Custom full dashboards
import CPODashboard from "./CPODashboard";
import ProcurementOfficerDashboard from "./ProcurementOfficerDashboard";
import EvaluatorDashboard from "./EvaluatorDashboard";
import FinanceDashboard from "./FinanceDashboard";
import AuditorDashboard from "./AuditorDashboard";
import SupplierDashboard from "./SupplierDashboard";
import MinisterDashboard from "./MinisterDashboard";
import PresidentDashboard from "./PresidentDashboard";
import ChiefExecutiveDashboard from "./ChiefExecutiveDashboard";

// Universal dashboard for all remaining roles
import UniversalRoleDashboard from "./UniversalRoleDashboard";

export default function DashboardRouter() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) seedIfEmpty(user.name);
  }, [user]);

  switch (user?.role) {
    case "public":
      return <Navigate to="/supplier-portal" replace />;

    case "president":
      return <PresidentDashboard />;

    case "chief_executive":
      return <ChiefExecutiveDashboard />;

    case "cpo":
      return <CPODashboard />;

    case "procurement_officer":
      return <ProcurementOfficerDashboard />;

    case "evaluator":
      return <EvaluatorDashboard />;

    case "finance_officer":
      return <FinanceDashboard />;

    case "auditor":
      return <AuditorDashboard />;

    case "minister":
      return <MinisterDashboard />;

    case "supplier":
    case "sme_supplier":
    case "vendor_user":
      return <SupplierDashboard />;

    // All other roles → Universal dashboard
    default:
      return <UniversalRoleDashboard />;
  }
}
