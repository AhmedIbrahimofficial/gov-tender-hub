import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { seedIfEmpty } from "@/lib/local-store";
import CPODashboard from "./CPODashboard";
import ProcurementOfficerDashboard from "./ProcurementOfficerDashboard";
import EvaluatorDashboard from "./EvaluatorDashboard";
import FinanceDashboard from "./FinanceDashboard";
import AuditorDashboard from "./AuditorDashboard";
import SupplierDashboard from "./SupplierDashboard";
import MinisterDashboard from "./MinisterDashboard";
import CommandCenter from "./CommandCenter";

export default function DashboardRouter() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) seedIfEmpty(user.name);
  }, [user]);

  switch (user?.role) {
    case "cpo":                return <CPODashboard />;
    case "procurement_officer":return <ProcurementOfficerDashboard />;
    case "evaluator":          return <EvaluatorDashboard />;
    case "finance_officer":    return <FinanceDashboard />;
    case "auditor":            return <AuditorDashboard />;
    case "minister":           return <MinisterDashboard />;
    case "supplier":           return <SupplierDashboard />;
    default:                   return <CommandCenter />;
  }
}
