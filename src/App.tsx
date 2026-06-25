import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { MinistryProvider } from "./lib/ministry-context";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import DashboardRouter from "./pages/DashboardRouter";
import SupplierPortalPage from "./pages/SupplierPortalPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AiAgentsPage from "./pages/AiAgentsPage";
import PlanningPage from "./pages/PlanningPage";
import TendersPage from "./pages/TendersPage";
import TenderLifecyclePage from "./pages/TenderLifecyclePage";
import ProcurementLifecyclePage from "./pages/ProcurementLifecyclePage";
import RFQPage from "./pages/RFQPage";
import RFPEOIPage from "./pages/RFPEOIPage";
import AuctionsPage from "./pages/AuctionsPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import AwardsPage from "./pages/AwardsPage";
import VendorsPage from "./pages/VendorsPage";
import ContractsPage from "./pages/ContractsPage";
import PerformancePage from "./pages/PerformancePage";
import FinancePage from "./pages/FinancePage";
import AuditPage from "./pages/AuditPage";
import AntiCorruptionPage from "./pages/AntiCorruptionPage";
import GovernancePage from "./pages/GovernancePage";
import RolesPage from "./pages/RolesPage";
import PortalPage from "./pages/PortalPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import AssetMaintenancePage from "./pages/AssetMaintenancePage";
import AssetFinancialsPage from "./pages/AssetFinancialsPage";
import AssetDisposalPage from "./pages/AssetDisposalPage";
import InventoryPage from "./pages/InventoryPage";
import BIDashboardPage from "./pages/BIDashboardPage";
import UtilityPage from "./pages/UtilityPage";
import TeamsPage from "./pages/TeamsPage";
import StaffProductivityPage from "./pages/StaffProductivityPage";
import DepartmentActivitiesPage from "./pages/DepartmentActivitiesPage";
import BudgetManagementPage from "./pages/BudgetManagementPage";
import BudgetCentresPage from "./pages/budget/BudgetCentresPage";
import BudgetFormulationPage from "./pages/budget/BudgetFormulationPage";
import BudgetExecutionPage from "./pages/budget/BudgetExecutionPage";
import CommitmentsPage from "./pages/budget/CommitmentsPage";
import ExpenditurePage from "./pages/budget/ExpenditurePage";
import RevenuePage from "./pages/budget/RevenuePage";
import TreasuryPage from "./pages/budget/TreasuryPage";
import FraudDetectionPage from "./pages/budget/FraudDetectionPage";
import MinistryDashboardPage from "./pages/MinistryDashboardPage";
import DepartmentDashboardPage from "./pages/DepartmentDashboardPage";
import OrganisationsPage from "./pages/OrganisationsPage";
import CertificatesPage from "./pages/CertificatesPage";
import CorporatePage from "./pages/CorporatePage";
import CorporateDepartmentPage from "./pages/CorporateDepartmentPage";
import WorkstationDetailPage from "./pages/WorkstationDetailPage";
import NotFound from "./pages/NotFound";
import DrillDownPage from "./pages/DrillDownPage";
import TenderDetailPage from "./pages/TenderDetailPage";
import TenderStagePage from "./pages/TenderStagePage";
import PrimeEntityDashboard from "./pages/PrimeEntityDashboard";
import PresidentDashboard from "./pages/PresidentDashboard";
import PrimeMinisterDashboard from "./pages/PrimeMinisterDashboard";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import ProcurementWorkbenchPage from "./pages/ProcurementWorkbenchPage";
import MinistryWorkbenchPage from "./pages/MinistryWorkbenchPage";
import SeniorDashboardPage from "./pages/SeniorDashboardPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/portal" element={<PortalPage />} />

      {/* Supplier Portal (public users) */}
      <Route path="/supplier-portal" element={<ProtectedRoute><SupplierPortalPage /></ProtectedRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/ai-agents" element={<ProtectedRoute><AiAgentsPage /></ProtectedRoute>} />
      <Route path="/planning" element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />

      {/* Procurement Workbench — global */}
      <Route path="/workbench" element={<ProtectedRoute><ProcurementWorkbenchPage /></ProtectedRoute>} />
      {/* Per-ministry Procurement Workbench */}
      <Route path="/workbench/:ministryId" element={<ProtectedRoute><MinistryWorkbenchPage /></ProtectedRoute>} />

      {/* Procurement Lifecycle Control Tower */}
      <Route path="/lifecycle" element={<ProtectedRoute><ProcurementLifecyclePage /></ProtectedRoute>} />

      {/* 4 Procurement Pillars */}
      <Route path="/tenders-lifecycle" element={<ProtectedRoute><TenderLifecyclePage /></ProtectedRoute>} />
      <Route path="/rfq" element={<ProtectedRoute><RFQPage /></ProtectedRoute>} />
      <Route path="/rfp-eoi" element={<ProtectedRoute><RFPEOIPage /></ProtectedRoute>} />
      <Route path="/auctions" element={<ProtectedRoute><AuctionsPage /></ProtectedRoute>} />

      {/* Existing modules */}
      <Route path="/tenders" element={<ProtectedRoute><TendersPage /></ProtectedRoute>} />
      <Route path="/evaluations" element={<ProtectedRoute><EvaluationsPage /></ProtectedRoute>} />
      <Route path="/awards" element={<ProtectedRoute><AwardsPage /></ProtectedRoute>} />
      <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute><ContractsPage /></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute><AuditPage /></ProtectedRoute>} />
      <Route path="/anti-corruption" element={<ProtectedRoute><AntiCorruptionPage /></ProtectedRoute>} />
      <Route path="/governance" element={<ProtectedRoute><GovernancePage /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />

      {/* Asset Management */}
      <Route path="/assets" element={<ProtectedRoute><AssetManagementPage /></ProtectedRoute>} />
      <Route path="/assets/maintenance" element={<ProtectedRoute><AssetMaintenancePage /></ProtectedRoute>} />
      <Route path="/assets/financials" element={<ProtectedRoute><AssetFinancialsPage /></ProtectedRoute>} />
      <Route path="/assets/disposal" element={<ProtectedRoute><AssetDisposalPage /></ProtectedRoute>} />

      {/* Inventory & Warehouse Management */}
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/items" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/receiving" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/requests" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/warehouse" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/stock-count" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/reconciliation" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/ai-agents" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />

      {/* Business Intelligence */}
      <Route path="/bi-dashboards" element={<ProtectedRoute><BIDashboardPage /></ProtectedRoute>} />
      <Route path="/bi-dashboards/drill/:category/:value" element={<ProtectedRoute><DrillDownPage /></ProtectedRoute>} />

      {/* Tender Detail & Stages */}
      <Route path="/tenders/:id" element={<ProtectedRoute><TenderDetailPage /></ProtectedRoute>} />
      <Route path="/tenders/:id/stage/:stage" element={<ProtectedRoute><TenderStagePage /></ProtectedRoute>} />

      {/* Ministry & Department Dashboards */}
      <Route path="/ministry/:ministryId/dashboard" element={<ProtectedRoute><MinistryDashboardPage /></ProtectedRoute>} />
      <Route path="/ministry/:ministryId/department/:deptId" element={<ProtectedRoute><DepartmentDashboardPage /></ProtectedRoute>} />
      {/* Senior Officer Dashboard */}
      <Route path="/ministry/:ministryId/senior/:officerIdx" element={<ProtectedRoute><SeniorDashboardPage /></ProtectedRoute>} />

      {/* Prime Entity Super Admin */}
      <Route path="/prime-entity" element={<ProtectedRoute><PrimeEntityDashboard /></ProtectedRoute>} />

      {/* Office of the President — global super-executive */}
      <Route path="/president"      element={<ProtectedRoute><PresidentDashboard /></ProtectedRoute>} />

      {/* Office of the Prime Minister */}
      <Route path="/prime-minister" element={<ProtectedRoute><PrimeMinisterDashboard /></ProtectedRoute>} />

      {/* Project Management Tower — unified module */}
      <Route path="/projects"             element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/portfolio"   element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/planning"    element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/schedule"    element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/costs"       element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/risks"       element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/quality"     element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/resources"   element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/contractors" element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/documents"   element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
      <Route path="/projects/ai-tower"    element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />

      {/* Utility Services */}
      <Route path="/utility" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/catalogue" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/communications" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/gazette" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/announcements" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/public-records" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />
      <Route path="/utility/media" element={<ProtectedRoute><UtilityPage /></ProtectedRoute>} />

      {/* Teams & Collaboration */}
      <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />

      {/* Staff Productivity & Performance */}
      <Route path="/staff-productivity" element={<ProtectedRoute><StaffProductivityPage /></ProtectedRoute>} />

      {/* Department Activities Workbench */}
      <Route path="/department-activities" element={<ProtectedRoute><DepartmentActivitiesPage /></ProtectedRoute>} />

      {/* Budget Management */}
      <Route path="/budget"             element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/centres"     element={<ProtectedRoute><BudgetCentresPage /></ProtectedRoute>} />
      <Route path="/budget/formulation" element={<ProtectedRoute><BudgetFormulationPage /></ProtectedRoute>} />
      <Route path="/budget/execution"   element={<ProtectedRoute><BudgetExecutionPage /></ProtectedRoute>} />
      <Route path="/budget/commitments" element={<ProtectedRoute><CommitmentsPage /></ProtectedRoute>} />
      <Route path="/budget/expenditure" element={<ProtectedRoute><ExpenditurePage /></ProtectedRoute>} />
      <Route path="/budget/revenue"     element={<ProtectedRoute><RevenuePage /></ProtectedRoute>} />
      <Route path="/budget/treasury"    element={<ProtectedRoute><TreasuryPage /></ProtectedRoute>} />
      <Route path="/budget/fraud"       element={<ProtectedRoute><FraudDetectionPage /></ProtectedRoute>} />
      <Route path="/budget/ai-agents"   element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />

      {/* Organisation Registration & Mapping */}
      <Route path="/organisations" element={<ProtectedRoute><OrganisationsPage /></ProtectedRoute>} />

      {/* Certificates, Notices & Acknowledgements */}
      <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />

      {/* Corporate Module */}
      <Route path="/corporate" element={<ProtectedRoute><CorporatePage /></ProtectedRoute>} />
      <Route path="/corporate/:deptId" element={<ProtectedRoute><CorporateDepartmentPage /></ProtectedRoute>} />
      <Route path="/corporate/:deptId/workstation/:wsId" element={<ProtectedRoute><WorkstationDetailPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MinistryProvider>
        <AppRoutes />
      </MinistryProvider>
    </AuthProvider>
  );
}
