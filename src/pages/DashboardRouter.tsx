import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { seedIfEmpty } from "@/lib/local-store";
import { Navigate } from "react-router-dom";

// Existing full dashboards
import CPODashboard from "./CPODashboard";
import ProcurementOfficerDashboard from "./ProcurementOfficerDashboard";
import EvaluatorDashboard from "./EvaluatorDashboard";
import FinanceDashboard from "./FinanceDashboard";
import AuditorDashboard from "./AuditorDashboard";
import SupplierDashboard from "./SupplierDashboard";
import MinisterDashboard from "./MinisterDashboard";
import CommandCenter from "./CommandCenter";
import PresidentDashboard from "./PresidentDashboard";

// Role-specific dashboards
import {
  ContractManagerDashboard,
  ComplianceOfficerDashboard,
  LegalOfficerDashboard,
  StoresOfficerDashboard,
  BudgetOfficerDashboard,
  PlanningOfficerDashboard,
  RiskOfficerDashboard,
  ProjectManagerDashboard,
  AntiCorruptionOfficerDashboard,
  PerformanceOfficerDashboard,
  ITOfficerDashboard,
  GenericRoleDashboard,
} from "./RoleDashboards";

import {
  FileText, Shield, DollarSign, Users, BarChart3, Search,
  Gavel, Globe2, Archive, Activity, Leaf, Heart, Star,
  Package, BookOpen, Settings, Wrench, Eye, CheckCircle2, AlertTriangle,
} from "lucide-react";

export default function DashboardRouter() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) seedIfEmpty(user.name);
  }, [user]);

  switch (user?.role) {
    // ── Public portal ───────────────────────────────────────────────────────
    case "public":
      return <Navigate to="/supplier-portal" replace />;

    // ── Full custom dashboards ───────────────────────────────────────────────
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

    // ── Role-specific dashboards ─────────────────────────────────────────────
    case "contract_manager":
    case "contract_officer":
      return <ContractManagerDashboard />;
    case "compliance_officer":
      return <ComplianceOfficerDashboard />;
    case "legal_officer":
      return <LegalOfficerDashboard />;
    case "stores_officer":
      return <StoresOfficerDashboard />;
    case "budget_officer":
    case "treasury_officer":
      return <BudgetOfficerDashboard />;
    case "planning_officer":
      return <PlanningOfficerDashboard />;
    case "risk_officer":
      return <RiskOfficerDashboard />;
    case "project_manager":
      return <ProjectManagerDashboard />;
    case "anti_corruption_officer":
    case "ethics_officer":
      return <AntiCorruptionOfficerDashboard />;
    case "performance_officer":
      return <PerformanceOfficerDashboard />;
    case "it_officer":
    case "system_admin":
      return <ITOfficerDashboard />;

    // ── Generic focused dashboards (role-scoped features only) ───────────────
    case "adjudication_officer":
      return <GenericRoleDashboard
        roleLabel="Adjudication Officer" roleDesc="Award decisions, appeals, and adjudication committee"
        aiName="Adjudication AI" aiRole="Award recommendation analysis"
        features={[
          { icon: Gavel,       title: "Review Evaluation Reports",   desc: "Access evaluation reports submitted for adjudication. Review scoring, compliance, and AI recommendations.", action: "Review Report" },
          { icon: CheckCircle2,title: "Issue Award Recommendation",  desc: "Formally recommend contract award based on evaluated bids and committee decision.", action: "Issue Award" },
          { icon: Shield,      title: "Handle Bid Appeals",          desc: "Process formal appeals from unsuccessful bidders. Review grounds and make determination.", action: "Process Appeal" },
          { icon: FileText,    title: "Record Committee Minutes",    desc: "Document adjudication committee proceedings and decisions for audit trail.", action: "Record Minutes" },
          { icon: Eye,         title: "Conflict of Interest Check",  desc: "Verify COI declarations for all committee members before adjudication.", action: "Run COI Check" },
          { icon: BarChart3,   title: "Adjudication Report",         desc: "Generate formal adjudication report for approval authority.", action: "Generate Report" },
        ]} />;

    case "audit_officer":
    case "public_auditor":
      return <GenericRoleDashboard
        roleLabel="Audit Officer" roleDesc="Internal audit, transaction verification, compliance checks"
        aiName="Audit AI" aiRole="Audit trail analysis, anomaly detection"
        features={[
          { icon: Search,     title: "Review Audit Trail",     desc: "Access immutable logs of all procurement transactions and system events.", action: "Open Audit Trail" },
          { icon: Shield,     title: "Run Compliance Scan",    desc: "Automated scan of recent transactions against PPDPA requirements.", action: "Run Scan" },
          { icon: FileText,   title: "Raise Audit Finding",    desc: "Log and categorise audit exceptions with supporting evidence.", action: "Log Finding" },
          { icon: BarChart3,  title: "Audit Sampling",         desc: "AI-assisted random and risk-based sampling of transactions.", action: "Start Sampling" },
          { icon: Eye,        title: "Document Verification",  desc: "Verify authenticity of submitted tender and contract documents.", action: "Verify Documents" },
          { icon: Archive,    title: "Download Audit Pack",    desc: "Export audit working papers and evidence package.", action: "Export Pack" },
        ]} />;

    case "records_officer":
      return <GenericRoleDashboard
        roleLabel="Records Officer" roleDesc="Document management, archiving, and records lifecycle"
        aiName="Records AI" aiRole="Document classification, retention management"
        features={[
          { icon: Archive,    title: "Manage Document Vault",  desc: "Access and organise the secure document repository for all procurement records.", action: "Open Vault" },
          { icon: FileText,   title: "Archive Closed Tenders", desc: "Move completed tender files to long-term archive with proper metadata.", action: "Archive Files" },
          { icon: Search,     title: "Document Search",        desc: "Find any procurement document by reference, date, or entity.", action: "Search Records" },
          { icon: Shield,     title: "Access Control Review",  desc: "Review who has accessed sensitive documents in the last 30 days.", action: "Review Access" },
          { icon: BookOpen,   title: "Retention Schedule",     desc: "Manage document retention periods in line with national archives policy.", action: "View Schedule" },
          { icon: BarChart3,  title: "Records Report",         desc: "Generate records management statistics and compliance report.", action: "Generate Report" },
        ]} />;

    case "executive_director":
    case "board_member":
      return <GenericRoleDashboard
        roleLabel="Executive Director" roleDesc="Entity-level procurement oversight and governance"
        aiName="Executive AI" aiRole="Strategic oversight, performance briefings"
        features={[
          { icon: BarChart3,  title: "Entity Dashboard",       desc: "High-level KPIs for your entity's procurement — spend, compliance, active tenders.", action: "View Dashboard" },
          { icon: Shield,     title: "Approve High-Value Tenders", desc: "Review and approve tenders above your entity's threshold.", action: "Review Approvals" },
          { icon: FileText,   title: "Contract Portfolio",     desc: "Overview of all contracts your entity has in execution.", action: "View Contracts" },
          { icon: Activity,   title: "Performance Summary",    desc: "Quarterly vendor performance and procurement outcomes summary.", action: "View Summary" },
          { icon: DollarSign, title: "Budget Status",          desc: "Current budget utilisation and commitment levels for your entity.", action: "View Budget" },
          { icon: Eye,        title: "Compliance Standing",    desc: "Your entity's PPDPA compliance rating and open exceptions.", action: "Check Compliance" },
        ]} />;

    case "regulator":
      return <GenericRoleDashboard
        roleLabel="Regulator — PRAZ" roleDesc="National procurement regulation, policy enforcement"
        aiName="Regulatory AI" aiRole="Policy compliance, market monitoring"
        features={[
          { icon: Shield,     title: "National Compliance",    desc: "Monitor compliance levels across all 184 procuring entities.", action: "View Compliance" },
          { icon: Search,     title: "Investigation Requests", desc: "Review and action complaints and investigation requests from entities.", action: "Review Requests" },
          { icon: Gavel,      title: "Suspension Orders",      desc: "Manage vendor suspension and debarment proceedings.", action: "Manage Suspensions" },
          { icon: Globe2,     title: "Market Intelligence",    desc: "Price benchmarking, supplier market analysis, and competition monitoring.", action: "View Intelligence" },
          { icon: BarChart3,  title: "Regulatory Reports",     desc: "Generate national procurement performance and regulatory compliance reports.", action: "Generate Report" },
          { icon: BookOpen,   title: "Policy Management",      desc: "Manage PPDPA regulations, threshold updates, and procurement guidelines.", action: "Manage Policy" },
        ]} />;

    case "ai_governance_officer":
    case "data_analytics_officer":
      return <GenericRoleDashboard
        roleLabel="AI Governance Officer" roleDesc="AI model oversight, explainability, and governance"
        aiName="Meta AI" aiRole="AI audit and governance support"
        color="violet"
        features={[
          { icon: Activity,   title: "AI Agent Monitor",       desc: "Real-time status of all 8 AI agents — confidence scores, actions, anomalies.", action: "Monitor Agents" },
          { icon: Eye,        title: "Model Explainability",   desc: "Review AI decision trails and explainable outputs for accountability.", action: "Review Decisions" },
          { icon: Shield,     title: "Bias & Fairness Audit",  desc: "Check AI recommendations for demographic and vendor bias patterns.", action: "Run Audit" },
          { icon: Settings,   title: "Threshold Management",   desc: "Manage confidence thresholds and auto-approval limits for AI actions.", action: "Manage Thresholds" },
          { icon: BarChart3,  title: "AI Performance Report",  desc: "Monthly AI agent performance — accuracy, recall, false positives.", action: "View Report" },
          { icon: BookOpen,   title: "AI Policy Register",     desc: "Maintain the AI ethics and governance policy documentation.", action: "View Policy" },
        ]} />;

    case "qa_officer":
      return <GenericRoleDashboard
        roleLabel="Quality Assurance Officer" roleDesc="Standards compliance, quality inspections, and product testing"
        aiName="QA AI" aiRole="Quality inspection assistance"
        features={[
          { icon: CheckCircle2, title: "Inspect Deliveries",   desc: "Log quality inspection results for goods and services received.", action: "Log Inspection" },
          { icon: FileText,   title: "QA Checklists",          desc: "Access and complete quality assurance checklists per contract type.", action: "Open Checklist" },
          { icon: AlertTriangle, title: "Non-Conformances",    desc: "Log and track non-conforming goods or services with photographic evidence.", action: "Log NCR" },
          { icon: Star,       title: "Quality Ratings",        desc: "Score vendor quality performance for each delivery batch.", action: "Rate Quality" },
          { icon: Archive,    title: "Test Certificates",      desc: "Manage product test certificates and manufacturer certifications.", action: "Manage Certs" },
          { icon: BarChart3,  title: "Quality Report",         desc: "Generate quality performance report by vendor and contract.", action: "Generate Report" },
        ]} />;

    case "inspection_officer":
      return <GenericRoleDashboard
        roleLabel="Inspection Officer" roleDesc="On-site delivery inspection, GRN certification"
        aiName="Inspection AI" aiRole="Delivery verification, defect detection"
        features={[
          { icon: Search,     title: "Scheduled Inspections",  desc: "View today's delivery inspections and site visits.", action: "View Schedule" },
          { icon: CheckCircle2, title: "Certify Delivery",     desc: "Issue acceptance certificate for conforming deliveries.", action: "Certify Delivery" },
          { icon: AlertTriangle, title: "Reject & Document",   desc: "Document and formally reject non-conforming goods with evidence.", action: "Reject Delivery" },
          { icon: FileText,   title: "Inspection Reports",     desc: "Generate site inspection reports with photos and measurements.", action: "Write Report" },
          { icon: Package,    title: "Quantity Verification",  desc: "Verify delivered quantities against purchase order line items.", action: "Verify Quantities" },
          { icon: Activity,   title: "Defect Trend Analysis",  desc: "View defect trends by vendor to identify quality risks.", action: "View Trends" },
        ]} />;

    case "asset_manager":
      return <GenericRoleDashboard
        roleLabel="Asset Manager" roleDesc="Government asset register, disposal, and lifecycle"
        aiName="Asset AI" aiRole="Asset lifecycle management"
        features={[
          { icon: Archive,    title: "Asset Register",         desc: "Manage the government asset register — view, update, and audit asset records.", action: "Open Register" },
          { icon: Package,    title: "New Asset Capture",      desc: "Register newly received assets with serial numbers and valuation.", action: "Capture Asset" },
          { icon: Settings,   title: "Maintenance Schedule",   desc: "Track preventive maintenance schedules and service records.", action: "View Schedule" },
          { icon: Gavel,      title: "Disposal Management",    desc: "Manage asset disposal through auction, trade-in, or write-off.", action: "Manage Disposal" },
          { icon: Search,     title: "Asset Verification",     desc: "Conduct annual asset verification and reconciliation.", action: "Verify Assets" },
          { icon: BarChart3,  title: "Asset Report",           desc: "Generate asset valuation and lifecycle report.", action: "Generate Report" },
        ]} />;

    case "logistics_officer":
      return <GenericRoleDashboard
        roleLabel="Logistics Officer" roleDesc="Delivery coordination, dispatch, and warehousing"
        aiName="Logistics AI" aiRole="Route optimisation, delivery tracking"
        features={[
          { icon: Package,    title: "Delivery Tracker",       desc: "Track all in-transit deliveries and shipments in real time.", action: "Track Deliveries", link: "/inventory/receiving" },
          { icon: Settings,   title: "Dispatch Management",    desc: "Plan and coordinate dispatch of goods to recipient entities.", action: "Manage Dispatch", link: "/inventory/requests" },
          { icon: Archive,    title: "Warehouse Inventory",    desc: "View current warehouse stock levels, zones, and locations.", action: "View Inventory", link: "/inventory/warehouse" },
          { icon: Activity,   title: "Delivery Performance",   desc: "On-time delivery rate by vendor and contract.", action: "View Performance" },
          { icon: AlertTriangle, title: "Delivery Issues",     desc: "Log and escalate delivery delays, damages, and shortfalls.", action: "Log Issue", link: "/inventory" },
          { icon: FileText,   title: "Logistics Report",       desc: "Monthly logistics performance and cost report.", action: "Generate Report" },
        ]} />;

    case "health_safety_officer":
      return <GenericRoleDashboard
        roleLabel="Health & Safety Officer" roleDesc="HSE compliance in contracts, site safety audits"
        aiName="HSE AI" aiRole="Safety compliance, incident analysis"
        features={[
          { icon: Heart,      title: "HSE Compliance Check",   desc: "Verify HSE plan compliance for active construction and works contracts.", action: "Run Check" },
          { icon: AlertTriangle, title: "Incident Register",   desc: "Log and track workplace incidents on government project sites.", action: "Log Incident" },
          { icon: FileText,   title: "Safety Audit",           desc: "Conduct and record scheduled site safety inspections.", action: "Start Audit" },
          { icon: Shield,     title: "Contractor HSE Approval",desc: "Review and approve contractor HSE plans before works commence.", action: "Review Plan" },
          { icon: Activity,   title: "Incident Statistics",    desc: "Frequency rate, near-miss analysis, and lost-time injury trends.", action: "View Stats" },
          { icon: BarChart3,  title: "HSE Report",             desc: "Monthly health, safety, and environment compliance report.", action: "Generate Report" },
        ]} />;

    case "environment_officer":
      return <GenericRoleDashboard
        roleLabel="Environment Officer" roleDesc="Environmental impact assessments and green procurement"
        aiName="Environment AI" aiRole="EIA analysis, green procurement scoring"
        color="emerald"
        features={[
          { icon: Leaf,       title: "EIA Review",             desc: "Review Environmental Impact Assessment reports for infrastructure projects.", action: "Review EIA" },
          { icon: Shield,     title: "Green Procurement Score",desc: "Rate procurement activities against environmental criteria.", action: "Score Activity" },
          { icon: Search,     title: "Carbon Footprint",       desc: "Estimate carbon footprint for major procurement activities.", action: "Calculate Footprint" },
          { icon: FileText,   title: "Environmental Conditions", desc: "Attach environmental conditions to contract awards.", action: "Add Conditions" },
          { icon: Activity,   title: "Compliance Monitoring",  desc: "Monitor compliance with environmental conditions during execution.", action: "Monitor Compliance" },
          { icon: BarChart3,  title: "Green Report",           desc: "Quarterly green procurement performance report.", action: "Generate Report" },
        ]} />;

    case "gender_officer":
    case "citizen":
    case "end_user":
      return <GenericRoleDashboard
        roleLabel={user?.role === "citizen" ? "Citizen Observer" : user?.role === "end_user" ? "End User / Requisitioner" : "Inclusion Officer"}
        roleDesc={user?.role === "citizen" ? "Public transparency access" : "Submit requisitions, track your requests"}
        aiName="Assistant AI" aiRole="Self-service procurement support"
        features={[
          { icon: Globe2,     title: user?.role === "citizen" ? "View Published Tenders" : "Raise Requisition", desc: user?.role === "citizen" ? "Browse all publicly disclosed tenders, awards, and contracts." : "Submit a purchase requisition to the procurement team.", action: user?.role === "citizen" ? "Browse Tenders" : "Raise Requisition" },
          { icon: Search,     title: "Search Records",         desc: "Search for specific procurement records, awards, or vendors.", action: "Search" },
          { icon: FileText,   title: "Track My Requests",      desc: "View the status of your submitted requisitions or feedback.", action: "Track Requests" },
          { icon: BarChart3,  title: "View Statistics",        desc: "National procurement statistics and performance data.", action: "View Stats" },
          { icon: Shield,     title: "Submit Feedback",        desc: "Provide feedback or raise a concern about a procurement process.", action: "Submit Feedback" },
          { icon: Activity,   title: "Transparency Portal",    desc: "Access the full public transparency portal with open data.", action: "Open Portal" },
        ]} />;

    case "communications_officer":
      return <GenericRoleDashboard
        roleLabel="Communications Officer" roleDesc="Tender publications, notices, and public communications"
        aiName="Comms AI" aiRole="Publication drafting, notice management"
        features={[
          { icon: Globe2,     title: "Publish Tender Notice",  desc: "Publish approved tender advertisements to website, portal, and newspapers.", action: "Publish Notice" },
          { icon: FileText,   title: "Draft Award Notice",     desc: "Draft and publish contract award notices for public transparency.", action: "Draft Notice" },
          { icon: Users,      title: "Supplier Notifications", desc: "Send email/SMS notifications to registered suppliers about relevant tenders.", action: "Send Notifications" },
          { icon: BarChart3,  title: "Media Coverage",         desc: "Track media coverage and public queries about procurement activities.", action: "Track Coverage" },
          { icon: Archive,    title: "Notice Archive",         desc: "Manage the archive of published procurement notices.", action: "Open Archive" },
          { icon: Settings,   title: "Publication Channels",   desc: "Manage publication channels, templates, and distribution lists.", action: "Manage Channels" },
        ]} />;

    // ── Default fallback ─────────────────────────────────────────────────────
    default:
      return <CommandCenter />;
  }
}
