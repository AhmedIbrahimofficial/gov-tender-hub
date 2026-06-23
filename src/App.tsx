import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import DashboardRouter from "./pages/DashboardRouter";
import SupplierPortalPage from "./pages/SupplierPortalPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AiAgentsPage from "./pages/AiAgentsPage";
import PlanningPage from "./pages/PlanningPage";
import TendersPage from "./pages/TendersPage";
import TenderLifecyclePage from "./pages/TenderLifecyclePage";
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
import OrganisationsPage from "./pages/OrganisationsPage";
import NotFound from "./pages/NotFound";

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
      <Route path="/budget/centres"     element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/formulation" element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/execution"   element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/commitments" element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/expenditure" element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/revenue"     element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/treasury"    element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/fraud"       element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />
      <Route path="/budget/ai-agents"   element={<ProtectedRoute><BudgetManagementPage /></ProtectedRoute>} />

      {/* Organisation Registration & Mapping */}
      <Route path="/organisations" element={<ProtectedRoute><OrganisationsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
