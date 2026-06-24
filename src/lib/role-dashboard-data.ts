// Role-specific dashboard configurations for all system roles
export type RoleDashboardConfig = {
  role: string;
  title: string;
  subtitle: string;
  department: string;
  color: string;
  accentColor: string;
  theme: "blue"|"green"|"violet"|"amber"|"red"|"slate"|"teal"|"indigo"|"orange"|"pink"|"cyan"|"emerald";
  kpis: Array<{ label: string; value: string; delta: string; positive: boolean; color: string }>;
  quickActions: Array<{ label: string; desc: string; icon: string; route?: string }>;
  recentActivity: Array<{ action: string; time: string; type: "success"|"info"|"warning"|"error" }>;
  chartData: Array<{ label: string; value: number; value2?: number }>;
  chartTitle: string;
  aiName: string;
  aiCapabilities: string[];
  subModules: Array<{ label: string; route: string; icon: string }>;
};

const configs: Record<string, RoleDashboardConfig> = {
  cpo: {
    role: "cpo", title: "Chief Procurement Officer", subtitle: "Full platform authority & governance oversight",
    department: "Procurement Authority", color: "bg-slate-900", accentColor: "#0f172a", theme: "slate",
    kpis: [
      { label: "Active Tenders", value: "47", delta: "+3 this week", positive: true, color: "blue" },
      { label: "Total Contract Value", value: "USD 284M", delta: "+12% YTD", positive: true, color: "green" },
      { label: "Compliance Rate", value: "96.4%", delta: "+1.2%", positive: true, color: "teal" },
      { label: "Pending Approvals", value: "12", delta: "3 urgent", positive: false, color: "amber" },
      { label: "Vendors Registered", value: "1,842", delta: "+28 new", positive: true, color: "indigo" },
      { label: "Fraud Alerts", value: "2", delta: "Escalated to ZACC", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Review Approvals", desc: "12 items pending your sign-off", icon: "CheckCircle2", route: "/tenders" },
      { label: "View All Tenders", desc: "Monitor all active procurement", icon: "FileText", route: "/tenders" },
      { label: "Vendor Register", desc: "Manage approved suppliers", icon: "Users", route: "/vendors" },
      { label: "AI Reports", desc: "Daily officer activity summaries", icon: "Sparkles" },
      { label: "Audit Trail", desc: "Full transaction log", icon: "Shield", route: "/audit" },
      { label: "Contract Portfolio", desc: "All active contracts", icon: "Briefcase", route: "/contracts" },
      { label: "Analytics", desc: "National procurement BI", icon: "BarChart3", route: "/analytics" },
      { label: "Policy Manager", desc: "Manage procurement policies", icon: "BookOpen" },
      { label: "Generate Report", desc: "Board-ready executive summary", icon: "Download" },
    ],
    recentActivity: [
      { action: "Contract awarded — Beitbridge Highway Phase 3 (USD 71M)", time: "2 hours ago", type: "success" },
      { action: "Fraud alert escalated — bid rotation pattern detected", time: "4 hours ago", type: "error" },
      { action: "Evaluation completed — ARV Medicines Framework", time: "Yesterday", type: "info" },
      { action: "Vendor suspended — non-performance ZW-VEN-0482", time: "2 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Jan", value: 24, value2: 18 }, { label: "Feb", value: 31, value2: 22 },
      { label: "Mar", value: 28, value2: 25 }, { label: "Apr", value: 42, value2: 35 },
      { label: "May", value: 38, value2: 31 }, { label: "Jun", value: 47, value2: 40 },
    ],
    chartTitle: "Tenders Raised vs Awarded (Monthly)",
    aiName: "Procurement Intelligence AI",
    aiCapabilities: ["Fraud pattern detection", "Contract risk scoring", "Spend analytics", "Vendor due diligence", "Policy compliance checking", "Anomaly alerts"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  procurement_officer: {
    role: "procurement_officer", title: "Procurement Officer", subtitle: "Tenders, RFQs & procurement lifecycle",
    department: "Procurement Division", color: "bg-blue-700", accentColor: "#1d4ed8", theme: "blue",
    kpis: [
      { label: "Tenders Raised", value: "8", delta: "+2 this month", positive: true, color: "blue" },
      { label: "RFQs Active", value: "14", delta: "5 closing soon", positive: false, color: "amber" },
      { label: "Bids Received", value: "63", delta: "+11 this week", positive: true, color: "green" },
      { label: "Contract Value Pipeline", value: "USD 12.4M", delta: "In evaluation", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Create New Tender", desc: "Initiate a new procurement tender", icon: "Plus", route: "/tenders/new" },
      { label: "My Tenders", desc: "View your active tenders", icon: "FileText", route: "/tenders" },
      { label: "Create RFQ", desc: "Quick request for quotation", icon: "ClipboardList", route: "/rfq" },
      { label: "Evaluate Bids", desc: "Score and compare received bids", icon: "Star", route: "/evaluation" },
      { label: "Vendor Search", desc: "Find registered suppliers", icon: "Search", route: "/vendors" },
      { label: "Upload Documents", desc: "Attach tender documents", icon: "Upload" },
      { label: "Price Benchmarks", desc: "AI price comparison tool", icon: "TrendingUp" },
      { label: "Generate Report", desc: "Procurement activity report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Tender ZW-PRA-2026-00184 closed for bidding — 11 bids received", time: "1 hour ago", type: "success" },
      { action: "RFQ-2026-0892 opened for stationery supplies", time: "3 hours ago", type: "info" },
      { action: "Bid evaluation started — ARV Medicines Framework", time: "Yesterday", type: "info" },
      { action: "Compliance check failed — missing AGPO certificate on 2 bids", time: "2 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Jan", value: 5, value2: 3 }, { label: "Feb", value: 7, value2: 5 },
      { label: "Mar", value: 6, value2: 6 }, { label: "Apr", value: 9, value2: 7 },
      { label: "May", value: 8, value2: 6 }, { label: "Jun", value: 8, value2: 5 },
    ],
    chartTitle: "Tenders Raised vs Completed (Monthly)",
    aiName: "Procurement Assistant AI",
    aiCapabilities: ["Tender draft generation", "Bid evaluation support", "Price benchmarking", "Supplier shortlisting", "Document compliance check"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "RFQ", route: "/rfq", icon: "ClipboardList" },
      { label: "Evaluation", route: "/evaluation", icon: "Star" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },

  evaluator: {
    role: "evaluator", title: "Evaluation Officer", subtitle: "Bid scoring workbench & technical assessment",
    department: "Evaluation Committee", color: "bg-indigo-600", accentColor: "#4f46e5", theme: "indigo",
    kpis: [
      { label: "Assigned Evaluations", value: "6", delta: "2 overdue", positive: false, color: "red" },
      { label: "Bids Scored Today", value: "14", delta: "+4 this morning", positive: true, color: "green" },
      { label: "Avg Technical Score", value: "71.4%", delta: "Above threshold", positive: true, color: "indigo" },
      { label: "Pending Consensus", value: "3", delta: "Committee review needed", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Open Evaluation Sheet", desc: "Start scoring assigned bids", icon: "ClipboardList", route: "/evaluation" },
      { label: "Compare Bids", desc: "Side-by-side bid comparison", icon: "BarChart3" },
      { label: "Submit Scores", desc: "Submit completed evaluation", icon: "CheckCircle2" },
      { label: "Request Clarification", desc: "Ask bidder for more info", icon: "MessageSquare" },
      { label: "Flag Bid", desc: "Flag non-compliant bid", icon: "AlertTriangle" },
      { label: "View Criteria", desc: "Evaluation criteria and weights", icon: "BookOpen" },
      { label: "AI Scoring Aid", desc: "AI-assisted technical scoring", icon: "Sparkles" },
      { label: "Export Report", desc: "Export evaluation summary", icon: "Download" },
    ],
    recentActivity: [
      { action: "Scored 4 bids for ZW-PRA-2026-00183 — ARV Medicines", time: "30 min ago", type: "success" },
      { action: "Flagged bid EVL-084 — financial projection inconsistency", time: "2 hours ago", type: "warning" },
      { action: "Consensus meeting scheduled for ZW-PRA-2026-00182", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Bid A", value: 84 }, { label: "Bid B", value: 71 }, { label: "Bid C", value: 68 },
      { label: "Bid D", value: 55 }, { label: "Bid E", value: 49 }, { label: "Bid F", value: 38 },
    ],
    chartTitle: "Bid Technical Scores (Current Evaluation)",
    aiName: "Evaluation AI",
    aiCapabilities: ["Automated scoring assistance", "Red-flag detection", "Bias checking", "Document parsing", "Price reasonableness analysis"],
    subModules: [
      { label: "Evaluation", route: "/evaluation", icon: "ClipboardList" },
      { label: "Tenders", route: "/tenders", icon: "FileText" },
    ],
  },

  adjudication_officer: {
    role: "adjudication_officer", title: "Adjudication Officer", subtitle: "Award decisions, appeals & committee",
    department: "Adjudication Committee", color: "bg-violet-600", accentColor: "#7c3aed", theme: "violet",
    kpis: [
      { label: "Cases Pending", value: "5", delta: "2 urgent", positive: false, color: "red" },
      { label: "Awards Issued", value: "18", delta: "This quarter", positive: true, color: "green" },
      { label: "Appeals Open", value: "3", delta: "Awaiting response", positive: false, color: "amber" },
      { label: "Avg Decision Time", value: "4.2 days", delta: "-0.8 days", positive: true, color: "violet" },
    ],
    quickActions: [
      { label: "Review Evaluation Report", desc: "Check scoring from evaluators", icon: "FileText" },
      { label: "Issue Award", desc: "Formally issue contract award", icon: "Gavel" },
      { label: "Process Appeal", desc: "Review bidder appeal", icon: "Shield" },
      { label: "Record Minutes", desc: "Document committee proceedings", icon: "BookOpen" },
      { label: "COI Declaration", desc: "Verify conflict of interest", icon: "Eye" },
      { label: "Refer to ZACC", desc: "Escalate fraud suspicion", icon: "AlertTriangle" },
      { label: "Notify Bidders", desc: "Send award/rejection notifications", icon: "Mail" },
      { label: "Generate Report", desc: "Adjudication formal report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Award issued — ZW-PRA-2026-00181 to Highveld Engineering", time: "1 hour ago", type: "success" },
      { action: "Appeal ADJ-APP-024 received from rejected bidder", time: "3 hours ago", type: "warning" },
      { action: "COI check completed — no conflicts found for committee", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 3 }, { label: "Feb", value: 5 }, { label: "Mar", value: 4 },
      { label: "Apr", value: 6 }, { label: "May", value: 5 }, { label: "Jun", value: 4 },
    ],
    chartTitle: "Awards Issued per Month",
    aiName: "Adjudication AI",
    aiCapabilities: ["Award recommendation analysis", "Appeal merit assessment", "COI pattern detection", "Legal precedent lookup"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Audit", route: "/audit", icon: "Shield" },
    ],
  },

  finance_officer: {
    role: "finance_officer", title: "Finance Officer", subtitle: "Invoices, payments, budget & treasury",
    department: "Finance & Accounting", color: "bg-emerald-700", accentColor: "#047857", theme: "emerald",
    kpis: [
      { label: "Invoices Processed", value: "142", delta: "+23 this week", positive: true, color: "green" },
      { label: "Payments Made", value: "USD 8.4M", delta: "This month", positive: true, color: "emerald" },
      { label: "Budget Utilisation", value: "64.2%", delta: "On track", positive: true, color: "blue" },
      { label: "Cash Position", value: "USD 24.1M", delta: "-2.3M vs last week", positive: false, color: "amber" },
      { label: "Pending Approvals", value: "8", delta: "3 overdue", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Process Invoice", desc: "Approve or reject pending invoices", icon: "DollarSign", route: "/invoices" },
      { label: "Authorize Payment", desc: "Payment runs for approved invoices", icon: "CheckCircle2" },
      { label: "Budget Overview", desc: "Department-wise budget status", icon: "BarChart3" },
      { label: "Cash Flow Report", desc: "Inflows and outflows summary", icon: "TrendingUp" },
      { label: "Vendor Payments", desc: "Track outstanding payables", icon: "Building2" },
      { label: "Commitment Register", desc: "Budget commitments vs actuals", icon: "BookOpen" },
      { label: "Flag Irregularity", desc: "Report financial irregularity", icon: "AlertTriangle" },
      { label: "Export IFMIS Report", desc: "Download for IFMIS upload", icon: "Download" },
    ],
    recentActivity: [
      { action: "Invoice INV-2026-4821 approved — USD 2.84M (Highveld Engineering)", time: "1 hour ago", type: "success" },
      { action: "Payment run completed — 14 invoices paid (USD 4.2M)", time: "This morning", type: "success" },
      { action: "Budget overrun flagged — IT Department 108% utilisation", time: "Yesterday", type: "warning" },
      { action: "IFMIS sync failed — manual reconciliation needed", time: "2 days ago", type: "error" },
    ],
    chartData: [
      { label: "Jan", value: 5200000, value2: 4800000 }, { label: "Feb", value: 6100000, value2: 5900000 },
      { label: "Mar", value: 7400000, value2: 7100000 }, { label: "Apr", value: 8200000, value2: 7600000 },
      { label: "May", value: 9100000, value2: 8400000 }, { label: "Jun", value: 8400000, value2: 8000000 },
    ],
    chartTitle: "Invoices Received vs Paid (USD)",
    aiName: "Finance AI",
    aiCapabilities: ["Invoice anomaly detection", "Budget variance analysis", "Payment scheduling", "Cash flow forecasting", "IFMIS reconciliation support"],
    subModules: [
      { label: "Invoices", route: "/invoices", icon: "DollarSign" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  project_manager: {
    role: "project_manager", title: "Project Manager", subtitle: "Contract delivery, milestones & variations",
    department: "Project Management Office", color: "bg-teal-600", accentColor: "#0d9488", theme: "teal",
    kpis: [
      { label: "Active Projects", value: "11", delta: "2 critical path", positive: false, color: "amber" },
      { label: "On-Time Delivery", value: "72.7%", delta: "-4.1% this quarter", positive: false, color: "red" },
      { label: "Milestones Due", value: "8", delta: "This week", positive: false, color: "amber" },
      { label: "Budget Variance", value: "+3.2%", delta: "Slight overrun", positive: false, color: "orange" },
      { label: "Completed Projects", value: "24", delta: "This year", positive: true, color: "green" },
    ],
    quickActions: [
      { label: "Project Register", desc: "All active projects and status", icon: "Briefcase", route: "/contracts" },
      { label: "Update Milestone", desc: "Record milestone completion", icon: "CheckCircle2" },
      { label: "Log Variation", desc: "Record contract variation", icon: "Edit" },
      { label: "Risk Register", desc: "Project risk assessment", icon: "Shield" },
      { label: "Issue Site Report", desc: "Daily site progress report", icon: "FileText" },
      { label: "Escalate Delay", desc: "Notify CPO of critical delay", icon: "AlertTriangle" },
      { label: "Request Extension", desc: "Submit time extension request", icon: "Clock" },
      { label: "Generate Dashboard", desc: "Project status report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Milestone M4 completed — Beitbridge Highway Phase 3", time: "2 hours ago", type: "success" },
      { action: "Critical delay flagged — Harare Water Treatment Plant (14 days)", time: "Yesterday", type: "error" },
      { action: "Variation approved — scope extension USD 2.4M (CN-2026-0411)", time: "2 days ago", type: "info" },
    ],
    chartData: [
      { label: "On Track", value: 8 }, { label: "At Risk", value: 2 }, { label: "Delayed", value: 1 },
    ],
    chartTitle: "Project Status Distribution",
    aiName: "Project AI",
    aiCapabilities: ["Milestone prediction", "Delay early warning", "Variation impact analysis", "Critical path tracking"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  contract_manager: {
    role: "contract_manager", title: "Contract Manager", subtitle: "Contract lifecycle, variations & performance",
    department: "Contract Management Unit", color: "bg-cyan-700", accentColor: "#0e7490", theme: "cyan",
    kpis: [
      { label: "Active Contracts", value: "34", delta: "Under management", positive: true, color: "blue" },
      { label: "Expiring in 30 Days", value: "7", delta: "Renewal needed", positive: false, color: "red" },
      { label: "Variations Pending", value: "4", delta: "Awaiting approval", positive: false, color: "amber" },
      { label: "Avg Contract Completion", value: "61%", delta: "Healthy progress", positive: true, color: "green" },
    ],
    quickActions: [
      { label: "My Contracts", desc: "View all assigned contracts", icon: "FileText", route: "/contracts" },
      { label: "Update Milestone", desc: "Log milestone completion", icon: "CheckCircle2" },
      { label: "Log Variation", desc: "Record scope or time variation", icon: "Edit" },
      { label: "Performance Rating", desc: "Rate vendor performance", icon: "Star" },
      { label: "Renew Contract", desc: "Initiate renewal process", icon: "RefreshCw" },
      { label: "Issue Notice", desc: "Send formal notice to vendor", icon: "Mail" },
      { label: "Risk Flag", desc: "Escalate contract risk", icon: "AlertTriangle" },
      { label: "Close Contract", desc: "Formally close completed contract", icon: "Archive" },
    ],
    recentActivity: [
      { action: "Contract CN-2026-0411 — Milestone M5 certified", time: "1 hour ago", type: "success" },
      { action: "Vendor non-performance notice issued — CN-2026-0399", time: "Yesterday", type: "warning" },
      { action: "Variation VAR-2026-011 approved — +45 days extension", time: "2 days ago", type: "info" },
    ],
    chartData: [
      { label: "Q1", value: 12, value2: 10 }, { label: "Q2", value: 14, value2: 11 },
      { label: "Q3", value: 11, value2: 9 }, { label: "Q4", value: 8, value2: 7 },
    ],
    chartTitle: "Contracts Managed vs Closed (Quarterly)",
    aiName: "Contract AI",
    aiCapabilities: ["Variation risk analysis", "Renewal alerts", "Performance scoring", "Dispute prediction"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },

  audit_officer: {
    role: "audit_officer", title: "Audit Officer", subtitle: "Internal audit, compliance & transaction verification",
    department: "Internal Audit & Risk", color: "bg-amber-700", accentColor: "#b45309", theme: "amber",
    kpis: [
      { label: "Audit Findings Open", value: "14", delta: "4 critical", positive: false, color: "red" },
      { label: "Transactions Reviewed", value: "482", delta: "This month", positive: true, color: "green" },
      { label: "Compliance Score", value: "88.6%", delta: "+2.1% vs last period", positive: true, color: "amber" },
      { label: "Sampling Done", value: "37%", delta: "Of target", positive: false, color: "orange" },
    ],
    quickActions: [
      { label: "Audit Trail", desc: "Immutable transaction log", icon: "Shield", route: "/audit" },
      { label: "Raise Finding", desc: "Log a new audit finding", icon: "AlertTriangle" },
      { label: "Run Compliance Scan", desc: "Automated PPDPA check", icon: "Search" },
      { label: "Risk-Based Sample", desc: "AI-assisted audit sampling", icon: "BarChart3" },
      { label: "Document Verify", desc: "Verify document authenticity", icon: "Eye" },
      { label: "Interview Schedule", desc: "Schedule auditee interviews", icon: "Calendar" },
      { label: "Export Audit Pack", desc: "Working papers and evidence", icon: "Download" },
      { label: "Follow-Up Actions", desc: "Track open audit recommendations", icon: "CheckCircle2" },
    ],
    recentActivity: [
      { action: "Compliance scan completed — 3 new exceptions found", time: "2 hours ago", type: "warning" },
      { action: "Audit finding AUD-2026-089 escalated to CPO", time: "Yesterday", type: "error" },
      { action: "Transaction sampling completed — 50 items reviewed", time: "2 days ago", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 8 }, { label: "Feb", value: 12 }, { label: "Mar", value: 9 },
      { label: "Apr", value: 15 }, { label: "May", value: 11 }, { label: "Jun", value: 14 },
    ],
    chartTitle: "Audit Findings Raised Monthly",
    aiName: "Audit AI",
    aiCapabilities: ["Anomaly detection", "Risk-based sampling", "Compliance scoring", "Fraud pattern analysis", "Document verification"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  anti_corruption_officer: {
    role: "anti_corruption_officer", title: "Anti-Corruption Officer", subtitle: "Fraud detection, COI management & ZACC referrals",
    department: "Integrity & Anti-Corruption Unit", color: "bg-red-700", accentColor: "#b91c1c", theme: "red",
    kpis: [
      { label: "Active Investigations", value: "7", delta: "2 high priority", positive: false, color: "red" },
      { label: "ZACC Referrals", value: "3", delta: "This year", positive: false, color: "orange" },
      { label: "COI Declarations", value: "241", delta: "98.7% compliant", positive: true, color: "green" },
      { label: "Suspicious Alerts", value: "12", delta: "AI-generated", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Open Investigations", desc: "Current active fraud cases", icon: "Search" },
      { label: "COI Register", desc: "Conflict of interest declarations", icon: "Eye" },
      { label: "Refer to ZACC", desc: "Escalate case to anti-corruption body", icon: "Gavel" },
      { label: "AI Fraud Monitor", desc: "Real-time fraud risk dashboard", icon: "Sparkles" },
      { label: "Vendor Debarment", desc: "Initiate debarment proceedings", icon: "Shield" },
      { label: "Whistleblower Portal", desc: "Manage anonymous tips", icon: "Lock" },
      { label: "Evidence Vault", desc: "Secure evidence storage", icon: "Archive" },
      { label: "Investigation Report", desc: "Formal investigation report", icon: "Download" },
    ],
    recentActivity: [
      { action: "ZACC referral submitted — bid rotation pattern FRD-2026-089", time: "3 hours ago", type: "error" },
      { action: "COI flag — evaluator relationship with bidder (EVL-091)", time: "Yesterday", type: "warning" },
      { action: "Whistleblower tip received — WB-2026-034 under review", time: "2 days ago", type: "info" },
    ],
    chartData: [
      { label: "Q1 2025", value: 4 }, { label: "Q2 2025", value: 6 }, { label: "Q3 2025", value: 3 },
      { label: "Q4 2025", value: 5 }, { label: "Q1 2026", value: 7 }, { label: "Q2 2026", value: 7 },
    ],
    chartTitle: "Fraud Investigations by Quarter",
    aiName: "Anti-Corruption AI",
    aiCapabilities: ["Bid collusion detection", "Shell company identification", "Payment pattern analysis", "Whistleblower case triage", "COI network mapping"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },

  compliance_officer: {
    role: "compliance_officer", title: "Compliance Officer", subtitle: "PPDPA compliance monitoring & exceptions",
    department: "Legal & Compliance", color: "bg-orange-700", accentColor: "#c2410c", theme: "orange",
    kpis: [
      { label: "Compliance Rate", value: "93.2%", delta: "+1.8% this month", positive: true, color: "green" },
      { label: "Open Exceptions", value: "18", delta: "6 critical", positive: false, color: "red" },
      { label: "Entities Monitored", value: "184", delta: "All procuring entities", positive: true, color: "blue" },
      { label: "Regulations Updated", value: "3", delta: "This quarter", positive: true, color: "orange" },
    ],
    quickActions: [
      { label: "Compliance Dashboard", desc: "Entity-wide compliance overview", icon: "BarChart3" },
      { label: "Log Exception", desc: "Record a compliance breach", icon: "AlertTriangle" },
      { label: "Issue Advisory", desc: "Send compliance guidance note", icon: "Mail" },
      { label: "Regulation Library", desc: "PPDPA and procurement regulations", icon: "BookOpen" },
      { label: "Threshold Check", desc: "Verify procurement thresholds", icon: "CheckCircle2" },
      { label: "Exemption Review", desc: "Single-source exemption requests", icon: "Eye" },
      { label: "Training Schedule", desc: "Compliance training management", icon: "Users" },
      { label: "Compliance Report", desc: "Quarterly compliance report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Exception EXC-2026-089 escalated — missing legal clearance", time: "2 hours ago", type: "warning" },
      { action: "Compliance advisory issued to Ministry of Transport", time: "Yesterday", type: "info" },
      { action: "Regulation update — PPDPA Section 12 threshold revised", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 89 }, { label: "Feb", value: 91 }, { label: "Mar", value: 90 },
      { label: "Apr", value: 92 }, { label: "May", value: 94 }, { label: "Jun", value: 93 },
    ],
    chartTitle: "Compliance Rate % (Monthly)",
    aiName: "Compliance AI",
    aiCapabilities: ["Regulatory compliance checking", "Exception triage", "Policy gap analysis", "Entity benchmarking"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  legal_officer: {
    role: "legal_officer", title: "Legal Officer", subtitle: "Contract legal review, drafting & disputes",
    department: "Legal Services", color: "bg-rose-700", accentColor: "#be123c", theme: "red",
    kpis: [
      { label: "Contracts for Review", value: "9", delta: "3 urgent", positive: false, color: "red" },
      { label: "Legal Opinions Issued", value: "24", delta: "This quarter", positive: true, color: "green" },
      { label: "Disputes Active", value: "4", delta: "2 in arbitration", positive: false, color: "amber" },
      { label: "Avg Review Time", value: "2.8 days", delta: "-0.4 days", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Review Contract", desc: "Legal review of contract draft", icon: "FileText", route: "/contracts" },
      { label: "Issue Legal Opinion", desc: "Formal legal advisory note", icon: "Gavel" },
      { label: "Dispute Register", desc: "Active contract disputes", icon: "Scale" },
      { label: "Clause Library", desc: "Standard contract clauses", icon: "BookOpen" },
      { label: "Vendor Legal Check", desc: "Vendor legal standing verification", icon: "Eye" },
      { label: "Draft Contract", desc: "Generate contract from template", icon: "Edit" },
      { label: "Arbitration Support", desc: "Arbitration case documents", icon: "Shield" },
      { label: "Export Legal Pack", desc: "Legal documentation package", icon: "Download" },
    ],
    recentActivity: [
      { action: "Legal opinion issued — single-source exemption request LO-2026-041", time: "1 hour ago", type: "info" },
      { action: "Dispute escalated to arbitration — CN-2026-0388 (Contractor claim)", time: "Yesterday", type: "error" },
      { action: "Contract reviewed and cleared — CN-2026-0420", time: "2 days ago", type: "success" },
    ],
    chartData: [
      { label: "Reviewed", value: 42 }, { label: "Approved", value: 38 }, { label: "Disputed", value: 4 },
    ],
    chartTitle: "Contract Legal Outcomes (YTD)",
    aiName: "Legal AI",
    aiCapabilities: ["Contract risk analysis", "Clause recommendation", "Dispute outcome prediction", "Regulatory compliance check"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },

  stores_officer: {
    role: "stores_officer", title: "Stores Officer", subtitle: "Inventory management, GRN & asset custody",
    department: "Stores & Warehousing", color: "bg-lime-700", accentColor: "#4d7c0f", theme: "green",
    kpis: [
      { label: "Items in Stock", value: "2,841", delta: "+124 received this week", positive: true, color: "green" },
      { label: "GRNs Issued", value: "38", delta: "This month", positive: true, color: "blue" },
      { label: "Low Stock Alerts", value: "14", delta: "Below reorder point", positive: false, color: "red" },
      { label: "Stock Value", value: "USD 1.24M", delta: "Total inventory", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Receive Goods", desc: "Issue GRN for delivery", icon: "Package", route: "/inventory/receiving" },
      { label: "Issue Stock", desc: "Process stock issue request", icon: "PackageCheck", route: "/inventory/requests" },
      { label: "Stock Count", desc: "Conduct physical stock count", icon: "ScanLine" },
      { label: "Low Stock Report", desc: "Items below reorder level", icon: "AlertTriangle" },
      { label: "Warehouse Map", desc: "View storage locations", icon: "Warehouse", route: "/inventory/warehouse" },
      { label: "Supplier Returns", desc: "Return defective goods", icon: "RefreshCcw" },
      { label: "Expiry Check", desc: "Items expiring within 30 days", icon: "Clock" },
      { label: "Inventory Report", desc: "Monthly stores report", icon: "Download" },
    ],
    recentActivity: [
      { action: "GRN issued — ARV medicines delivery (1,200 packs received)", time: "2 hours ago", type: "success" },
      { action: "Low stock alert — A4 paper below minimum level", time: "This morning", type: "warning" },
      { action: "Stock count completed — variance of 3 units found", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 28 }, { label: "Feb", value: 34 }, { label: "Mar", value: 31 },
      { label: "Apr", value: 42 }, { label: "May", value: 38 }, { label: "Jun", value: 38 },
    ],
    chartTitle: "GRNs Issued Monthly",
    aiName: "Stores AI",
    aiCapabilities: ["Auto reorder suggestions", "Expiry monitoring", "Demand forecasting", "Stock discrepancy detection"],
    subModules: [
      { label: "Inventory", route: "/inventory", icon: "Package" },
      { label: "Receiving", route: "/inventory/receiving", icon: "PackageCheck" },
      { label: "Requests", route: "/inventory/requests", icon: "ClipboardList" },
    ],
  },

  records_officer: {
    role: "records_officer", title: "Records Officer", subtitle: "Document management, archiving & lifecycle",
    department: "Administration & Records", color: "bg-green-700", accentColor: "#15803d", theme: "green",
    kpis: [
      { label: "Documents Managed", value: "14,821", delta: "+312 this month", positive: true, color: "green" },
      { label: "Files Archived", value: "284", delta: "This quarter", positive: true, color: "blue" },
      { label: "Retention Due", value: "47", delta: "Review required", positive: false, color: "amber" },
      { label: "Access Requests", value: "9", delta: "Pending approval", positive: false, color: "orange" },
    ],
    quickActions: [
      { label: "Document Vault", desc: "Secure document repository", icon: "Archive" },
      { label: "Archive Files", desc: "Move closed tenders to archive", icon: "FolderOpen" },
      { label: "Search Records", desc: "Find any procurement document", icon: "Search" },
      { label: "Access Control", desc: "Review document access log", icon: "Shield" },
      { label: "Retention Schedule", desc: "Document lifecycle management", icon: "BookOpen" },
      { label: "New Registration", desc: "Register incoming document", icon: "Plus" },
      { label: "Print Registry", desc: "Physical records registry", icon: "Printer" },
      { label: "Records Report", desc: "Records management statistics", icon: "Download" },
    ],
    recentActivity: [
      { action: "47 tender files archived — ZW-PRA-2025 series", time: "This morning", type: "success" },
      { action: "Access request REQ-2026-089 approved for audit team", time: "Yesterday", type: "info" },
      { action: "Retention review due — 47 documents flagged", time: "2 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Tenders", value: 4821 }, { label: "Contracts", value: 3412 }, { label: "Invoices", value: 2841 },
      { label: "Vendors", value: 1842 }, { label: "Reports", value: 1905 },
    ],
    chartTitle: "Documents by Category",
    aiName: "Records AI",
    aiCapabilities: ["Document classification", "Retention management", "Duplicate detection", "Access pattern monitoring"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
    ],
  },

  executive_director: {
    role: "executive_director", title: "Executive Director", subtitle: "Entity-level procurement oversight & governance",
    department: "Executive Management", color: "bg-slate-700", accentColor: "#334155", theme: "slate",
    kpis: [
      { label: "Entity Spend YTD", value: "USD 48.2M", delta: "+8% vs plan", positive: false, color: "amber" },
      { label: "Compliance Rating", value: "A-", delta: "Above national average", positive: true, color: "green" },
      { label: "Active Tenders", value: "12", delta: "3 above threshold", positive: true, color: "blue" },
      { label: "Pending Sign-offs", value: "5", delta: "Awaiting your approval", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Entity Dashboard", desc: "Overview of all entity procurement", icon: "BarChart3" },
      { label: "Approve Tenders", desc: "High-value tenders for sign-off", icon: "CheckCircle2", route: "/tenders" },
      { label: "Contract Portfolio", desc: "Entity contract register", icon: "Briefcase", route: "/contracts" },
      { label: "Vendor Performance", desc: "Vendor scorecards summary", icon: "Star" },
      { label: "Budget Status", desc: "Budget utilisation overview", icon: "DollarSign" },
      { label: "Compliance Standing", desc: "Compliance exceptions and actions", icon: "Shield" },
      { label: "Board Report", desc: "Generate board-ready report", icon: "Download" },
      { label: "Escalate Issue", desc: "Escalate to CPO or regulator", icon: "AlertTriangle" },
    ],
    recentActivity: [
      { action: "High-value tender approved — USD 8.4M IT infrastructure", time: "1 hour ago", type: "success" },
      { action: "Compliance advisory received from PRAZ", time: "Yesterday", type: "warning" },
      { action: "Q2 procurement report submitted to board", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Q1", value: 11200000, value2: 12000000 }, { label: "Q2", value: 14800000, value2: 15000000 },
      { label: "Q3", value: 12400000, value2: 13000000 }, { label: "Q4", value: 9800000, value2: 10000000 },
    ],
    chartTitle: "Procurement Spend vs Budget (Quarterly)",
    aiName: "Executive AI",
    aiCapabilities: ["Entity performance briefing", "Spend analytics", "Risk dashboard", "Compliance scoring"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  board_member: {
    role: "board_member", title: "Board Member", subtitle: "Governance oversight & strategic board functions",
    department: "Board of Directors", color: "bg-gray-700", accentColor: "#374151", theme: "slate",
    kpis: [
      { label: "Board Resolutions", value: "24", delta: "This year", positive: true, color: "green" },
      { label: "Agenda Items", value: "7", delta: "Next meeting", positive: true, color: "blue" },
      { label: "Committee Reports", value: "3", delta: "Awaiting review", positive: false, color: "amber" },
      { label: "Entity Compliance", value: "96%", delta: "Well governed", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Board Papers", desc: "Meeting agendas and papers", icon: "FileText" },
      { label: "Resolution Register", desc: "All board resolutions", icon: "BookOpen" },
      { label: "Committee Reports", desc: "Audit and procurement reports", icon: "BarChart3" },
      { label: "Entity Performance", desc: "KPI and performance review", icon: "TrendingUp" },
      { label: "Risk Register", desc: "Enterprise risk overview", icon: "Shield" },
      { label: "Governance Scorecard", desc: "Governance rating and benchmarks", icon: "Star" },
      { label: "Meeting Minutes", desc: "Previous meeting minutes", icon: "Clock" },
      { label: "Declare Interest", desc: "Conflict of interest declaration", icon: "Eye" },
    ],
    recentActivity: [
      { action: "Board resolution BR-2026-024 passed — new procurement policy", time: "1 day ago", type: "success" },
      { action: "Audit committee report submitted for review", time: "3 days ago", type: "info" },
      { action: "Annual report approved — FY 2025", time: "1 week ago", type: "success" },
    ],
    chartData: [
      { label: "Procurement", value: 96 }, { label: "Finance", value: 92 }, { label: "HR", value: 88 },
      { label: "ICT", value: 84 }, { label: "Operations", value: 90 },
    ],
    chartTitle: "Department Governance Scores (%)",
    aiName: "Governance AI",
    aiCapabilities: ["Board briefing generation", "Governance gap analysis", "Risk trend reporting", "Compliance benchmarking"],
    subModules: [
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  regulator: {
    role: "regulator", title: "Regulator — PRAZ", subtitle: "National procurement regulation & policy enforcement",
    department: "Procurement Regulatory Authority", color: "bg-zinc-800", accentColor: "#27272a", theme: "slate",
    kpis: [
      { label: "Entities Compliant", value: "172/184", delta: "93.5% compliance", positive: true, color: "green" },
      { label: "Investigations", value: "8", delta: "Active", positive: false, color: "red" },
      { label: "Suspended Vendors", value: "12", delta: "Current debarments", positive: false, color: "amber" },
      { label: "Regulations Updated", value: "4", delta: "This year", positive: true, color: "blue" },
    ],
    quickActions: [
      { label: "National Compliance", desc: "Monitor all 184 entities", icon: "BarChart3" },
      { label: "Investigation Requests", desc: "Review complaints", icon: "Search" },
      { label: "Suspension Orders", desc: "Vendor debarment management", icon: "Shield" },
      { label: "Market Intelligence", desc: "Price benchmarking", icon: "TrendingUp" },
      { label: "Regulation Register", desc: "PPDPA policy management", icon: "BookOpen" },
      { label: "Entity Audit", desc: "Schedule entity audit", icon: "Eye" },
      { label: "Advisory Notice", desc: "Issue regulatory advisory", icon: "Mail" },
      { label: "National Report", desc: "Regulatory performance report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Regulatory advisory issued to 12 non-compliant entities", time: "This morning", type: "warning" },
      { action: "Vendor debarment order issued — ZW-VEN-0441", time: "Yesterday", type: "error" },
      { action: "National threshold updated — PPDPA Regulation 4(2)", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "2021", value: 78 }, { label: "2022", value: 83 }, { label: "2023", value: 88 },
      { label: "2024", value: 91 }, { label: "2025", value: 94 }, { label: "2026", value: 93 },
    ],
    chartTitle: "National Compliance Rate by Year (%)",
    aiName: "Regulatory AI",
    aiCapabilities: ["Policy compliance monitoring", "Market analysis", "Vendor risk scoring", "Regulatory gap identification"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  system_admin: {
    role: "system_admin", title: "System Administrator", subtitle: "Platform configuration, users & infrastructure",
    department: "ICT & Digital", color: "bg-neutral-800", accentColor: "#262626", theme: "slate",
    kpis: [
      { label: "Active Users", value: "1,284", delta: "+42 this month", positive: true, color: "blue" },
      { label: "System Uptime", value: "99.97%", delta: "30-day average", positive: true, color: "green" },
      { label: "API Calls Today", value: "48,291", delta: "+12% vs yesterday", positive: true, color: "teal" },
      { label: "Security Alerts", value: "3", delta: "Needs review", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "User Management", desc: "Create, edit, deactivate users", icon: "Users" },
      { label: "Role Assignment", desc: "Assign system roles and permissions", icon: "Shield" },
      { label: "System Health", desc: "Infrastructure monitoring dashboard", icon: "Activity" },
      { label: "Security Logs", desc: "Login attempts and security events", icon: "Eye" },
      { label: "API Management", desc: "API keys, integrations, webhooks", icon: "Settings" },
      { label: "Backup Status", desc: "Data backup and recovery status", icon: "Archive" },
      { label: "IFMIS Integration", desc: "Financial system sync status", icon: "RefreshCcw" },
      { label: "System Report", desc: "Platform usage and health report", icon: "Download" },
    ],
    recentActivity: [
      { action: "New user batch created — 14 procurement officers onboarded", time: "1 hour ago", type: "success" },
      { action: "Security alert — 3 failed login attempts from unknown IP", time: "2 hours ago", type: "error" },
      { action: "System backup completed successfully", time: "Last night", type: "success" },
    ],
    chartData: [
      { label: "Mon", value: 1241 }, { label: "Tue", value: 1389 }, { label: "Wed", value: 1284 },
      { label: "Thu", value: 1402 }, { label: "Fri", value: 1156 }, { label: "Sat", value: 324 },
    ],
    chartTitle: "Daily Active Users",
    aiName: "System AI",
    aiCapabilities: ["Anomaly detection", "User behaviour analysis", "Auto-scaling recommendations", "Security threat assessment"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  ai_governance_officer: {
    role: "ai_governance_officer", title: "AI Governance Officer", subtitle: "AI model oversight, explainability & ethics",
    department: "AI & Digital Governance", color: "bg-purple-700", accentColor: "#7e22ce", theme: "violet",
    kpis: [
      { label: "AI Agents Active", value: "8", delta: "All operational", positive: true, color: "violet" },
      { label: "Avg Confidence Score", value: "94.2%", delta: "+1.1% this week", positive: true, color: "green" },
      { label: "Bias Flags", value: "2", delta: "Under review", positive: false, color: "amber" },
      { label: "Explainability Rate", value: "99.8%", delta: "All decisions logged", positive: true, color: "blue" },
    ],
    quickActions: [
      { label: "AI Agent Monitor", desc: "Real-time AI agent status", icon: "Activity" },
      { label: "Explainability Review", desc: "AI decision audit trails", icon: "Eye" },
      { label: "Bias Audit", desc: "Check AI for demographic bias", icon: "Shield" },
      { label: "Threshold Manager", desc: "AI confidence thresholds", icon: "Settings" },
      { label: "Performance Report", desc: "Monthly AI metrics", icon: "BarChart3" },
      { label: "Policy Register", desc: "AI ethics documentation", icon: "BookOpen" },
      { label: "Incident Report", desc: "Log AI anomaly or failure", icon: "AlertTriangle" },
      { label: "Model Update", desc: "Approve model retraining", icon: "RefreshCcw" },
    ],
    recentActivity: [
      { action: "AI fraud agent flagged bid rotation — confidence 97.3%", time: "2 hours ago", type: "warning" },
      { action: "Bias audit completed — no demographic bias found", time: "Yesterday", type: "success" },
      { action: "Threshold updated — auto-approval confidence raised to 96%", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Fraud AI", value: 97 }, { label: "Eval AI", value: 94 }, { label: "Contract AI", value: 96 },
      { label: "Finance AI", value: 93 }, { label: "Audit AI", value: 98 }, { label: "Comms AI", value: 91 },
    ],
    chartTitle: "AI Agent Confidence Scores (%)",
    aiName: "Meta AI",
    aiCapabilities: ["AI performance monitoring", "Explainability auditing", "Bias detection", "Ethics compliance", "Model governance"],
    subModules: [
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
    ],
  },

  data_analytics_officer: {
    role: "data_analytics_officer", title: "Data Analytics Officer", subtitle: "BI dashboards, data pipelines & reporting",
    department: "Data & Analytics", color: "bg-fuchsia-700", accentColor: "#a21caf", theme: "pink",
    kpis: [
      { label: "Reports Generated", value: "148", delta: "This month", positive: true, color: "fuchsia" },
      { label: "Data Sources", value: "24", delta: "Connected", positive: true, color: "blue" },
      { label: "Dashboard Views", value: "8,412", delta: "+23% this week", positive: true, color: "green" },
      { label: "Data Quality Score", value: "98.1%", delta: "Excellent", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Analytics Hub", desc: "National procurement BI dashboard", icon: "BarChart3", route: "/analytics" },
      { label: "Build Report", desc: "Custom report builder", icon: "FileText" },
      { label: "Data Pipeline", desc: "ETL pipeline monitoring", icon: "Activity" },
      { label: "Export Dataset", desc: "Raw data export for analysis", icon: "Download" },
      { label: "Visualisation Studio", desc: "Chart and dashboard builder", icon: "TrendingUp" },
      { label: "Scheduled Reports", desc: "Automated report schedules", icon: "Clock" },
      { label: "Anomaly Detection", desc: "Statistical outlier monitoring", icon: "Search" },
      { label: "Data Catalogue", desc: "Data dictionary and lineage", icon: "BookOpen" },
    ],
    recentActivity: [
      { action: "National procurement spend report published", time: "This morning", type: "success" },
      { action: "Data pipeline sync failed — IFMIS source timeout", time: "2 hours ago", type: "error" },
      { action: "New dashboard created — Vendor Performance Matrix", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Spend", value: 284000000 }, { label: "Tenders", value: 47 }, { label: "Contracts", value: 34 },
      { label: "Vendors", value: 1842 }, { label: "Users", value: 1284 },
    ],
    chartTitle: "Platform Data Summary",
    aiName: "Analytics AI",
    aiCapabilities: ["Predictive analytics", "Spend analysis", "Vendor benchmarking", "Anomaly detection", "Natural language queries"],
    subModules: [
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  risk_officer: {
    role: "risk_officer", title: "Risk Officer", subtitle: "Risk register, assessment & mitigation planning",
    department: "Risk Management", color: "bg-pink-700", accentColor: "#be185d", theme: "pink",
    kpis: [
      { label: "Open Risks", value: "28", delta: "7 critical", positive: false, color: "red" },
      { label: "Risks Mitigated", value: "14", delta: "This quarter", positive: true, color: "green" },
      { label: "Risk Appetite Used", value: "68%", delta: "Within tolerance", positive: true, color: "amber" },
      { label: "Risk Score", value: "Medium", delta: "Overall rating", positive: true, color: "orange" },
    ],
    quickActions: [
      { label: "Risk Register", desc: "View all enterprise risks", icon: "Shield" },
      { label: "Add Risk", desc: "Log a new identified risk", icon: "Plus" },
      { label: "Risk Assessment", desc: "Conduct risk assessment", icon: "Search" },
      { label: "Mitigation Plan", desc: "Update mitigation actions", icon: "CheckCircle2" },
      { label: "Risk Heat Map", desc: "Visual risk matrix", icon: "Activity" },
      { label: "Incident Log", desc: "Risk events and incidents", icon: "AlertTriangle" },
      { label: "Risk Appetite", desc: "Review risk tolerance levels", icon: "BarChart3" },
      { label: "Risk Report", desc: "Quarterly risk report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Critical risk RSK-2026-041 escalated — procurement fraud exposure", time: "1 hour ago", type: "error" },
      { action: "Mitigation plan updated for RSK-2026-038", time: "Yesterday", type: "success" },
      { action: "Quarterly risk review completed — 7 risks upgraded", time: "3 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Critical", value: 7 }, { label: "High", value: 10 }, { label: "Medium", value: 8 },
      { label: "Low", value: 3 },
    ],
    chartTitle: "Risk Distribution by Severity",
    aiName: "Risk AI",
    aiCapabilities: ["Risk scoring", "Trend analysis", "Scenario modelling", "Early warning alerts", "Mitigation effectiveness"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  ethics_officer: {
    role: "ethics_officer", title: "Ethics Officer", subtitle: "COI declarations, ethics register & conduct",
    department: "Ethics & Integrity", color: "bg-rose-600", accentColor: "#e11d48", theme: "red",
    kpis: [
      { label: "COI Declarations", value: "241", delta: "98.7% compliant", positive: true, color: "green" },
      { label: "Ethics Complaints", value: "6", delta: "3 under review", positive: false, color: "red" },
      { label: "Ethics Training", value: "87%", delta: "Staff completion rate", positive: true, color: "blue" },
      { label: "Disclosures Pending", value: "12", delta: "Follow-up needed", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "COI Register", desc: "Conflict of interest declarations", icon: "Eye" },
      { label: "Ethics Complaints", desc: "Manage ethics complaints", icon: "AlertTriangle" },
      { label: "Disclosure Review", desc: "Review pending disclosures", icon: "FileText" },
      { label: "Code of Conduct", desc: "Ethics policy documentation", icon: "BookOpen" },
      { label: "Training Records", desc: "Ethics training completion", icon: "Users" },
      { label: "Whistleblower Portal", desc: "Anonymous tip management", icon: "Lock" },
      { label: "Ethics Advisory", desc: "Issue ethics guidance note", icon: "Mail" },
      { label: "Ethics Report", desc: "Quarterly ethics report", icon: "Download" },
    ],
    recentActivity: [
      { action: "COI flag resolved — evaluator EVL-091 removed from panel", time: "2 hours ago", type: "success" },
      { action: "Ethics complaint received — EC-2026-018 under review", time: "Yesterday", type: "warning" },
      { action: "Ethics training completed — 42 staff this week", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Q1", value: 96 }, { label: "Q2", value: 97 }, { label: "Q3", value: 98 }, { label: "Q4", value: 99 },
    ],
    chartTitle: "COI Compliance Rate by Quarter (%)",
    aiName: "Ethics AI",
    aiCapabilities: ["COI pattern detection", "Ethics risk scoring", "Complaint triage", "Conduct analysis"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
    ],
  },

  qa_officer: {
    role: "qa_officer", title: "Quality Assurance Officer", subtitle: "Standards compliance, quality inspections & testing",
    department: "Quality Assurance", color: "bg-sky-700", accentColor: "#0369a1", theme: "blue",
    kpis: [
      { label: "Inspections Done", value: "84", delta: "This month", positive: true, color: "blue" },
      { label: "Non-Conformances", value: "11", delta: "3 critical", positive: false, color: "red" },
      { label: "Pass Rate", value: "86.9%", delta: "+2.4% vs last month", positive: true, color: "green" },
      { label: "Pending Certs", value: "7", delta: "Awaiting test results", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Inspection Log", desc: "Log quality inspection result", icon: "CheckCircle2" },
      { label: "QA Checklists", desc: "Access QA checklists", icon: "ClipboardList" },
      { label: "NCR Register", desc: "Non-conformance records", icon: "AlertTriangle" },
      { label: "Quality Ratings", desc: "Vendor quality scorecards", icon: "Star" },
      { label: "Test Certificates", desc: "Manage product certificates", icon: "Archive" },
      { label: "Defect Analysis", desc: "Defect trend by vendor", icon: "BarChart3" },
      { label: "ISO Standards", desc: "Standards reference library", icon: "BookOpen" },
      { label: "QA Report", desc: "Monthly quality report", icon: "Download" },
    ],
    recentActivity: [
      { action: "NCR raised — defective medical equipment batch QA-NCR-2026-041", time: "1 hour ago", type: "error" },
      { action: "Inspection passed — pharmaceutical delivery ZW-PHA-0892", time: "3 hours ago", type: "success" },
      { action: "Quality rating updated — Highveld Engineering 4.8/5", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 82 }, { label: "Feb", value: 84 }, { label: "Mar", value: 85 },
      { label: "Apr", value: 83 }, { label: "May", value: 87 }, { label: "Jun", value: 87 },
    ],
    chartTitle: "Monthly Quality Pass Rate (%)",
    aiName: "QA AI",
    aiCapabilities: ["Defect pattern analysis", "Vendor quality scoring", "NCR classification", "Standards compliance checking"],
    subModules: [
      { label: "Inventory", route: "/inventory", icon: "Package" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },

  inspection_officer: {
    role: "inspection_officer", title: "Inspection Officer", subtitle: "On-site delivery inspection & GRN certification",
    department: "Inspection & Certification", color: "bg-blue-600", accentColor: "#2563eb", theme: "blue",
    kpis: [
      { label: "Inspections Scheduled", value: "6", delta: "Today", positive: true, color: "blue" },
      { label: "GRNs Certified", value: "42", delta: "This month", positive: true, color: "green" },
      { label: "Deliveries Rejected", value: "4", delta: "Non-conforming", positive: false, color: "red" },
      { label: "Outstanding Reports", value: "3", delta: "Need completion", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Today's Schedule", desc: "Planned inspections for today", icon: "Calendar" },
      { label: "Certify Delivery", desc: "Issue acceptance certificate", icon: "CheckCircle2", route: "/inventory/receiving" },
      { label: "Reject Delivery", desc: "Document non-conforming goods", icon: "X" },
      { label: "Site Report", desc: "Write inspection report", icon: "FileText" },
      { label: "Quantity Check", desc: "Verify delivered quantities", icon: "Package" },
      { label: "Photo Evidence", desc: "Upload inspection photos", icon: "Image" },
      { label: "Defect Trends", desc: "Historical defect analysis", icon: "BarChart3" },
      { label: "Export Report", desc: "Export inspection summary", icon: "Download" },
    ],
    recentActivity: [
      { action: "Delivery certified — medical supplies batch MED-2026-084", time: "1 hour ago", type: "success" },
      { action: "Delivery rejected — 240 defective surgical gloves (INSP-2026-092)", time: "3 hours ago", type: "error" },
      { action: "Site inspection completed — Harare Water Plant (96% compliant)", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Week 1", value: 12, value2: 1 }, { label: "Week 2", value: 10, value2: 2 },
      { label: "Week 3", value: 14, value2: 0 }, { label: "Week 4", value: 11, value2: 1 },
    ],
    chartTitle: "Deliveries Accepted vs Rejected (Weekly)",
    aiName: "Inspection AI",
    aiCapabilities: ["Delivery verification", "Defect detection", "Quantity cross-check", "Report auto-generation"],
    subModules: [
      { label: "Inventory", route: "/inventory/receiving", icon: "Package" },
    ],
  },

  asset_manager: {
    role: "asset_manager", title: "Asset Manager", subtitle: "Government asset register, disposal & lifecycle",
    department: "Asset Management", color: "bg-indigo-700", accentColor: "#4338ca", theme: "indigo",
    kpis: [
      { label: "Total Assets", value: "14,284", delta: "+124 this month", positive: true, color: "indigo" },
      { label: "Asset Value", value: "USD 142M", delta: "Net book value", positive: true, color: "green" },
      { label: "Under Maintenance", value: "38", delta: "Across all entities", positive: false, color: "amber" },
      { label: "Disposal Due", value: "12", delta: "Review needed", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Asset Register", desc: "Full government asset register", icon: "Archive", route: "/assets" },
      { label: "Capture Asset", desc: "Register new asset", icon: "Plus", route: "/assets" },
      { label: "Maintenance Schedule", desc: "Preventive maintenance", icon: "Wrench", route: "/assets/workorders" },
      { label: "Disposal Management", desc: "Auction/write-off processing", icon: "Trash2" },
      { label: "Asset Transfer", desc: "Inter-department transfers", icon: "ArrowRight", route: "/assets/transfers" },
      { label: "Verification", desc: "Annual asset verification", icon: "Search" },
      { label: "Depreciation Report", desc: "Current asset valuations", icon: "BarChart3" },
      { label: "Asset Report", desc: "Full asset management report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Asset captured — Dell PowerEdge R750 Server (USD 24,800)", time: "2 hours ago", type: "success" },
      { action: "Maintenance order raised — Caterpillar 320 excavator (critical)", time: "Yesterday", type: "warning" },
      { action: "Asset disposal approved — 12 obsolete vehicles (USD 148K)", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Vehicles", value: 2841 }, { label: "IT Equip", value: 4124 }, { label: "Machinery", value: 1284 },
      { label: "Buildings", value: 842 }, { label: "Furniture", value: 5193 },
    ],
    chartTitle: "Assets by Category",
    aiName: "Asset AI",
    aiCapabilities: ["Lifecycle prediction", "Maintenance scheduling", "Depreciation calculation", "Disposal recommendation"],
    subModules: [
      { label: "Assets", route: "/assets", icon: "Archive" },
      { label: "Work Orders", route: "/assets/workorders", icon: "Wrench" },
      { label: "Transfers", route: "/assets/transfers", icon: "ArrowRight" },
    ],
  },

  budget_officer: {
    role: "budget_officer", title: "Budget Officer", subtitle: "Budget management, commitments & expenditure control",
    department: "Finance & Budget", color: "bg-emerald-600", accentColor: "#059669", theme: "emerald",
    kpis: [
      { label: "Total Budget", value: "USD 284M", delta: "FY 2026 allocation", positive: true, color: "green" },
      { label: "Committed", value: "USD 182M", delta: "64.1% utilised", positive: true, color: "blue" },
      { label: "Available Balance", value: "USD 102M", delta: "35.9% remaining", positive: true, color: "emerald" },
      { label: "Overruns", value: "3", delta: "Departments over budget", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Budget Dashboard", desc: "Department-wise budget status", icon: "BarChart3" },
      { label: "Commit Budget", desc: "Record new budget commitment", icon: "DollarSign" },
      { label: "Budget Transfer", desc: "Virement between lines", icon: "ArrowRight" },
      { label: "Overrun Report", desc: "Departments over budget", icon: "AlertTriangle" },
      { label: "Supplementary Budget", desc: "Submit for additional funding", icon: "Plus" },
      { label: "Budget vs Actual", desc: "Variance analysis report", icon: "TrendingUp" },
      { label: "MTEF Submission", desc: "Medium-term estimate upload", icon: "Upload" },
      { label: "Budget Report", desc: "Monthly budget statement", icon: "Download" },
    ],
    recentActivity: [
      { action: "Budget commitment recorded — USD 2.4M IT infrastructure", time: "1 hour ago", type: "success" },
      { action: "Budget overrun alert — IT Department (108%)", time: "Yesterday", type: "warning" },
      { action: "Supplementary allocation approved — Ministry of Health +USD 12M", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "MOF", value: 84, value2: 54 }, { label: "MOH", value: 72, value2: 68 },
      { label: "MOT", value: 48, value2: 52 }, { label: "MOE", value: 36, value2: 31 },
      { label: "MOA", value: 24, value2: 21 }, { label: "ICT", value: 20, value2: 22 },
    ],
    chartTitle: "Budget vs Actual by Ministry (USD M)",
    aiName: "Budget AI",
    aiCapabilities: ["Expenditure forecasting", "Variance analysis", "Overrun early warning", "MTEF support"],
    subModules: [
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
      { label: "Invoices", route: "/invoices", icon: "DollarSign" },
    ],
  },

  treasury_officer: {
    role: "treasury_officer", title: "Treasury Officer", subtitle: "Cash management, payment authorisation & banking",
    department: "Treasury Operations", color: "bg-green-600", accentColor: "#16a34a", theme: "green",
    kpis: [
      { label: "Cash Position", value: "USD 24.1M", delta: "Available balance", positive: true, color: "green" },
      { label: "Payments Today", value: "28", delta: "Total USD 4.2M", positive: true, color: "blue" },
      { label: "Payment Queue", value: "14", delta: "Pending authorisation", positive: false, color: "amber" },
      { label: "Overdraft Risk", value: "Low", delta: "Within limits", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Authorise Payments", desc: "Approve payment batch", icon: "CheckCircle2" },
      { label: "Cash Flow Forecast", desc: "30-day cash projection", icon: "TrendingUp" },
      { label: "Bank Reconciliation", desc: "Reconcile bank statements", icon: "RefreshCcw" },
      { label: "Payment Schedule", desc: "Planned payment calendar", icon: "Calendar" },
      { label: "Treasury Report", desc: "Daily cash position report", icon: "BarChart3" },
      { label: "Investment Register", desc: "Short-term investments", icon: "DollarSign" },
      { label: "Forex Management", desc: "Foreign currency tracking", icon: "Globe2" },
      { label: "Export Statement", desc: "Bank statement export", icon: "Download" },
    ],
    recentActivity: [
      { action: "Payment batch authorised — 28 invoices (USD 4.2M)", time: "1 hour ago", type: "success" },
      { action: "Bank reconciliation completed — 2 unmatched transactions", time: "This morning", type: "warning" },
      { action: "Cash flow warning — projected shortfall in 2 weeks", time: "Yesterday", type: "error" },
    ],
    chartData: [
      { label: "Mon", value: 3200000 }, { label: "Tue", value: 4800000 }, { label: "Wed", value: 2100000 },
      { label: "Thu", value: 5400000 }, { label: "Fri", value: 4200000 },
    ],
    chartTitle: "Daily Payment Volumes (USD)",
    aiName: "Treasury AI",
    aiCapabilities: ["Cash flow forecasting", "Payment scheduling", "Forex risk analysis", "Reconciliation support"],
    subModules: [
      { label: "Invoices", route: "/invoices", icon: "DollarSign" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  end_user: {
    role: "end_user", title: "End User / Requisitioner", subtitle: "Submit purchase requisitions & track requests",
    department: "Requesting Department", color: "bg-teal-700", accentColor: "#0f766e", theme: "teal",
    kpis: [
      { label: "My Requisitions", value: "8", delta: "3 pending approval", positive: false, color: "amber" },
      { label: "Approved This Month", value: "5", delta: "Fulfilled", positive: true, color: "green" },
      { label: "Avg Processing Time", value: "3.2 days", delta: "Within SLA", positive: true, color: "blue" },
      { label: "Rejected", value: "1", delta: "Budget exceeded", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Raise Requisition", desc: "Submit new purchase request", icon: "Plus" },
      { label: "Track Requests", desc: "Status of my requisitions", icon: "Search" },
      { label: "Product Catalogue", desc: "Browse approved items", icon: "Package" },
      { label: "My Budget", desc: "Departmental budget allocation", icon: "DollarSign" },
      { label: "Receiving Schedule", desc: "Expected deliveries for me", icon: "Package" },
      { label: "Supplier Feedback", desc: "Rate delivered goods", icon: "Star" },
      { label: "Help Desk", desc: "Procurement support query", icon: "Headphones" },
      { label: "Download Forms", desc: "Procurement request forms", icon: "Download" },
    ],
    recentActivity: [
      { action: "Requisition REQ-2026-0481 approved — Office stationery Q3", time: "2 hours ago", type: "success" },
      { action: "Delivery received — printer cartridges (5 units)", time: "Yesterday", type: "success" },
      { action: "Requisition REQ-2026-0479 rejected — budget exceeded", time: "2 days ago", type: "error" },
    ],
    chartData: [
      { label: "Apr", value: 3 }, { label: "May", value: 5 }, { label: "Jun", value: 8 },
    ],
    chartTitle: "My Requisitions by Month",
    aiName: "Procurement Assistant",
    aiCapabilities: ["Requisition drafting", "Budget checking", "Supplier recommendations", "Status tracking"],
    subModules: [
      { label: "Inventory", route: "/inventory/requests", icon: "Package" },
    ],
  },

  sme_supplier: {
    role: "sme_supplier", title: "SME Supplier", subtitle: "Small business portal — bids, contracts & invoices",
    department: "Supplier Portal", color: "bg-cyan-600", accentColor: "#0891b2", theme: "cyan",
    kpis: [
      { label: "Open Tenders", value: "12", delta: "I qualify for", positive: true, color: "blue" },
      { label: "Active Bids", value: "3", delta: "Under evaluation", positive: true, color: "amber" },
      { label: "Contracts Won", value: "2", delta: "This year", positive: true, color: "green" },
      { label: "Outstanding Invoices", value: "USD 84K", delta: "Pending payment", positive: false, color: "orange" },
    ],
    quickActions: [
      { label: "Browse Tenders", desc: "Find tenders I qualify for", icon: "Search", route: "/tenders" },
      { label: "Submit Bid", desc: "Upload bid documents", icon: "Upload" },
      { label: "My Bids", desc: "Track bid status", icon: "FileText" },
      { label: "My Contracts", desc: "Active contract details", icon: "Briefcase", route: "/contracts" },
      { label: "Submit Invoice", desc: "Upload invoice for payment", icon: "DollarSign" },
      { label: "Track Payment", desc: "Payment status and ETA", icon: "Clock" },
      { label: "Compliance Docs", desc: "Upload required certifications", icon: "CheckCircle2" },
      { label: "Get Support", desc: "Supplier helpdesk", icon: "Headphones" },
    ],
    recentActivity: [
      { action: "Bid submitted — ZW-PRA-2026-00184 Solar Mini-Grids", time: "2 hours ago", type: "success" },
      { action: "Invoice INV-SUP-0284 submitted for payment", time: "Yesterday", type: "info" },
      { action: "Compliance document expired — renew AGPO certificate", time: "3 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Submitted", value: 8 }, { label: "Shortlisted", value: 4 }, { label: "Won", value: 2 },
    ],
    chartTitle: "Bid Outcomes (This Year)",
    aiName: "Supplier AI",
    aiCapabilities: ["Tender matching", "Bid preparation support", "Compliance checklist", "Payment tracking"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
    ],
  },

  contract_officer: {
    role: "contract_officer", title: "Contract Officer", subtitle: "Contract drafting, execution & close-out",
    department: "Contract Management Unit", color: "bg-amber-600", accentColor: "#d97706", theme: "amber",
    kpis: [
      { label: "Contracts Drafted", value: "14", delta: "This quarter", positive: true, color: "amber" },
      { label: "Pending Signature", value: "5", delta: "Awaiting parties", positive: false, color: "red" },
      { label: "Active Contracts", value: "28", delta: "Under monitoring", positive: true, color: "blue" },
      { label: "Closed This Month", value: "3", delta: "Successfully", positive: true, color: "green" },
    ],
    quickActions: [
      { label: "Draft Contract", desc: "Generate from template", icon: "Edit", route: "/contracts" },
      { label: "My Contracts", desc: "View assigned contracts", icon: "FileText", route: "/contracts" },
      { label: "Signature Tracking", desc: "Pending signatures status", icon: "Eye" },
      { label: "Send for Signature", desc: "Dispatch for signing", icon: "Mail" },
      { label: "Contract Clauses", desc: "Clause library", icon: "BookOpen" },
      { label: "Log Variation", desc: "Record contract variation", icon: "Edit" },
      { label: "Close Contract", desc: "Formally close contract", icon: "Archive" },
      { label: "Export Pack", desc: "Contract documentation pack", icon: "Download" },
    ],
    recentActivity: [
      { action: "Contract CN-2026-0420 sent for signature — Infrastructure project", time: "1 hour ago", type: "info" },
      { action: "Contract CN-2026-0418 signed by all parties", time: "Yesterday", type: "success" },
      { action: "Contract CN-2026-0411 variation logged — scope extension", time: "2 days ago", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 4 }, { label: "Feb", value: 5 }, { label: "Mar", value: 3 },
      { label: "Apr", value: 6 }, { label: "May", value: 4 }, { label: "Jun", value: 5 },
    ],
    chartTitle: "Contracts Drafted Monthly",
    aiName: "Contract AI",
    aiCapabilities: ["Contract template generation", "Clause recommendation", "Risk identification", "Expiry alerts"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
    ],
  },

  vendor_user: {
    role: "vendor_user", title: "Vendor Portal User", subtitle: "Vendor self-service — profile, bids & invoices",
    department: "Vendor Portal", color: "bg-orange-600", accentColor: "#ea580c", theme: "orange",
    kpis: [
      { label: "Open Tenders", value: "18", delta: "Available to bid", positive: true, color: "orange" },
      { label: "My Bids Submitted", value: "7", delta: "3 in evaluation", positive: true, color: "blue" },
      { label: "Contracts Active", value: "1", delta: "In delivery", positive: true, color: "green" },
      { label: "Invoices Pending", value: "2", delta: "USD 124K outstanding", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Find Tenders", desc: "Browse available tenders", icon: "Search", route: "/tenders" },
      { label: "Submit Bid", desc: "Upload and submit bid", icon: "Upload" },
      { label: "My Bids", desc: "Track submitted bids", icon: "FileText" },
      { label: "My Contracts", desc: "Active contract details", icon: "Briefcase" },
      { label: "Submit Invoice", desc: "Create and submit invoice", icon: "DollarSign" },
      { label: "Update Profile", desc: "Vendor registration details", icon: "User" },
      { label: "Upload Docs", desc: "Certifications and compliance", icon: "Upload" },
      { label: "Helpdesk", desc: "Vendor support center", icon: "Headphones" },
    ],
    recentActivity: [
      { action: "Bid shortlisted — ZW-PRA-2026-00182 National Tax System", time: "This morning", type: "success" },
      { action: "Invoice payment processed — USD 2.84M (INV-2026-4821)", time: "Yesterday", type: "success" },
      { action: "Compliance document reminder — Tax clearance expiring in 14 days", time: "2 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Submitted", value: 12 }, { label: "Shortlisted", value: 6 }, { label: "Won", value: 3 }, { label: "Lost", value: 3 },
    ],
    chartTitle: "Bid Performance Summary",
    aiName: "Vendor AI",
    aiCapabilities: ["Tender matching", "Bid competitiveness scoring", "Compliance reminder", "Payment tracking"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
    ],
  },

  citizen: {
    role: "citizen", title: "Citizen Observer", subtitle: "Public transparency access & feedback",
    department: "Public Portal", color: "bg-lime-600", accentColor: "#65a30d", theme: "green",
    kpis: [
      { label: "Published Tenders", value: "47", delta: "Currently open", positive: true, color: "green" },
      { label: "Awards Published", value: "284", delta: "This year", positive: true, color: "blue" },
      { label: "Total Spend Published", value: "USD 1.2B", delta: "FY 2026", positive: true, color: "teal" },
      { label: "Open Data Reports", value: "18", delta: "Available for download", positive: true, color: "lime" },
    ],
    quickActions: [
      { label: "Browse Tenders", desc: "All publicly advertised tenders", icon: "Search", route: "/tenders" },
      { label: "Contract Awards", desc: "See who won what contracts", icon: "Gavel" },
      { label: "Spend Data", desc: "Government procurement spending", icon: "BarChart3", route: "/analytics" },
      { label: "Download Open Data", desc: "CSV/Excel open datasets", icon: "Download" },
      { label: "Submit Feedback", desc: "Report a concern or feedback", icon: "MessageSquare" },
      { label: "Supplier Register", desc: "Approved government suppliers", icon: "Users", route: "/vendors" },
      { label: "Public Reports", desc: "Auditor-General reports", icon: "FileText" },
      { label: "Contact Us", desc: "Enquiries to PRAZ", icon: "Mail" },
    ],
    recentActivity: [
      { action: "New award published — Beitbridge Highway Phase 3 (USD 71M)", time: "2 hours ago", type: "info" },
      { action: "Quarterly procurement report published — Q2 2026", time: "Yesterday", type: "info" },
      { action: "New tender published — Solar Mini-Grids (USD 14.8M)", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Infrastructure", value: 42 }, { label: "Health", value: 28 }, { label: "ICT", value: 15 },
      { label: "Education", value: 12 }, { label: "Agriculture", value: 8 },
    ],
    chartTitle: "Government Spend by Sector (%)",
    aiName: "Public Information AI",
    aiCapabilities: ["Tender search", "Spending transparency", "Feedback submission", "Open data access"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  public_auditor: {
    role: "public_auditor", title: "Public Auditor", subtitle: "External audit, public accounts & transparency",
    department: "Office of the Auditor-General", color: "bg-slate-600", accentColor: "#475569", theme: "slate",
    kpis: [
      { label: "Audit Files Open", value: "12", delta: "FY 2026", positive: true, color: "blue" },
      { label: "Findings Issued", value: "48", delta: "This audit cycle", positive: true, color: "amber" },
      { label: "Adverse Opinions", value: "4", delta: "Entities", positive: false, color: "red" },
      { label: "Clean Opinions", value: "28", delta: "Well-managed entities", positive: true, color: "green" },
    ],
    quickActions: [
      { label: "Audit Files", desc: "Active entity audit files", icon: "Archive" },
      { label: "Issue Finding", desc: "Log formal audit finding", icon: "AlertTriangle" },
      { label: "Audit Opinion", desc: "Issue audit opinion letter", icon: "FileText" },
      { label: "Entity Access", desc: "Access entity transaction data", icon: "Eye" },
      { label: "Evidence Package", desc: "Manage audit evidence", icon: "Shield" },
      { label: "Interview Record", desc: "Document auditee response", icon: "MessageSquare" },
      { label: "Annual Report", desc: "Auditor-General annual report", icon: "BookOpen" },
      { label: "Export Findings", desc: "Export findings to parliament", icon: "Download" },
    ],
    recentActivity: [
      { action: "Adverse opinion issued — Ministry of Transport procurement irregularities", time: "Yesterday", type: "error" },
      { action: "Audit evidence collected — 284 transactions sampled", time: "2 days ago", type: "info" },
      { action: "Clean opinion issued — Ministry of Finance FY 2025", time: "1 week ago", type: "success" },
    ],
    chartData: [
      { label: "Clean", value: 28 }, { label: "Modified", value: 8 }, { label: "Qualified", value: 6 },
      { label: "Adverse", value: 4 }, { label: "Disclaimer", value: 2 },
    ],
    chartTitle: "Audit Opinion Types (FY 2026)",
    aiName: "Audit AI",
    aiCapabilities: ["Audit sampling", "Finding classification", "Materiality assessment", "Anomaly detection"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  planning_officer: {
    role: "planning_officer", title: "Planning Officer", subtitle: "Demand planning, procurement calendar & strategy",
    department: "Strategy & Planning", color: "bg-violet-700", accentColor: "#6d28d9", theme: "violet",
    kpis: [
      { label: "Plans Approved", value: "18", delta: "This year", positive: true, color: "violet" },
      { label: "Demand Forecasts", value: "42", delta: "Items planned", positive: true, color: "blue" },
      { label: "Calendar Coverage", value: "84%", delta: "FY 2027 planned", positive: true, color: "green" },
      { label: "Unplanned Requests", value: "11", delta: "Emergency purchases", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Procurement Plan", desc: "Annual procurement plan", icon: "Calendar" },
      { label: "Demand Forecast", desc: "Demand analysis by category", icon: "TrendingUp" },
      { label: "Category Strategy", desc: "Category management plans", icon: "Briefcase" },
      { label: "Budget Alignment", desc: "Plan vs budget check", icon: "DollarSign" },
      { label: "Market Survey", desc: "Supplier market research", icon: "Search" },
      { label: "Risk Assessment", desc: "Supply chain risk assessment", icon: "Shield" },
      { label: "Add Plan Item", desc: "Add new procurement item to plan", icon: "Plus" },
      { label: "Export Plan", desc: "Download procurement calendar", icon: "Download" },
    ],
    recentActivity: [
      { action: "FY 2027 procurement plan submitted for approval", time: "2 hours ago", type: "info" },
      { action: "Demand forecast updated — pharmaceutical category", time: "Yesterday", type: "success" },
      { action: "Emergency purchase flagged — outside procurement plan", time: "3 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Q1", value: 12400000, value2: 11800000 }, { label: "Q2", value: 14800000, value2: 13200000 },
      { label: "Q3", value: 11200000, value2: 12000000 }, { label: "Q4", value: 8800000, value2: 9400000 },
    ],
    chartTitle: "Planned vs Actual Procurement (USD)",
    aiName: "Planning AI",
    aiCapabilities: ["Demand forecasting", "Category analysis", "Supply risk assessment", "Plan optimisation"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  communications_officer: {
    role: "communications_officer", title: "Communications Officer", subtitle: "Tender publications, notices & public communications",
    department: "Communications & Public Relations", color: "bg-purple-600", accentColor: "#9333ea", theme: "violet",
    kpis: [
      { label: "Notices Published", value: "28", delta: "This month", positive: true, color: "purple" },
      { label: "Supplier Notified", value: "1,284", delta: "Email/SMS sent", positive: true, color: "blue" },
      { label: "Media Queries", value: "4", delta: "Awaiting response", positive: false, color: "amber" },
      { label: "Publications Pending", value: "3", delta: "For your action", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Publish Notice", desc: "Tender advertisement publish", icon: "Globe2" },
      { label: "Draft Award Notice", desc: "Contract award publication", icon: "FileText" },
      { label: "Supplier Blast", desc: "Mass notification to suppliers", icon: "Mail" },
      { label: "Social Media Post", desc: "Post to official channels", icon: "Share" },
      { label: "Media Response", desc: "Draft media statement", icon: "MessageSquare" },
      { label: "Notice Archive", desc: "All published notices", icon: "Archive" },
      { label: "Manage Channels", desc: "Publication platforms", icon: "Settings" },
      { label: "Coverage Report", desc: "Media coverage tracking", icon: "Download" },
    ],
    recentActivity: [
      { action: "Award notice published — Beitbridge Highway Phase 3", time: "1 hour ago", type: "success" },
      { action: "Supplier notification sent — 18 new tenders (1,284 suppliers)", time: "This morning", type: "info" },
      { action: "Media query responded — transparency about solar project", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Jan", value: 18 }, { label: "Feb", value: 22 }, { label: "Mar", value: 19 },
      { label: "Apr", value: 24 }, { label: "May", value: 21 }, { label: "Jun", value: 28 },
    ],
    chartTitle: "Notices Published Monthly",
    aiName: "Comms AI",
    aiCapabilities: ["Notice drafting", "Supplier targeting", "Media monitoring", "Publication scheduling"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
    ],
  },

  performance_officer: {
    role: "performance_officer", title: "Performance Officer", subtitle: "KPIs, vendor scorecards & performance management",
    department: "Performance Management", color: "bg-fuchsia-600", accentColor: "#c026d3", theme: "pink",
    kpis: [
      { label: "Vendors Rated", value: "284", delta: "This quarter", positive: true, color: "fuchsia" },
      { label: "Avg Vendor Score", value: "4.2/5", delta: "Excellent rating", positive: true, color: "green" },
      { label: "SLA Breaches", value: "14", delta: "Escalated", positive: false, color: "red" },
      { label: "KPIs On Track", value: "84%", delta: "+2% this quarter", positive: true, color: "blue" },
    ],
    quickActions: [
      { label: "Vendor Scorecards", desc: "Rate and review suppliers", icon: "Star" },
      { label: "KPI Dashboard", desc: "Entity performance KPIs", icon: "BarChart3" },
      { label: "SLA Tracker", desc: "Service level agreement monitoring", icon: "Clock" },
      { label: "Performance Review", desc: "Quarterly performance meeting", icon: "Users" },
      { label: "Improvement Plan", desc: "Vendor improvement actions", icon: "TrendingUp" },
      { label: "Blacklist Request", desc: "Request vendor debarment", icon: "Shield" },
      { label: "Incentive Register", desc: "Reward high-performing vendors", icon: "Award" },
      { label: "Performance Report", desc: "Quarterly performance summary", icon: "Download" },
    ],
    recentActivity: [
      { action: "Vendor Highveld Engineering rated 4.8/5 — Beitbridge project", time: "2 hours ago", type: "success" },
      { action: "SLA breach recorded — Sable ICT delivery 12 days late", time: "Yesterday", type: "warning" },
      { action: "Performance report issued — Q2 2026", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "5 Stars", value: 84 }, { label: "4 Stars", value: 124 }, { label: "3 Stars", value: 48 },
      { label: "2 Stars", value: 18 }, { label: "1 Star", value: 10 },
    ],
    chartTitle: "Vendor Rating Distribution",
    aiName: "Performance AI",
    aiCapabilities: ["Vendor scoring", "SLA monitoring", "Performance trend analysis", "Debarment recommendation"],
    subModules: [
      { label: "Vendors", route: "/vendors", icon: "Users" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  it_officer: {
    role: "it_officer", title: "IT Officer", subtitle: "System support, integration & digital services",
    department: "ICT Department", color: "bg-pink-600", accentColor: "#db2777", theme: "pink",
    kpis: [
      { label: "Support Tickets", value: "34", delta: "12 open", positive: false, color: "red" },
      { label: "System Uptime", value: "99.9%", delta: "30 days", positive: true, color: "green" },
      { label: "Integrations", value: "8", delta: "All connected", positive: true, color: "blue" },
      { label: "Pending Requests", value: "6", delta: "ICT requests", positive: false, color: "amber" },
    ],
    quickActions: [
      { label: "Support Tickets", desc: "Manage open IT support tickets", icon: "Headphones" },
      { label: "System Status", desc: "Platform health monitoring", icon: "Activity" },
      { label: "User Management", desc: "Account and access support", icon: "Users" },
      { label: "Integration Monitor", desc: "IFMIS, ZIMRA and API status", icon: "RefreshCcw" },
      { label: "Security Scan", desc: "Vulnerability assessment", icon: "Shield" },
      { label: "Backup Monitor", desc: "Backup jobs and recovery", icon: "Archive" },
      { label: "Change Request", desc: "System change management", icon: "Edit" },
      { label: "IT Report", desc: "Monthly IT operations report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Critical ticket IT-2026-0481 resolved — login failure for 12 users", time: "1 hour ago", type: "success" },
      { action: "IFMIS integration timeout — investigating connection issue", time: "3 hours ago", type: "error" },
      { action: "Software update deployed — APPIIOMS v2.4.1", time: "Yesterday", type: "info" },
    ],
    chartData: [
      { label: "Mon", value: 8 }, { label: "Tue", value: 12 }, { label: "Wed", value: 6 },
      { label: "Thu", value: 9 }, { label: "Fri", value: 11 }, { label: "Sat", value: 3 },
    ],
    chartTitle: "Support Tickets by Day",
    aiName: "IT AI",
    aiCapabilities: ["Incident auto-classification", "Root cause analysis", "Security threat detection", "SLA prediction"],
    subModules: [
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
    ],
  },

  logistics_officer: {
    role: "logistics_officer", title: "Logistics Officer", subtitle: "Delivery coordination, dispatch & warehousing",
    department: "Logistics & Supply Chain", color: "bg-sky-600", accentColor: "#0284c7", theme: "blue",
    kpis: [
      { label: "Deliveries In Transit", value: "18", delta: "Tracked", positive: true, color: "blue" },
      { label: "On-Time Rate", value: "88.2%", delta: "+2.1% this month", positive: true, color: "green" },
      { label: "Pending Dispatches", value: "6", delta: "Schedule today", positive: false, color: "amber" },
      { label: "Delivery Issues", value: "3", delta: "Delays reported", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Track Deliveries", desc: "Real-time delivery tracker", icon: "Map", route: "/inventory/receiving" },
      { label: "Dispatch Goods", desc: "Plan and confirm dispatch", icon: "Package", route: "/inventory/requests" },
      { label: "Warehouse View", desc: "Current stock by location", icon: "Warehouse", route: "/inventory/warehouse" },
      { label: "Log Issue", desc: "Report delivery problem", icon: "AlertTriangle" },
      { label: "Route Planning", desc: "Optimise delivery routes", icon: "Map" },
      { label: "Delivery Performance", desc: "On-time delivery stats", icon: "BarChart3" },
      { label: "Transport Fleet", desc: "Government fleet management", icon: "Truck" },
      { label: "Logistics Report", desc: "Monthly logistics report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Delivery confirmed — medical supplies to Masvingo Hospital", time: "1 hour ago", type: "success" },
      { action: "Delivery delay logged — Beitbridge construction materials (2 days)", time: "3 hours ago", type: "warning" },
      { action: "Dispatch completed — 8 locations covered today", time: "Yesterday", type: "success" },
    ],
    chartData: [
      { label: "Mon", value: 4, value2: 1 }, { label: "Tue", value: 6, value2: 0 },
      { label: "Wed", value: 5, value2: 1 }, { label: "Thu", value: 8, value2: 0 },
      { label: "Fri", value: 7, value2: 1 }, { label: "Sat", value: 2, value2: 0 },
    ],
    chartTitle: "Deliveries On-Time vs Delayed (Weekly)",
    aiName: "Logistics AI",
    aiCapabilities: ["Route optimisation", "Delivery ETAs", "Delay prediction", "Fleet utilisation"],
    subModules: [
      { label: "Inventory", route: "/inventory", icon: "Package" },
      { label: "Receiving", route: "/inventory/receiving", icon: "PackageCheck" },
    ],
  },

  health_safety_officer: {
    role: "health_safety_officer", title: "Health & Safety Officer", subtitle: "HSE compliance in contracts & site safety",
    department: "Health, Safety & Environment", color: "bg-red-600", accentColor: "#dc2626", theme: "red",
    kpis: [
      { label: "HSE Inspections", value: "24", delta: "This quarter", positive: true, color: "blue" },
      { label: "Incidents Reported", value: "6", delta: "2 LTI", positive: false, color: "red" },
      { label: "HSE Compliance Rate", value: "92.4%", delta: "+1.8% vs last quarter", positive: true, color: "green" },
      { label: "LTI Frequency Rate", value: "0.8", delta: "Well below target", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "Site Inspection", desc: "Log HSE site inspection", icon: "Search" },
      { label: "Incident Report", desc: "Record workplace incident", icon: "AlertTriangle" },
      { label: "HSE Plan Review", desc: "Review contractor HSE plans", icon: "Shield" },
      { label: "Incident Investigation", desc: "Investigate reported incident", icon: "Eye" },
      { label: "Training Records", desc: "HSE training compliance", icon: "Users" },
      { label: "Emergency Response", desc: "Emergency response plans", icon: "Zap" },
      { label: "Statistics Dashboard", desc: "Frequency rates and trends", icon: "BarChart3" },
      { label: "HSE Report", desc: "Monthly safety report", icon: "Download" },
    ],
    recentActivity: [
      { action: "LTI incident reported — Beitbridge site INC-2026-024 (worker injury)", time: "3 hours ago", type: "error" },
      { action: "HSE plan approved — Harare Water Treatment Phase 2", time: "Yesterday", type: "success" },
      { action: "Safety inspection completed — 3 non-compliances found", time: "2 days ago", type: "warning" },
    ],
    chartData: [
      { label: "Q1", value: 4 }, { label: "Q2", value: 6 }, { label: "Q3", value: 3 }, { label: "Q4", value: 2 },
    ],
    chartTitle: "HSE Incidents by Quarter",
    aiName: "HSE AI",
    aiCapabilities: ["Incident pattern analysis", "Risk prediction", "Compliance scoring", "Safety trend reporting"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Audit Trail", route: "/audit", icon: "Shield" },
    ],
  },

  environment_officer: {
    role: "environment_officer", title: "Environment Officer", subtitle: "Environmental impact assessments & green procurement",
    department: "Environment & Sustainability", color: "bg-green-800", accentColor: "#166534", theme: "emerald",
    kpis: [
      { label: "EIAs Reviewed", value: "12", delta: "This quarter", positive: true, color: "green" },
      { label: "Green Procurement Score", value: "74%", delta: "+4% this year", positive: true, color: "emerald" },
      { label: "Carbon Footprint", value: "2,841 tCO2", delta: "-8% vs 2025", positive: true, color: "blue" },
      { label: "Non-Compliant Contracts", value: "3", delta: "Environmental conditions breach", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "EIA Review", desc: "Review environmental assessments", icon: "Leaf" },
      { label: "Green Score", desc: "Rate procurement activities", icon: "Star" },
      { label: "Carbon Calculator", desc: "Estimate project footprint", icon: "BarChart3" },
      { label: "Environmental Conditions", desc: "Attach to contract award", icon: "FileText" },
      { label: "Compliance Monitor", desc: "Environmental conditions monitoring", icon: "Eye" },
      { label: "Sustainability Report", desc: "Green procurement report", icon: "Download" },
      { label: "Policy Update", desc: "Environmental procurement policy", icon: "BookOpen" },
      { label: "Issue Advisory", desc: "Environmental advisory notice", icon: "Mail" },
    ],
    recentActivity: [
      { action: "EIA approved — Kariba Extension Phase 4 with conditions", time: "1 hour ago", type: "success" },
      { action: "Environmental breach logged — contractor dumping on site INSP-ENV-041", time: "Yesterday", type: "error" },
      { action: "Green procurement score published — Q2 2026 report", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "2022", value: 4200 }, { label: "2023", value: 3900 }, { label: "2024", value: 3400 },
      { label: "2025", value: 3100 }, { label: "2026", value: 2841 },
    ],
    chartTitle: "Annual Carbon Footprint (tCO2e)",
    aiName: "Environment AI",
    aiCapabilities: ["EIA analysis", "Carbon footprint calculation", "Green scoring", "Compliance monitoring"],
    subModules: [
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  gender_officer: {
    role: "gender_officer", title: "Gender & Inclusion Officer", subtitle: "Gender equity, AGPO & inclusive procurement",
    department: "Inclusion & Equity", color: "bg-pink-500", accentColor: "#ec4899", theme: "pink",
    kpis: [
      { label: "Women-Led Suppliers", value: "284", delta: "15.4% of register", positive: true, color: "pink" },
      { label: "AGPO Awards", value: "18", delta: "This quarter", positive: true, color: "green" },
      { label: "Inclusion Compliance", value: "78%", delta: "+4% this year", positive: true, color: "blue" },
      { label: "Gender Gap Score", value: "B+", delta: "Good progress", positive: true, color: "teal" },
    ],
    quickActions: [
      { label: "AGPO Register", desc: "Affirmative procurement register", icon: "Users" },
      { label: "Gender Analysis", desc: "Procurement gender breakdown", icon: "BarChart3" },
      { label: "Inclusion Plan", desc: "Procurement inclusion strategy", icon: "BookOpen" },
      { label: "AGPO Award", desc: "Issue AGPO procurement award", icon: "Award" },
      { label: "Training Schedule", desc: "Inclusion training programme", icon: "Calendar" },
      { label: "Verify Supplier", desc: "Verify AGPO eligibility", icon: "CheckCircle2" },
      { label: "Policy Review", desc: "Gender policy compliance", icon: "Shield" },
      { label: "Inclusion Report", desc: "Quarterly inclusion report", icon: "Download" },
    ],
    recentActivity: [
      { action: "AGPO award issued — women-led SME Sunrise Catering (USD 84K)", time: "2 hours ago", type: "success" },
      { action: "Inclusion compliance report submitted to Ministry", time: "Yesterday", type: "info" },
      { action: "AGPO eligibility rejected — fraudulent registration discovered", time: "3 days ago", type: "error" },
    ],
    chartData: [
      { label: "Women-Led", value: 284 }, { label: "Youth-Led", value: 184 }, { label: "PWD-Led", value: 48 },
      { label: "Minority-Led", value: 96 },
    ],
    chartTitle: "AGPO Suppliers by Category",
    aiName: "Inclusion AI",
    aiCapabilities: ["AGPO eligibility checking", "Gender gap analysis", "Inclusion compliance scoring", "Award recommendation"],
    subModules: [
      { label: "Vendors", route: "/vendors", icon: "Users" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  permanent_secretary: {
    role: "permanent_secretary", title: "Permanent Secretary", subtitle: "Institutional head — strategic & administrative oversight",
    department: "Office of the Permanent Secretary", color: "bg-slate-950", accentColor: "#020617", theme: "slate",
    kpis: [
      { label: "Ministry Spend YTD", value: "USD 184M", delta: "+6% vs plan", positive: false, color: "amber" },
      { label: "Compliance Rating", value: "A", delta: "Top quartile nationally", positive: true, color: "green" },
      { label: "Active Contracts", value: "42", delta: "All ministry entities", positive: true, color: "blue" },
      { label: "Pending Approvals", value: "8", delta: "Your signature required", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Ministry Dashboard", desc: "All-ministry procurement overview", icon: "BarChart3" },
      { label: "Approve Tenders", desc: "High-value tender approvals", icon: "CheckCircle2", route: "/tenders" },
      { label: "Performance Review", desc: "Department KPI dashboard", icon: "TrendingUp" },
      { label: "Budget Oversight", desc: "Ministry budget vs actual", icon: "DollarSign" },
      { label: "Contract Portfolio", desc: "Ministry-wide contracts", icon: "Briefcase", route: "/contracts" },
      { label: "Risk Overview", desc: "Ministry risk register", icon: "Shield" },
      { label: "Board Report", desc: "Report for Minister", icon: "FileText" },
      { label: "Sign Approval", desc: "Review items for signature", icon: "Edit" },
    ],
    recentActivity: [
      { action: "Signed — high-value contract CN-2026-0420 (USD 18.4M)", time: "2 hours ago", type: "success" },
      { action: "Compliance advisory received — PRAZ quarterly assessment", time: "Yesterday", type: "warning" },
      { action: "Board meeting report submitted to Minister", time: "3 days ago", type: "info" },
    ],
    chartData: [
      { label: "Procurement", value: 94 }, { label: "Finance", value: 91 }, { label: "HR", value: 87 },
      { label: "Operations", value: 89 }, { label: "ICT", value: 84 }, { label: "Legal", value: 96 },
    ],
    chartTitle: "Department Performance Scores (%)",
    aiName: "Executive Briefing AI",
    aiCapabilities: ["Ministry performance briefing", "Risk summary", "Compliance overview", "Strategic decision support"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  procurement_director: {
    role: "procurement_director", title: "Procurement Director", subtitle: "Procurement division leadership & governance",
    department: "Procurement Directorate", color: "bg-slate-800", accentColor: "#1e293b", theme: "slate",
    kpis: [
      { label: "Division Tenders", value: "28", delta: "Active this month", positive: true, color: "blue" },
      { label: "Value Managed", value: "USD 84M", delta: "FY 2026 YTD", positive: true, color: "green" },
      { label: "Team Performance", value: "4.1/5", delta: "Officer ratings", positive: true, color: "teal" },
      { label: "Escalations", value: "4", delta: "Awaiting director action", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Division Overview", desc: "All division procurement", icon: "BarChart3" },
      { label: "Approve Tender", desc: "Division-level approvals", icon: "CheckCircle2", route: "/tenders" },
      { label: "Officer Assignments", desc: "Assign tenders to officers", icon: "Users" },
      { label: "Escalation Review", desc: "Handle escalated issues", icon: "AlertTriangle" },
      { label: "Contract Review", desc: "Division contracts status", icon: "Briefcase", route: "/contracts" },
      { label: "Performance Review", desc: "Officer performance ratings", icon: "Star" },
      { label: "Compliance Check", desc: "Division compliance standing", icon: "Shield" },
      { label: "Director Report", desc: "Monthly director report", icon: "Download" },
    ],
    recentActivity: [
      { action: "Tender ZW-PRA-2026-00184 approved — Solar Mini-Grids", time: "1 hour ago", type: "success" },
      { action: "Officer performance review completed — Q2 2026", time: "Yesterday", type: "info" },
      { action: "Escalation ESC-2026-041 resolved — budget approval received", time: "3 days ago", type: "success" },
    ],
    chartData: [
      { label: "Jan", value: 21, value2: 18 }, { label: "Feb", value: 26, value2: 22 },
      { label: "Mar", value: 24, value2: 21 }, { label: "Apr", value: 28, value2: 24 },
      { label: "May", value: 26, value2: 23 }, { label: "Jun", value: 28, value2: 25 },
    ],
    chartTitle: "Division Tenders Raised vs Awarded (Monthly)",
    aiName: "Director AI",
    aiCapabilities: ["Division performance analysis", "Workload optimisation", "Risk management", "Compliance reporting"],
    subModules: [
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
    ],
  },

  chief_executive: {
    role: "chief_executive", title: "Chief Executive Officer", subtitle: "Entity-level strategic management & oversight",
    department: "Executive Office", color: "bg-gray-900", accentColor: "#111827", theme: "slate",
    kpis: [
      { label: "Entity Revenue", value: "USD 284M", delta: "+12% vs 2025", positive: true, color: "green" },
      { label: "Operating Budget", value: "USD 184M", delta: "Utilisation: 68%", positive: true, color: "blue" },
      { label: "Strategic Goals", value: "7/10", delta: "On track", positive: true, color: "teal" },
      { label: "Staff Complement", value: "2,841", delta: "92% filled", positive: true, color: "indigo" },
      { label: "Compliance Score", value: "A", delta: "Top rated entity", positive: true, color: "emerald" },
      { label: "Open Issues", value: "6", delta: "Escalated to you", positive: false, color: "red" },
    ],
    quickActions: [
      { label: "Executive Overview", desc: "All-entity KPI dashboard", icon: "BarChart3" },
      { label: "Strategic Goals", desc: "Goal tracking and milestones", icon: "Target" },
      { label: "Financial Control", desc: "Budget vs actual", icon: "DollarSign" },
      { label: "People Dashboard", desc: "HR and staff metrics", icon: "Users" },
      { label: "Risk Register", desc: "Enterprise risk overview", icon: "Shield" },
      { label: "Board Report", desc: "Generate board presentation", icon: "FileText" },
      { label: "Communication Hub", desc: "Messages from all departments", icon: "MessageSquare" },
      { label: "Approve Policy", desc: "Pending policy sign-offs", icon: "CheckCircle2" },
      { label: "Industry Briefing", desc: "AI-generated sector briefing", icon: "Sparkles" },
    ],
    recentActivity: [
      { action: "Q2 2026 financial targets achieved — 108% of revenue plan", time: "This morning", type: "success" },
      { action: "Board meeting agenda finalised — Q3 2026", time: "Yesterday", type: "info" },
      { action: "Strategic goal SG-6 at risk — ICT project 3 months behind", time: "2 days ago", type: "error" },
    ],
    chartData: [
      { label: "Finance", value: 94 }, { label: "Procurement", value: 96 }, { label: "HR", value: 88 },
      { label: "Operations", value: 91 }, { label: "ICT", value: 82 }, { label: "Legal", value: 95 },
    ],
    chartTitle: "Department Performance Index (%)",
    aiName: "CEO AI Briefing",
    aiCapabilities: ["Executive briefings", "Strategic risk analysis", "Financial performance summary", "Board report generation", "Industry benchmarking"],
    subModules: [
      { label: "Analytics", route: "/analytics", icon: "BarChart3" },
      { label: "Tenders", route: "/tenders", icon: "FileText" },
      { label: "Contracts", route: "/contracts", icon: "Briefcase" },
      { label: "Vendors", route: "/vendors", icon: "Users" },
    ],
  },
};

// Fallback default config for any unrecognised role
const defaultConfig: RoleDashboardConfig = {
  role: "default", title: "Dashboard", subtitle: "Government Procurement System",
  department: "General", color: "bg-slate-700", accentColor: "#334155", theme: "slate",
  kpis: [
    { label: "Tenders", value: "—", delta: "Loading...", positive: true, color: "blue" },
  ],
  quickActions: [
    { label: "Tenders", desc: "Browse procurement tenders", icon: "FileText", route: "/tenders" },
    { label: "Contracts", desc: "View active contracts", icon: "Briefcase", route: "/contracts" },
  ],
  recentActivity: [],
  chartData: [],
  chartTitle: "Activity",
  aiName: "APPIIOMS AI",
  aiCapabilities: ["Procurement support"],
  subModules: [{ label: "Dashboard", route: "/dashboard", icon: "LayoutDashboard" }],
};

export function getRoleDashboardConfig(role: string): RoleDashboardConfig {
  return configs[role] ?? defaultConfig;
}

export default configs;
