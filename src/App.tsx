import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import DashboardRouter from "./pages/DashboardRouter";
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
