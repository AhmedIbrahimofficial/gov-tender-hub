// ─── Role Dashboard Configuration Data ───────────────────────────────────────
// Each role gets its own unique dashboard configuration with role-specific
// KPIs, quick actions, sub-modules, activity feed, and AI capabilities.

export type RoleKPI = {
  label: string; value: string; delta: string; positive: boolean;
  color: "blue"|"green"|"amber"|"red"|"violet"|"cyan"|"orange"|"pink";
};

export type RoleAction = {
  label: string; desc: string; icon: string; route?: string; color?: string;
};

export type RoleActivity = {
  action: string; time: string; type: "success"|"info"|"warning"|"error";
};

export type RoleSubModule = {
  label: string; route: string; icon: string; desc: string;
};

export type RoleChartPoint = { label: string; value: number; value2?: number };

export type RoleDashboardConfig = {
  role: string;
  title: string;
  subtitle: string;
  department: string;
  gradientFrom: string;
  gradientTo: string;
  accentHex: string;
  kpis: RoleKPI[];
  quickActions: RoleAction[];
  recentActivity: RoleActivity[];
  chartData: RoleChartPoint[];
  chartTitle: string;
  chartLabel1: string;
  chartLabel2?: string;
  aiName: string;
  aiCapabilities: string[];
  subModules: RoleSubModule[];
};

const CONFIGS: Record<string, RoleDashboardConfig> = {

// ── PERMANENT SECRETARY ──────────────────────────────────────────────────────
permanent_secretary: {
  role: "permanent_secretary", title: "Permanent Secretary", subtitle: "Institutional Head · Strategic Oversight",
  department: "Office of the Permanent Secretary", gradientFrom: "#1e1b4b", gradientTo: "#312e81", accentHex: "#818cf8",
  kpis: [
    { label: "Departments Under Oversight", value: "14", delta: "All operational", positive: true, color: "violet" },
    { label: "Strategic Plans Active", value: "7", delta: "+2 this quarter", positive: true, color: "blue" },
    { label: "Cabinet Submissions Pending", value: "3", delta: "Due this week", positive: false, color: "amber" },
    { label: "Overall Compliance Rate", value: "96.4%", delta: "+1.2 pts", positive: true, color: "green" },
    { label: "Staff Headcount", value: "348", delta: "Across all depts", positive: true, color: "cyan" },
    { label: "Open Issues Escalated", value: "5", delta: "Requires action", positive: false, color: "red" },
  ],
  quickActions: [
    { label: "Review Strategic Plans", desc: "Annual plans progress review", icon: "Target", route: "/corporate" },
    { label: "Cabinet Reports", desc: "Prepare ministerial reports", icon: "FileText", route: "/department-activities" },
    { label: "Approve Budgets", desc: "Sign off departmental budgets", icon: "Wallet", route: "/budget" },
    { label: "Staff Performance Review", desc: "Quarterly performance oversight", icon: "TrendingUp", route: "/staff-productivity" },
    { label: "Risk Register", desc: "Institutional risk overview", icon: "ShieldCheck", route: "/audit" },
    { label: "AI Briefing", desc: "Get AI institutional summary", icon: "Sparkles", route: "/ai-agents" },
  ],
  recentActivity: [
    { action: "Strategic Plan Q2 review completed — 88% targets on track", time: "1 hr ago", type: "success" },
    { action: "Cabinet submission prepared for Infrastructure Development Act", time: "3 hrs ago", type: "info" },
    { action: "Finance Department flagged budget overrun — USD 1.2M", time: "4 hrs ago", type: "warning" },
    { action: "HR Department submitted recruitment plan for 48 vacancies", time: "Yesterday", type: "info" },
    { action: "Compliance audit report received — 96.4% score", time: "2 days ago", type: "success" },
  ],
  chartData: [
    { label: "PS Office", value: 94 }, { label: "Strategy", value: 88 }, { label: "Finance", value: 91 },
    { label: "Procurement", value: 89 }, { label: "HR", value: 92 }, { label: "ICT", value: 93 },
    { label: "Legal", value: 95 }, { label: "Audit", value: 97 }, { label: "Operations", value: 86 },
  ],
  chartTitle: "Departmental Performance Scores", chartLabel1: "Score %",
  aiName: "Executive AI Advisor",
  aiCapabilities: ["Summarise all department performance", "Draft cabinet reports", "Flag cross-department risks", "Generate institutional health report"],
  subModules: [
    { label: "Corporate Module", route: "/corporate", icon: "Crown", desc: "All 14 departments" },
    { label: "Strategic Planning", route: "/corporate/strategy-policy-planning", icon: "Target", desc: "Plans & policies" },
    { label: "Budget Oversight", route: "/budget", icon: "Wallet", desc: "Financial control" },
    { label: "Staff Productivity", route: "/staff-productivity", icon: "Users", desc: "Performance metrics" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "Compliance & rules" },
    { label: "AI Operations", route: "/ai-agents", icon: "Sparkles", desc: "AI agents status" },
  ],
},

// ── CHIEF EXECUTIVE ──────────────────────────────────────────────────────────
chief_executive: {
  role: "chief_executive", title: "Chief Executive Officer", subtitle: "Entity-Level Strategic Management",
  department: "Executive Office", gradientFrom: "#0f172a", gradientTo: "#1e293b", accentHex: "#94a3b8",
  kpis: [
    { label: "Revenue YTD", value: "USD 84.2M", delta: "+12% vs target", positive: true, color: "green" },
    { label: "Operating Costs", value: "USD 61.8M", delta: "Within budget", positive: true, color: "blue" },
    { label: "Staff Headcount", value: "1,240", delta: "14 vacancies open", positive: false, color: "amber" },
    { label: "Projects Active", value: "23", delta: "5 at risk", positive: false, color: "red" },
    { label: "Compliance Score", value: "94.8%", delta: "+0.6 pts", positive: true, color: "violet" },
    { label: "Customer Satisfaction", value: "4.2/5", delta: "+0.3 pts", positive: true, color: "cyan" },
  ],
  quickActions: [
    { label: "Executive Dashboard", desc: "Full entity overview", icon: "LayoutDashboard", route: "/prime-entity" },
    { label: "Board Reports", desc: "Prepare board packs", icon: "FileText", route: "/department-activities" },
    { label: "Financial Review", desc: "P&L and cash flow", icon: "DollarSign", route: "/finance" },
    { label: "People & Culture", desc: "HR metrics and talent", icon: "Users", route: "/staff-productivity" },
    { label: "Strategic Projects", desc: "Portfolio overview", icon: "Briefcase", route: "/projects" },
    { label: "Risk & Compliance", desc: "Enterprise risk view", icon: "ShieldCheck", route: "/audit" },
  ],
  recentActivity: [
    { action: "Q2 Board Pack finalised and distributed to all board members", time: "2 hrs ago", type: "success" },
    { action: "Revenue target exceeded by 12% — commendation to Finance team", time: "4 hrs ago", type: "success" },
    { action: "3 strategic projects flagged at risk — urgent review required", time: "5 hrs ago", type: "warning" },
    { action: "New CFO appointment approved by Board", time: "Yesterday", type: "info" },
    { action: "Annual performance reviews commenced across all departments", time: "2 days ago", type: "info" },
  ],
  chartData: [
    { label: "Jan", value: 6.2, value2: 5.1 }, { label: "Feb", value: 7.1, value2: 5.6 },
    { label: "Mar", value: 6.8, value2: 5.3 }, { label: "Apr", value: 7.9, value2: 5.9 },
    { label: "May", value: 8.4, value2: 6.1 }, { label: "Jun", value: 7.6, value2: 5.8 },
  ],
  chartTitle: "Revenue vs Operating Costs (USD M)", chartLabel1: "Revenue", chartLabel2: "Costs",
  aiName: "CEO AI Advisor",
  aiCapabilities: ["Executive performance briefing", "Board report generation", "Strategic risk analysis", "Department comparison reports"],
  subModules: [
    { label: "Prime Entity Dashboard", route: "/prime-entity", icon: "Landmark", desc: "Full oversight" },
    { label: "Financial Control", route: "/finance", icon: "Wallet", desc: "P&L, cash flow" },
    { label: "Project Portfolio", route: "/projects/portfolio", icon: "Briefcase", desc: "All projects" },
    { label: "Risk & Audit", route: "/audit", icon: "ShieldCheck", desc: "Enterprise risks" },
    { label: "People Analytics", route: "/staff-productivity", icon: "Users", desc: "HR metrics" },
    { label: "Analytics Hub", route: "/analytics", icon: "BarChart3", desc: "BI dashboards" },
  ],
},

// ── ADJUDICATION OFFICER ─────────────────────────────────────────────────────
adjudication_officer: {
  role: "adjudication_officer", title: "Adjudication Officer", subtitle: "Award Decisions · Appeals · Committee",
  department: "Procurement — Adjudication Unit", gradientFrom: "#3b0764", gradientTo: "#581c87", accentHex: "#c084fc",
  kpis: [
    { label: "Pending Adjudications", value: "8", delta: "3 urgent", positive: false, color: "amber" },
    { label: "Awards Issued (MTD)", value: "14", delta: "+4 vs last month", positive: true, color: "green" },
    { label: "Appeals Received", value: "3", delta: "2 under review", positive: false, color: "red" },
    { label: "Avg Decision Time", value: "4.2 days", delta: "Target: 5 days", positive: true, color: "blue" },
    { label: "COI Checks Completed", value: "22/22", delta: "All cleared", positive: true, color: "violet" },
  ],
  quickActions: [
    { label: "Review Evaluation Reports", desc: "Pending for adjudication", icon: "FileText", route: "/evaluations" },
    { label: "Issue Award", desc: "Formally recommend award", icon: "Trophy", route: "/awards" },
    { label: "Process Appeal", desc: "Handle bid appeals", icon: "Scale", route: "/awards" },
    { label: "Committee Minutes", desc: "Record proceedings", icon: "ClipboardList", route: "/tenders" },
    { label: "COI Declaration Check", desc: "Verify member declarations", icon: "ShieldCheck", route: "/governance" },
    { label: "Generate Report", desc: "Adjudication summary", icon: "BarChart3", route: "/analytics" },
  ],
  recentActivity: [
    { action: "Award recommended — ZW-PRA-2026-00183 ARV Medicines USD 42.5M", time: "2 hrs ago", type: "success" },
    { action: "COI check completed for all 5 committee members", time: "4 hrs ago", type: "success" },
    { action: "Appeal received from Bulawayo Civil Works — ZW-PRA-2026-00181", time: "5 hrs ago", type: "warning" },
    { action: "Evaluation report reviewed — Solar Mini-Grids", time: "Yesterday", type: "info" },
  ],
  chartData: [
    { label: "Jan", value: 8 }, { label: "Feb", value: 11 }, { label: "Mar", value: 9 },
    { label: "Apr", value: 13 }, { label: "May", value: 12 }, { label: "Jun", value: 14 },
  ],
  chartTitle: "Awards Issued Per Month", chartLabel1: "Awards",
  aiName: "Adjudication AI",
  aiCapabilities: ["Evaluate bid scoring consistency", "Flag conflict of interest patterns", "Draft award recommendation", "Generate adjudication report"],
  subModules: [
    { label: "Evaluations", route: "/evaluations", icon: "Scale", desc: "Bid evaluation reports" },
    { label: "Awards & Appeals", route: "/awards", icon: "Trophy", desc: "Award decisions" },
    { label: "Tenders Register", route: "/tenders", icon: "FileText", desc: "Active tenders" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "COI & compliance" },
    { label: "Certificates", route: "/certificates", icon: "BookOpen", desc: "Award notices" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Performance data" },
  ],
},

// ── CONTRACT OFFICER ─────────────────────────────────────────────────────────
contract_officer: {
  role: "contract_officer", title: "Contract Officer", subtitle: "Contract Drafting · Execution · Monitoring",
  department: "Contracts Unit", gradientFrom: "#164e63", gradientTo: "#0e7490", accentHex: "#22d3ee",
  kpis: [
    { label: "Contracts Under Management", value: "18", delta: "4 expiring soon", positive: false, color: "blue" },
    { label: "Draft Contracts Pending", value: "5", delta: "Due this week", positive: false, color: "amber" },
    { label: "Contracts On Track", value: "14", delta: "77.8% rate", positive: true, color: "green" },
    { label: "Variation Orders Active", value: "3", delta: "Pending approval", positive: false, color: "red" },
    { label: "Avg Contract Value", value: "USD 8.4M", delta: "Portfolio total USD 151M", positive: true, color: "violet" },
  ],
  quickActions: [
    { label: "Draft Contract", desc: "New contract from template", icon: "FileText", route: "/contracts" },
    { label: "Milestone Update", desc: "Log delivery milestone", icon: "CheckCircle2", route: "/contracts" },
    { label: "Variation Order", desc: "Process scope change", icon: "RefreshCcw", route: "/contracts" },
    { label: "Performance Score", desc: "Rate vendor delivery", icon: "TrendingUp", route: "/performance" },
    { label: "Expiry Alerts", desc: "Contracts due renewal", icon: "Clock", route: "/contracts" },
    { label: "Legal Review", desc: "Clause risk review", icon: "Scale", route: "/governance" },
  ],
  recentActivity: [
    { action: "Contract drafted — CN-2026-0425 Beitbridge Phase 4 USD 88M", time: "1 hr ago", type: "success" },
    { action: "Milestone certified — CN-2026-0411 earthworks 64% complete", time: "3 hrs ago", type: "success" },
    { action: "Variation order VAR-2026-013 pending CPO approval", time: "5 hrs ago", type: "warning" },
    { action: "Vendor performance scorecard issued to Zimbabwe Pharma Holdings", time: "Yesterday", type: "info" },
  ],
  chartData: [
    { label: "On Track", value: 14 }, { label: "At Risk", value: 2 }, { label: "Expiring", value: 4 }, { label: "Completed", value: 8 },
  ],
  chartTitle: "Contract Status Distribution", chartLabel1: "Count",
  aiName: "Contract AI",
  aiCapabilities: ["Draft contract clauses", "Flag non-standard terms", "Monitor milestone adherence", "Predict variation risk"],
  subModules: [
    { label: "Contracts", route: "/contracts", icon: "FileSignature", desc: "All contracts" },
    { label: "Vendor Performance", route: "/performance", icon: "TrendingUp", desc: "KPI scorecards" },
    { label: "Awards Register", route: "/awards", icon: "Trophy", desc: "Awarded tenders" },
    { label: "Finance", route: "/finance", icon: "Wallet", desc: "Payment tracking" },
    { label: "Legal Governance", route: "/governance", icon: "Landmark", desc: "Compliance" },
    { label: "Certificates", route: "/certificates", icon: "BookOpen", desc: "Completion certs" },
  ],
},

// ── AUDIT OFFICER ────────────────────────────────────────────────────────────
audit_officer: {
  role: "audit_officer", title: "Audit Officer", subtitle: "Internal Audit · Transaction Verification · Compliance",
  department: "Internal Audit & Risk Management", gradientFrom: "#422006", gradientTo: "#78350f", accentHex: "#fbbf24",
  kpis: [
    { label: "Audits In Progress", value: "4", delta: "2 fieldwork stage", positive: true, color: "blue" },
    { label: "Findings Raised (YTD)", value: "38", delta: "12 critical", positive: false, color: "red" },
    { label: "Corrective Actions Open", value: "14", delta: "6 overdue", positive: false, color: "amber" },
    { label: "Audit Coverage", value: "72%", delta: "Target: 85%", positive: false, color: "orange" },
    { label: "Audit Opinion", value: "Qualified", delta: "2 depts at risk", positive: false, color: "red" },
  ],
  quickActions: [
    { label: "Open Audit File", desc: "Start new engagement", icon: "Search", route: "/audit" },
    { label: "Log Finding", desc: "Record audit exception", icon: "AlertTriangle", route: "/audit" },
    { label: "Compliance Scan", desc: "Run automated check", icon: "ShieldCheck", route: "/audit" },
    { label: "Transaction Sample", desc: "AI-assisted sampling", icon: "BarChart3", route: "/bi-dashboards" },
    { label: "Verify Documents", desc: "Document authenticity check", icon: "Eye", route: "/audit" },
    { label: "Corrective Actions", desc: "Track remediation progress", icon: "CheckCircle2", route: "/governance" },
  ],
  recentActivity: [
    { action: "Audit finding raised — Finance Dept VAT reconciliation gap USD 84K", time: "2 hrs ago", type: "error" },
    { action: "Compliance scan completed — 94.2% pass rate on 318 transactions", time: "3 hrs ago", type: "success" },
    { action: "Corrective action overdue — Procurement ghost vendor case FRD-2026-089", time: "4 hrs ago", type: "warning" },
    { action: "Annual audit plan updated — 4 high-risk areas added", time: "Yesterday", type: "info" },
  ],
  chartData: [
    { label: "Critical", value: 12 }, { label: "High", value: 14 }, { label: "Medium", value: 8 }, { label: "Low", value: 4 },
  ],
  chartTitle: "Audit Findings by Severity", chartLabel1: "Count",
  aiName: "Audit AI",
  aiCapabilities: ["Analyse 100% of transactions", "Detect fraud signatures", "Auto-classify findings", "Predict non-compliance risk"],
  subModules: [
    { label: "Audit & Compliance", route: "/audit", icon: "ShieldCheck", desc: "Internal audit hub" },
    { label: "Anti-Corruption", route: "/anti-corruption", icon: "AlertOctagon", desc: "Fraud detection" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Audit analytics" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "Control framework" },
    { label: "BI Dashboards", route: "/bi-dashboards", icon: "BarChart3", desc: "Risk intelligence" },
    { label: "Public Records", route: "/utility/public-records", icon: "FileText", desc: "Evidence vault" },
  ],
},

// ── ANTI-CORRUPTION OFFICER ──────────────────────────────────────────────────
anti_corruption_officer: {
  role: "anti_corruption_officer", title: "Anti-Corruption Officer", subtitle: "Fraud Detection · Investigation · ZACC Referrals",
  department: "Anti-Corruption & Integrity Unit", gradientFrom: "#450a0a", gradientTo: "#7f1d1d", accentHex: "#f87171",
  kpis: [
    { label: "Active Investigations", value: "7", delta: "3 new this week", positive: false, color: "red" },
    { label: "Fraud Alerts (MTD)", value: "23", delta: "+5 from AI agents", positive: false, color: "red" },
    { label: "ZACC Referrals", value: "4", delta: "YTD total: 12", positive: true, color: "amber" },
    { label: "Cases Closed (YTD)", value: "18", delta: "USD 2.1M recovered", positive: true, color: "green" },
    { label: "Risk Score Average", value: "High", delta: "3 entities flagged", positive: false, color: "red" },
  ],
  quickActions: [
    { label: "Open Investigation", desc: "New case file", icon: "Search", route: "/anti-corruption" },
    { label: "ZACC Referral", desc: "Submit referral form", icon: "Send", route: "/anti-corruption" },
    { label: "Fraud Alert Review", desc: "AI-flagged anomalies", icon: "AlertTriangle", route: "/anti-corruption" },
    { label: "Asset Tracing", desc: "Track suspicious assets", icon: "Package", route: "/assets" },
    { label: "Vendor Blacklist", desc: "Update debarment register", icon: "XCircle", route: "/vendors" },
    { label: "COI Investigation", desc: "Conflict of interest case", icon: "Eye", route: "/governance" },
  ],
  recentActivity: [
    { action: "Bid rotation pattern detected — 3 vendors, 7 tenders — ZACC referral filed", time: "1 hr ago", type: "error" },
    { action: "Ghost vendor FRD-2026-089 investigation completed — USD 840K recovered", time: "3 hrs ago", type: "success" },
    { action: "AI agent flagged anomalous payment pattern — Transport Dept", time: "4 hrs ago", type: "warning" },
    { action: "Conflict of interest declared — Evaluator P. Chanda recused", time: "Yesterday", type: "info" },
  ],
  chartData: [
    { label: "Jan", value: 5 }, { label: "Feb", value: 8 }, { label: "Mar", value: 6 },
    { label: "Apr", value: 11 }, { label: "May", value: 9 }, { label: "Jun", value: 7 },
  ],
  chartTitle: "Fraud Alerts Detected Per Month", chartLabel1: "Alerts",
  aiName: "Anti-Corruption AI",
  aiCapabilities: ["Detect bid rotation patterns", "Ghost vendor identification", "Payment anomaly detection", "Vendor blacklist screening"],
  subModules: [
    { label: "Anti-Corruption", route: "/anti-corruption", icon: "AlertOctagon", desc: "Case management" },
    { label: "Fraud Detection", route: "/budget/fraud", icon: "ShieldCheck", desc: "AI fraud engine" },
    { label: "Vendor Registry", route: "/vendors", icon: "Building2", desc: "Vendor risk" },
    { label: "Audit Module", route: "/audit", icon: "Search", desc: "Evidence trail" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Risk analytics" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "COI declarations" },
  ],
},

// ── COMPLIANCE OFFICER ───────────────────────────────────────────────────────
compliance_officer: {
  role: "compliance_officer", title: "Compliance Officer", subtitle: "PPDPA Compliance · Regulatory Monitoring · Exceptions",
  department: "Legal & Compliance", gradientFrom: "#431407", gradientTo: "#9a3412", accentHex: "#fb923c",
  kpis: [
    { label: "Compliance Score", value: "94.2%", delta: "+1.8 pts this quarter", positive: true, color: "green" },
    { label: "Open Exceptions", value: "12", delta: "3 critical", positive: false, color: "red" },
    { label: "Regulations Monitored", value: "47", delta: "All current", positive: true, color: "blue" },
    { label: "Training Completions", value: "218/240", delta: "91% compliance staff", positive: true, color: "violet" },
    { label: "Corrective Plans Active", value: "8", delta: "2 overdue", positive: false, color: "amber" },
  ],
  quickActions: [
    { label: "Compliance Scan", desc: "Run automated check", icon: "ShieldCheck", route: "/audit" },
    { label: "Log Exception", desc: "Record non-compliance", icon: "AlertTriangle", route: "/governance" },
    { label: "Policy Register", desc: "Manage PPDPA policies", icon: "BookOpen", route: "/governance" },
    { label: "Training Records", desc: "Staff compliance training", icon: "GraduationCap", route: "/staff-productivity" },
    { label: "Report to Regulator", desc: "PRAZ statutory report", icon: "Send", route: "/utility/communications" },
    { label: "Exception Report", desc: "Generate exception summary", icon: "FileText", route: "/analytics" },
  ],
  recentActivity: [
    { action: "PPDPA quarterly compliance report submitted to PRAZ", time: "2 hrs ago", type: "success" },
    { action: "Exception logged — Sole-source procurement without proper justification", time: "3 hrs ago", type: "warning" },
    { action: "Compliance training completed by 28 procurement officers", time: "Yesterday", type: "success" },
    { action: "Corrective action plan approved — Finance Department exceptions", time: "2 days ago", type: "info" },
  ],
  chartData: [
    { label: "Passed", value: 94 }, { label: "Minor Issues", value: 4 }, { label: "Critical", value: 2 },
  ],
  chartTitle: "Compliance Check Results (%)", chartLabel1: "Percentage",
  aiName: "Compliance AI",
  aiCapabilities: ["Automated PPDPA checks", "Threshold monitoring", "Exception pattern analysis", "Regulatory gap identification"],
  subModules: [
    { label: "Audit & Compliance", route: "/audit", icon: "ShieldCheck", desc: "Compliance hub" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "Policy management" },
    { label: "Corporate Module", route: "/corporate", icon: "Crown", desc: "Department compliance" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Compliance metrics" },
    { label: "Communications", route: "/utility/communications", icon: "MessageSquare", desc: "Regulator liaison" },
    { label: "Public Records", route: "/utility/public-records", icon: "FileText", desc: "Disclosure" },
  ],
},

// ── LEGAL OFFICER ────────────────────────────────────────────────────────────
legal_officer: {
  role: "legal_officer", title: "Legal Officer", subtitle: "Contract Review · Legal Opinions · Dispute Management",
  department: "Legal Services", gradientFrom: "#1c1917", gradientTo: "#292524", accentHex: "#a8a29e",
  kpis: [
    { label: "Legal Matters Open", value: "15", delta: "3 disputes", positive: false, color: "red" },
    { label: "Contracts Reviewed (MTD)", value: "22", delta: "All cleared", positive: true, color: "green" },
    { label: "Legal Opinions Issued", value: "9", delta: "+3 urgent", positive: false, color: "amber" },
    { label: "Litigation Cases", value: "2", delta: "1 in arbitration", positive: false, color: "red" },
    { label: "Avg Review Time", value: "2.4 days", delta: "Target: 3 days", positive: true, color: "blue" },
  ],
  quickActions: [
    { label: "Review Contract", desc: "Legal clause review", icon: "FileText", route: "/contracts" },
    { label: "Legal Opinion", desc: "Draft legal advice", icon: "Scale", route: "/governance" },
    { label: "Dispute File", desc: "Log dispute / litigation", icon: "Gavel", route: "/governance" },
    { label: "Policy Review", desc: "Regulatory compliance check", icon: "BookOpen", route: "/governance" },
    { label: "Compliance Check", desc: "PPDPA legal assessment", icon: "ShieldCheck", route: "/audit" },
    { label: "Legal Report", desc: "Monthly summary", icon: "BarChart3", route: "/analytics" },
  ],
  recentActivity: [
    { action: "Legal opinion issued — Beitbridge contract variation USD 2.4M approved", time: "1 hr ago", type: "success" },
    { action: "Dispute filed by Granite Construction — referred to arbitration", time: "3 hrs ago", type: "warning" },
    { action: "Contract reviewed — ARV Medicines Framework special conditions cleared", time: "4 hrs ago", type: "success" },
    { action: "PPDPA compliance opinion requested by CPO for sole-source exemption", time: "Yesterday", type: "info" },
  ],
  chartData: [
    { label: "Contracts", value: 22 }, { label: "Opinions", value: 9 }, { label: "Disputes", value: 3 }, { label: "Policy", value: 6 },
  ],
  chartTitle: "Legal Work by Category (MTD)", chartLabel1: "Count",
  aiName: "Legal AI",
  aiCapabilities: ["Flag non-standard contract clauses", "Dispute risk assessment", "Legal opinion drafting", "Regulatory compliance checking"],
  subModules: [
    { label: "Contracts", route: "/contracts", icon: "FileSignature", desc: "Contract management" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "Policy & law" },
    { label: "Audit & Compliance", route: "/audit", icon: "ShieldCheck", desc: "Legal compliance" },
    { label: "Tenders", route: "/tenders", icon: "FileText", desc: "Legal reviews" },
    { label: "Communications", route: "/utility/communications", icon: "MessageSquare", desc: "Legal notices" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Legal metrics" },
  ],
},

// ── STORES OFFICER ───────────────────────────────────────────────────────────
stores_officer: {
  role: "stores_officer", title: "Stores Officer", subtitle: "Inventory Control · Stock Management · Goods Receipt",
  department: "Procurement & Supply Chain — Stores", gradientFrom: "#052e16", gradientTo: "#14532d", accentHex: "#4ade80",
  kpis: [
    { label: "Items in Stock", value: "1,284", delta: "Across 8 warehouses", positive: true, color: "blue" },
    { label: "Stock Value", value: "USD 284K", delta: "+12K received today", positive: true, color: "green" },
    { label: "Reorder Alerts", value: "7", delta: "3 critical items", positive: false, color: "red" },
    { label: "GRNs Today", value: "4", delta: "2 pending inspection", positive: true, color: "amber" },
    { label: "Stockout Events (MTD)", value: "2", delta: "ARV stock critical", positive: false, color: "red" },
  ],
  quickActions: [
    { label: "Receive Goods", desc: "Create GRN", icon: "PackageCheck", route: "/inventory/receiving" },
    { label: "Issue Stock", desc: "Process issue request", icon: "Send", route: "/inventory/requests" },
    { label: "Stock Count", desc: "Physical count", icon: "ScanLine", route: "/inventory/stock-count" },
    { label: "Reorder Report", desc: "Items at reorder level", icon: "AlertTriangle", route: "/inventory" },
    { label: "Warehouse Map", desc: "Location & bin view", icon: "Warehouse", route: "/inventory/warehouse" },
    { label: "AI Demand Forecast", desc: "Predicted stock needs", icon: "Sparkles", route: "/inventory/ai-agents" },
  ],
  recentActivity: [
    { action: "GRN-2026-0042 processed — 500 ARV packs received from Zimbabwe Pharma", time: "1 hr ago", type: "success" },
    { action: "Reorder alert triggered — Diesel stock below 8,000L safety level", time: "2 hrs ago", type: "warning" },
    { action: "IRQ-2026-0031 issued — 20 laptops to ICT department", time: "4 hrs ago", type: "info" },
    { action: "Stock count completed — 98.2% accuracy rate", time: "Yesterday", type: "success" },
  ],
  chartData: [
    { label: "Pharmaceuticals", value: 1240 }, { label: "ICT Equipment", value: 18 }, { label: "Office Supplies", value: 124 },
    { label: "Construction", value: 680 }, { label: "Fuel", value: 22400 }, { label: "Medical", value: 845 },
  ],
  chartTitle: "Stock Levels by Category", chartLabel1: "Units",
  aiName: "Inventory AI",
  aiCapabilities: ["Demand forecasting", "Reorder level optimisation", "FIFO rotation enforcement", "Stockout prediction"],
  subModules: [
    { label: "Inventory", route: "/inventory", icon: "Boxes", desc: "Full inventory" },
    { label: "Receiving", route: "/inventory/receiving", icon: "PackageCheck", desc: "GRN processing" },
    { label: "Issue Requests", route: "/inventory/requests", icon: "Send", desc: "Stock issues" },
    { label: "Warehouse", route: "/inventory/warehouse", icon: "Warehouse", desc: "Location map" },
    { label: "Stock Count", route: "/inventory/stock-count", icon: "ScanLine", desc: "Physical counts" },
    { label: "Inventory AI", route: "/inventory/ai-agents", icon: "Sparkles", desc: "AI analytics" },
  ],
},

// ── RECORDS OFFICER ──────────────────────────────────────────────────────────
records_officer: {
  role: "records_officer", title: "Records Officer", subtitle: "Document Management · Archiving · Records Lifecycle",
  department: "Administration & Facilities — Records", gradientFrom: "#1e1b4b", gradientTo: "#3730a3", accentHex: "#818cf8",
  kpis: [
    { label: "Documents Filed (MTD)", value: "842", delta: "+124 vs last month", positive: true, color: "blue" },
    { label: "Pending Classification", value: "38", delta: "Due this week", positive: false, color: "amber" },
    { label: "Archive Requests", value: "12", delta: "6 processed today", positive: true, color: "green" },
    { label: "Retention Review Due", value: "156", delta: "Q2 2026 batch", positive: false, color: "orange" },
    { label: "Access Control Flags", value: "3", delta: "Unauthorised attempts", positive: false, color: "red" },
  ],
  quickActions: [
    { label: "File Document", desc: "Register new document", icon: "FileText", route: "/utility/public-records" },
    { label: "Archive Batch", desc: "Archive closed files", icon: "Archive", route: "/utility/public-records" },
    { label: "Access Log Review", desc: "Who accessed what", icon: "Eye", route: "/audit" },
    { label: "Retention Schedule", desc: "Review disposal dates", icon: "Clock", route: "/governance" },
    { label: "Document Search", desc: "Find any record", icon: "Search", route: "/utility/public-records" },
    { label: "Records Report", desc: "Monthly statistics", icon: "BarChart3", route: "/analytics" },
  ],
  recentActivity: [
    { action: "Tender file ZW-PRA-2026-00184 archived — all 22 documents complete", time: "2 hrs ago", type: "success" },
    { action: "Retention review flagged 156 documents approaching disposal date", time: "3 hrs ago", type: "warning" },
    { action: "Unauthorised access attempt to Cabinet submissions — IT notified", time: "5 hrs ago", type: "error" },
    { action: "Annual archive audit completed — 99.1% accuracy score", time: "Yesterday", type: "success" },
  ],
  chartData: [
    { label: "Jan", value: 640 }, { label: "Feb", value: 718 }, { label: "Mar", value: 692 },
    { label: "Apr", value: 774 }, { label: "May", value: 801 }, { label: "Jun", value: 842 },
  ],
  chartTitle: "Documents Filed Per Month", chartLabel1: "Documents",
  aiName: "Records AI",
  aiCapabilities: ["Auto-classify document types", "Retention date calculation", "Unauthorised access detection", "Archive completeness check"],
  subModules: [
    { label: "Public Records", route: "/utility/public-records", icon: "FileText", desc: "Document vault" },
    { label: "Media Library", route: "/utility/media", icon: "Image", desc: "Media archive" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "Retention policy" },
    { label: "Audit Trail", route: "/audit", icon: "Search", desc: "Access logs" },
    { label: "Announcements", route: "/utility/announcements", icon: "Bell", desc: "Official notices" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "Records metrics" },
  ],
},

// ── SYSTEM ADMIN ─────────────────────────────────────────────────────────────
system_admin: {
  role: "system_admin", title: "System Administrator", subtitle: "Platform Configuration · Users · Security · Integration",
  department: "ICT & Digital Transformation", gradientFrom: "#0c0a09", gradientTo: "#1c1917", accentHex: "#a8a29e",
  kpis: [
    { label: "Active Users", value: "1,284", delta: "+18 this week", positive: true, color: "blue" },
    { label: "System Uptime", value: "99.94%", delta: "SLA: 99.5%", positive: true, color: "green" },
    { label: "Security Alerts", value: "7", delta: "2 critical", positive: false, color: "red" },
    { label: "Pending Approvals", value: "23", delta: "User role changes", positive: false, color: "amber" },
    { label: "API Integrations", value: "14", delta: "All healthy", positive: true, color: "violet" },
    { label: "Data Backup Status", value: "Current", delta: "Last: 04:00 today", positive: true, color: "green" },
  ],
  quickActions: [
    { label: "User Management", desc: "Create / modify users", icon: "Users", route: "/roles" },
    { label: "Role Permissions", desc: "Manage access rights", icon: "ShieldCheck", route: "/roles" },
    { label: "System Health", desc: "Server & API status", icon: "Activity", route: "/ai-agents" },
    { label: "Security Log", desc: "Intrusion & access log", icon: "AlertTriangle", route: "/audit" },
    { label: "Org Structure", desc: "Ministry & dept config", icon: "Building2", route: "/organisations" },
    { label: "BI Configuration", desc: "Dashboard settings", icon: "BarChart3", route: "/bi-dashboards" },
  ],
  recentActivity: [
    { action: "24 new user accounts created — Ministry of Finance onboarding", time: "1 hr ago", type: "success" },
    { action: "Security alert — 2 failed login attempts from external IP", time: "2 hrs ago", type: "error" },
    { action: "System backup completed — 2,840 records backed up", time: "4 hrs ago", type: "success" },
    { action: "ZIMRA API integration health check passed", time: "6 hrs ago", type: "success" },
  ],
  chartData: [
    { label: "Jan", value: 1180 }, { label: "Feb", value: 1208 }, { label: "Mar", value: 1231 },
    { label: "Apr", value: 1254 }, { label: "May", value: 1268 }, { label: "Jun", value: 1284 },
  ],
  chartTitle: "Active User Growth", chartLabel1: "Users",
  aiName: "System AI",
  aiCapabilities: ["Automated security scanning", "User behaviour anomaly detection", "System performance optimisation", "Compliance configuration audit"],
  subModules: [
    { label: "Roles & Permissions", route: "/roles", icon: "ShieldCheck", desc: "Access control" },
    { label: "Organisations", route: "/organisations", icon: "Building2", desc: "Org structure" },
    { label: "AI Agents", route: "/ai-agents", icon: "Sparkles", desc: "Agent management" },
    { label: "Audit Logs", route: "/audit", icon: "Search", desc: "System audit trail" },
    { label: "BI Dashboards", route: "/bi-dashboards", icon: "BarChart3", desc: "Analytics config" },
    { label: "Prime Entity", route: "/prime-entity", icon: "Landmark", desc: "Platform admin" },
  ],
},

// ── AI GOVERNANCE OFFICER ────────────────────────────────────────────────────
ai_governance_officer: {
  role: "ai_governance_officer", title: "AI Governance Officer", subtitle: "AI Model Oversight · Explainability · Ethics",
  department: "ICT & Digital — AI Governance", gradientFrom: "#1e1b4b", gradientTo: "#4c1d95", accentHex: "#c084fc",
  kpis: [
    { label: "AI Agents Active", value: "8", delta: "All systems nominal", positive: true, color: "violet" },
    { label: "Avg AI Confidence", value: "92.5%", delta: "+0.8 pts this week", positive: true, color: "green" },
    { label: "Bias Flags Raised", value: "2", delta: "Under investigation", positive: false, color: "red" },
    { label: "Explainability Score", value: "88%", delta: "Target: 90%", positive: false, color: "amber" },
    { label: "Models Under Governance", value: "12", delta: "3 pending review", positive: false, color: "blue" },
  ],
  quickActions: [
    { label: "Agent Monitor", desc: "Real-time agent status", icon: "Activity", route: "/ai-agents" },
    { label: "Explainability Review", desc: "AI decision trails", icon: "Eye", route: "/ai-agents" },
    { label: "Bias Audit", desc: "Fairness assessment", icon: "Scale", route: "/ai-agents" },
    { label: "Threshold Management", desc: "Confidence settings", icon: "Settings", route: "/ai-agents" },
    { label: "AI Performance Report", desc: "Monthly accuracy metrics", icon: "BarChart3", route: "/analytics" },
    { label: "Ethics Policy", desc: "AI governance register", icon: "BookOpen", route: "/governance" },
  ],
  recentActivity: [
    { action: "AI Agent 'Fraud Detection' confidence improved to 89% after retraining", time: "2 hrs ago", type: "success" },
    { action: "Bias flag raised — Award Recommendation AI favouring large vendors", time: "3 hrs ago", type: "warning" },
    { action: "Monthly AI performance report compiled — 8 agents reviewed", time: "Yesterday", type: "info" },
    { action: "Explainability dashboard updated with 420 new decision trails", time: "2 days ago", type: "info" },
  ],
  chartData: [
    { label: "Supplier Verify", value: 96 }, { label: "Fraud Detect", value: 89 }, { label: "Compliance", value: 98 },
    { label: "Evaluation", value: 91 }, { label: "Award Rec", value: 90 }, { label: "Contract Intel", value: 93 },
  ],
  chartTitle: "AI Agent Confidence Scores (%)", chartLabel1: "Confidence %",
  aiName: "Meta AI",
  aiCapabilities: ["AI audit and explainability", "Bias detection algorithms", "Model performance benchmarking", "Governance policy compliance"],
  subModules: [
    { label: "AI Agents", route: "/ai-agents", icon: "Sparkles", desc: "Agent control centre" },
    { label: "Analytics", route: "/analytics", icon: "BarChart3", desc: "AI performance" },
    { label: "BI Dashboards", route: "/bi-dashboards", icon: "BarChart3", desc: "Intelligence hub" },
    { label: "Governance", route: "/governance", icon: "Landmark", desc: "AI ethics policy" },
    { label: "Audit", route: "/audit", icon: "ShieldCheck", desc: "AI audit trails" },
    { label: "Budget AI", route: "/budget/ai-agents", icon: "Sparkles", desc: "Finance AI" },
  ],
},
