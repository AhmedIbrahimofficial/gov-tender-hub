import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import {
  FileText, ShoppingCart, Gavel, ClipboardList, CheckCircle2, Clock, Sparkles,
  AlertTriangle, Users, ChevronRight, X, Search, Filter, Download, Upload,
  FileSignature, Wallet, ShieldCheck, TrendingUp, Building2, Star,
  MessageSquare, Bell, BarChart3, Settings, RefreshCcw, Eye, Lock, Unlock,
  AlertOctagon, Scale, PenLine, Send, CalendarDays, DollarSign, Package,
} from "lucide-react";
import { pushNotification } from "@/lib/local-store";

// ── Types ────────────────────────────────────────────────────────────────────
type ProcType = "Tender" | "RFQ" | "RFP" | "EOI" | "Auction";

type ProcRecord = {
  id: string;
  title: string;
  entity: string;
  type: ProcType;
  value: string;
  status: string;
  currentStage: number;
  totalStages: number;
  currentStageLabel: string;
  closing: string;
  bids: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  aiAlerts: string[];
};

type StageStatus = "completed" | "active" | "pending" | "skipped";

type LifecycleStage = {
  id: number;
  label: string;
  shortLabel: string;
  status: StageStatus;
  description: string;
  aiRole: string;
  owner: string;
  dueDate?: string;
  completedDate?: string;
};

// ── Mock procurement records ─────────────────────────────────────────────────
const PROC_RECORDS: ProcRecord[] = [
  {
    id: "ZW-PRA-2026-00184", title: "Supply & Installation of Solar Mini-Grids — 12 Rural Clinics",
    entity: "Ministry of Energy", type: "Tender", value: "USD 14,800,000",
    status: "Bidding", currentStage: 8, totalStages: 26, currentStageLabel: "Bid Submission",
    closing: "2026-07-08", bids: 11, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "ZW-PRA-2026-00183", title: "Procurement of Antiretroviral Medicines (2-Year Framework)",
    entity: "Ministry of Health & Child Care", type: "Tender", value: "USD 42,500,000",
    status: "Evaluation", currentStage: 12, totalStages: 26, currentStageLabel: "Technical Evaluation",
    closing: "2026-06-12", bids: 8, riskLevel: "Medium",
    aiAlerts: ["2 evaluators diverge >15pts — consensus meeting required"],
  },
  {
    id: "ZW-PRA-2026-00182", title: "National Tax Administration System — Phase II",
    entity: "ZIMRA", type: "Tender", value: "USD 9,200,000",
    status: "Bidding", currentStage: 5, totalStages: 26, currentStageLabel: "Advertisement",
    closing: "2026-07-21", bids: 5, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "RFQ-2026-0892", title: "Office Stationery — Q3 2026",
    entity: "Finance Department", type: "RFQ", value: "USD 4,200",
    status: "Evaluating", currentStage: 9, totalStages: 18, currentStageLabel: "Technical Evaluation",
    closing: "2026-06-28", bids: 4, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "RFP-2026-0041", title: "Provision of Legal Advisory Services — 3 Years",
    entity: "Ministry of Justice", type: "RFP", value: "USD 2,400,000",
    status: "Evaluation", currentStage: 10, totalStages: 22, currentStageLabel: "Financial Evaluation",
    closing: "2026-06-30", bids: 6, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "EOI-2026-0018", title: "Expression of Interest — Water Treatment Consultancy",
    entity: "Ministry of Water", type: "EOI", value: "Est. USD 800,000",
    status: "Open", currentStage: 3, totalStages: 14, currentStageLabel: "EOI Advertisement",
    closing: "2026-07-15", bids: 0, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "AUC-2026-0007", title: "Disposal of Surplus Government Vehicles (42 Units)",
    entity: "Ministry of Finance", type: "Auction", value: "Reserve: USD 420,000",
    status: "Bidding", currentStage: 4, totalStages: 10, currentStageLabel: "Live Auction",
    closing: "2026-06-25", bids: 38, riskLevel: "Low", aiAlerts: [],
  },
  {
    id: "ZW-PRA-2026-00181", title: "Rehabilitation of Beitbridge–Harare Highway (Section 4)",
    entity: "Ministry of Transport", type: "Tender", value: "USD 88,000,000",
    status: "Published", currentStage: 4, totalStages: 26, currentStageLabel: "Approval",
    closing: "2026-08-04", bids: 0, riskLevel: "High",
    aiAlerts: ["BOQ incomplete — 3 sections missing before publication"],
  },
];

// ── Stage builder per procurement type ───────────────────────────────────────
function buildStages(record: ProcRecord): LifecycleStage[] {
  const base = [
    { id: 0,  label: "Governance & Setup",    shortLabel: "Governance",    aiRole: "Policy Advisor",         owner: "CPO" },
    { id: 1,  label: "Planning & Demand",      shortLabel: "Planning",      aiRole: "Demand Forecaster",      owner: "Planning Officer" },
    { id: 2,  label: "Sourcing Strategy",      shortLabel: "Strategy",      aiRole: "Strategy Advisor",       owner: "Procurement Officer" },
    { id: 3,  label: "Preparation & Drafting", shortLabel: "Preparation",   aiRole: "Drafting AI",            owner: "Procurement Officer" },
    { id: 4,  label: "Internal Approval",      shortLabel: "Approval",      aiRole: "Compliance Checker",     owner: "Legal / Finance" },
    { id: 5,  label: "Advertisement",          shortLabel: "Advertisement", aiRole: "Publication AI",         owner: "Communications" },
    { id: 6,  label: "Supplier Management",    shortLabel: "Supplier Mgmt", aiRole: "Supplier Risk AI",       owner: "Procurement Officer" },
    { id: 7,  label: "Clarifications & Q&A",   shortLabel: "Clarifications",aiRole: "Clarification AI",       owner: "Procurement Officer" },
    { id: 8,  label: "Bid / Quote Submission", shortLabel: "Bid Submission",aiRole: "Bid Compliance AI",      owner: "Bidders" },
    { id: 9,  label: "Closing & Bid Opening",  shortLabel: "Bid Opening",   aiRole: "Opening Recorder",       owner: "Committee" },
    { id: 10, label: "Admin Evaluation",       shortLabel: "Admin Eval",    aiRole: "Compliance Eval AI",     owner: "Evaluators" },
    { id: 11, label: "Technical Evaluation",   shortLabel: "Tech Eval",     aiRole: "Tech Eval AI",           owner: "Evaluators" },
    { id: 12, label: "Financial Evaluation",   shortLabel: "Fin Eval",      aiRole: "Financial Eval AI",      owner: "Evaluators" },
    { id: 13, label: "Combined Ranking",       shortLabel: "Combined Eval", aiRole: "Award Rec AI",           owner: "Evaluation Committee" },
    { id: 14, label: "Due Diligence",          shortLabel: "Due Diligence", aiRole: "Due Diligence AI",       owner: "Procurement Officer" },
    { id: 15, label: "Award Approval",         shortLabel: "Award Approval",aiRole: "Award Review AI",        owner: "Adjudication Board" },
    { id: 16, label: "Notification & Standstill", shortLabel: "Notification",aiRole: "Notification AI",      owner: "Communications" },
    { id: 17, label: "Contract Drafting",      shortLabel: "Contract Draft",aiRole: "Contract AI",            owner: "Legal Officer" },
    { id: 18, label: "Contract Execution",     shortLabel: "Contract Exec", aiRole: "Performance AI",         owner: "Contract Manager" },
    { id: 19, label: "Delivery & Milestones",  shortLabel: "Delivery",      aiRole: "Performance AI",         owner: "Project Manager" },
    { id: 20, label: "Invoicing & 3-Way Match",shortLabel: "Invoicing",     aiRole: "Invoice AI",             owner: "Finance Officer" },
    { id: 21, label: "Payment Approval",       shortLabel: "Payment",       aiRole: "Payment AI",             owner: "Finance Officer" },
    { id: 22, label: "Vendor Performance",     shortLabel: "Vendor Perf",   aiRole: "Performance AI",         owner: "Contract Manager" },
    { id: 23, label: "Audit & Compliance",     shortLabel: "Audit",         aiRole: "Audit AI",               owner: "Auditor" },
    { id: 24, label: "Analytics & Reporting",  shortLabel: "Analytics",     aiRole: "Intelligence AI",        owner: "Analytics Officer" },
    { id: 25, label: "Closeout & Archive",     shortLabel: "Closeout",      aiRole: "Closeout AI",            owner: "Records Officer" },
  ];

  const descriptions: Record<number, string> = {
    0:  "Policies, thresholds, roles, and regulatory framework configured",
    1:  "Procurement request approved, budget validated, demand assessed",
    2:  "Procurement method selected and justified based on value and complexity",
    3:  "Specifications, BOQ, TOR, and evaluation criteria drafted",
    4:  "Legal, finance, and compliance review; internal sign-offs obtained",
    5:  "Multi-channel publication — gazette, website, portal, PRAZ",
    6:  "Supplier KYC, qualification checks, risk scoring",
    7:  "Questions received, addenda issued, pre-bid meeting held",
    8:  "Encrypted electronic vault; late bid prevention; compliance check",
    9:  "Auto-close at deadline; opening ceremony; public minutes",
    10: "Compliance matrix — mandatory requirements check",
    11: "Weighted technical scoring — consensus across evaluators",
    12: "BOQ arithmetic check, price normalisation, life-cycle costing",
    13: "QCBS / LERB ranking; combined evaluation recommendation report",
    14: "Reference checks, site visits, financial capacity verification",
    15: "Tender committee, board approval, exception handling",
    16: "Award & regret notices, 10-day standstill period",
    17: "Contract terms negotiated, drafted, signed, deposited",
    18: "SLAs active, milestones tracked, variation order management",
    19: "Deliverable acceptance, inspection reports, completion certificates",
    20: "Invoice received, 3-way PO–GRN–Invoice match, tax validation",
    21: "Multi-level payment approval, EFT generation, remittance advice",
    22: "KPI monitoring, scorecards, performance improvement plan",
    23: "Immutable audit trail, compliance reporting, findings management",
    24: "Spend analytics, savings measurement, cycle-time dashboards",
    25: "Defects liability period, warranty monitoring, final archive",
  };

  return base.map((b, i) => ({
    ...b,
    description: descriptions[b.id] ?? "",
    status: (
      b.id < record.currentStage ? "completed"
      : b.id === record.currentStage ? "active"
      : "pending"
    ) as StageStatus,
    dueDate: b.id === record.currentStage ? record.closing : undefined,
    completedDate: b.id < record.currentStage ? "2026-06-" + String(b.id + 1).padStart(2, "0") : undefined,
  }));
}

// ── Stage detail data — tools per stage ──────────────────────────────────────
const STAGE_TOOLS: Record<number, {
  documents: string[];
  workflow: string[];
  automation: string[];
  aiCapabilities: string[];
  approvals: string[];
  communications: string[];
  riskFlags: string[];
  finance: string[];
}> = {
  3: {
    documents: ["Tender Notice Template", "Bill of Quantities", "Terms of Reference", "Instruction to Bidders", "Bid Forms", "Evaluation Criteria Matrix"],
    workflow: ["Create tender record & assign number", "Attach project documents", "Define evaluation stages & weights", "Assign committee members", "Collect COI declarations", "Submit for internal approval"],
    automation: ["AI drafts specs from similar tenders", "BOQ auto-populated from item catalogue", "Timeline auto-generated by method", "Evaluation weights suggested by category"],
    aiCapabilities: ["Generate full TOR from project description", "Detect specification ambiguities", "Suggest evaluation criteria", "Draft SCC & GCC clauses"],
    approvals: ["Procurement Officer review", "Legal sign-off", "Finance budget confirmation", "CPO approval"],
    communications: ["Internal draft sharing", "Stakeholder review invites", "Committee notification"],
    riskFlags: ["Specification too broad or too narrow", "Unrealistic timeline", "Missing mandatory documents"],
    finance: ["Budget code confirmed", "Estimated value approved", "IFMIS commitment raised"],
  },
  5: {
    documents: ["Published Tender Notice", "Addendum Log", "Publication Proof", "Distribution List"],
    workflow: ["Publish to PRAZ system", "Post on ministry website", "Submit to Government Gazette", "Notify registered suppliers", "Set countdown timer"],
    automation: ["Multi-channel simultaneous publication", "Supplier matching — notify relevant vendors", "Countdown timer activated", "Extension logic on system"],
    aiCapabilities: ["Optimise tender reach across channels", "Translate notice to local languages", "Identify under-represented supplier categories", "Forecast bid response rate"],
    approvals: ["CPO publication sign-off", "Communications officer confirmation"],
    communications: ["Email to registered suppliers", "Gazette submission", "Portal announcement", "SMS blast to SME database"],
    riskFlags: ["Insufficient notice period", "Publication not reaching target suppliers"],
    finance: ["Advertisement cost authorised"],
  },
  8: {
    documents: ["Encrypted Bid Package", "Bid Bond / Security", "Signed Declarations", "Technical Proposal", "Financial Proposal"],
    workflow: ["Electronic bid vault opens", "Bidder uploads encrypted package", "System validates completeness", "Acknowledgement receipt issued", "Vault locks at deadline"],
    automation: ["Completeness check on upload", "Bid security validity verified", "Late submission blocked automatically", "Duplicate bid detection"],
    aiCapabilities: ["Extract bid data into structured format", "Flag missing mandatory documents", "Pre-screen for conflict of interest", "Verify signatory authority"],
    approvals: ["Bid Submission Module auto-validates", "Manual override only by CPO"],
    communications: ["Upload confirmation to bidder", "Deadline reminders (48h, 24h, 1h)", "Late bid rejection notice"],
    riskFlags: ["Bid security expiring before award", "Missing declarations", "Unusual formatting suggesting collusion"],
    finance: ["Bid bond amounts verified against tender value"],
  },
  11: {
    documents: ["Evaluation Score Sheets", "Consensus Meeting Minutes", "Individual Evaluator Reports", "Clarification Requests", "Evaluation Narrative"],
    workflow: ["Distribute bids to evaluators", "Independent scoring portal", "Flag divergences >15pts", "Consensus meeting if needed", "Moderator resolves disputes", "Generate evaluation report"],
    automation: ["Scores consolidated automatically", "Weighted totals calculated in real-time", "Divergence alerts triggered", "Narrative auto-generated per bidder"],
    aiCapabilities: ["AI scores each criterion from documents", "Extract relevant experience automatically", "Identify spec deviations", "Suggest clarification questions"],
    approvals: ["All evaluators sign off", "Chairperson approves narrative", "CPO review before proceeding"],
    communications: ["Evaluator task assignments", "Clarification requests to bidders", "Committee meeting invites"],
    riskFlags: ["Conflict of interest detected", "Score manipulation pattern", "Missing evaluator submissions"],
    finance: ["No financial data shared at this stage — blind evaluation"],
  },
  15: {
    documents: ["Award Recommendation Report", "Approval Package", "Committee Resolution", "Board Minutes", "Regulator Notification"],
    workflow: ["Submit award package to committee", "Committee review meeting", "Vote & resolution recorded", "Board approval if >threshold", "CPO countersigns", "Notify PRAZ"],
    automation: ["Routes to correct tier by value threshold", "Escalates overdue approvals", "Generates approval summary", "Records resolution on blockchain"],
    aiCapabilities: ["Validate evaluation integrity", "Check for procedural compliance", "Assess approval readiness", "Generate award justification"],
    approvals: ["Tender Committee approval", "Board approval (>USD 1M)", "Minister approval (>USD 10M)", "Cabinet approval (>USD 50M)"],
    communications: ["Committee meeting notice", "Board papers circulation", "Regulator submission"],
    riskFlags: ["Approval threshold exceeded without escalation", "Missing committee quorum", "Regulator filing deadline missed"],
    finance: ["Final value confirmed for commitment", "VAT and withholding tax calculated"],
  },
  18: {
    documents: ["Signed Contract", "Performance Bond", "Insurance Certificates", "Work Programme", "SLA Schedule", "Variation Order Log"],
    workflow: ["Contract signed by both parties", "Performance bond lodged", "Work programme approved", "Site handover completed", "Progress meetings scheduled", "Variation order workflow active"],
    automation: ["Milestone calendar auto-generated", "Payment schedule built from contract", "Variation order threshold alerts", "SLA breach notifications"],
    aiCapabilities: ["Monitor contract performance against SLAs", "Flag potential cost overruns", "Predict delivery delays", "Draft variation order justifications"],
    approvals: ["Contract signed by vendor CEO", "Countersigned by Accounting Officer", "Finance officer endorsement"],
    communications: ["Contract commencement notice", "Site meeting invites", "Progress report templates distributed"],
    riskFlags: ["Performance bond not submitted", "Work programme not approved", "Insurance lapse"],
    finance: ["IFMIS contract registered", "Advance payment processed if applicable", "Retention schedule configured"],
  },
  20: {
    documents: ["Tax Invoice", "Goods Received Note", "Completion Certificate", "Purchase Order", "3-Way Match Report"],
    workflow: ["Invoice received in system", "Match invoice to PO & GRN", "Tax compliance check (ZIMRA)", "Route for payment approval", "Generate EFT batch", "Remittance sent to vendor"],
    automation: ["3-way match runs automatically", "ZIMRA tax status verified in real-time", "Duplicate invoice detection", "Currency conversion at spot rate"],
    aiCapabilities: ["Extract invoice data via OCR", "Flag anomalies vs contract rates", "Predict payment date", "Detect suspected fraud patterns"],
    approvals: ["Finance officer review", "Budget officer confirmation", "Accounting officer approval", "Treasury batch sign-off"],
    communications: ["Invoice receipt acknowledgement", "Query notice to vendor if issues", "Payment confirmation / remittance advice"],
    riskFlags: ["Invoice exceeds PO value", "ZIMRA clearance lapsed", "Duplicate invoice", "Bank details changed recently"],
    finance: ["Budget line debited", "IFMIS payment entry", "Withholding tax calculated & remitted", "EFT reference logged"],
  },
};

const DEFAULT_TOOLS = {
  documents: ["Standard procurement documents", "Reference materials", "Templates"],
  workflow: ["Review stage requirements", "Update status", "Assign tasks", "Record decisions"],
  automation: ["Status auto-updated on action", "Notifications triggered on key events", "Audit trail maintained"],
  aiCapabilities: ["Stage-specific AI assistant available", "Document analysis", "Risk flagging"],
  approvals: ["Stage owner sign-off", "Supervisor review"],
  communications: ["Email notifications to stakeholders", "In-system messages"],
  riskFlags: ["Standard risk monitoring active"],
  finance: ["Budget tracking active"],
};

// ── Helper components ─────────────────────────────────────────────────────────
const TYPE_COLORS: Record<ProcType, string> = {
  Tender:  "bg-blue-100 text-blue-700 border-blue-200",
  RFQ:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  RFP:     "bg-violet-100 text-violet-700 border-violet-200",
  EOI:     "bg-amber-100 text-amber-700 border-amber-200",
  Auction: "bg-rose-100 text-rose-700 border-rose-200",
};

const RISK_COLORS: Record<string, string> = {
  Low:      "text-emerald-600 bg-emerald-50",
  Medium:   "text-amber-600 bg-amber-50",
  High:     "text-red-600 bg-red-50",
  Critical: "text-red-800 bg-red-100",
};

const STATUS_TONE: Record<string, "green" | "blue" | "amber" | "muted"> = {
  "Bidding":    "blue",
  "Evaluation": "amber",
  "Published":  "muted",
  "Evaluating": "amber",
  "Open":       "blue",
  "Awarded":    "green",
  "Draft":      "muted",
};

const STAGE_STATUS_STYLE: Record<StageStatus, string> = {
  completed: "bg-emerald-500 text-white border-emerald-500",
  active:    "bg-black text-white border-black ring-2 ring-black ring-offset-2",
  pending:   "bg-white text-black/40 border-black/15",
  skipped:   "bg-gray-100 text-gray-400 border-gray-200",
};

function StagePin({ status, index }: { status: StageStatus; index: number }) {
  return (
    <div className={`w-6 h-6 rounded-full border-2 grid place-items-center text-[9px] font-bold flex-shrink-0 ${STAGE_STATUS_STYLE[status]}`}>
      {status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : index}
    </div>
  );
}

function ToolRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-foreground py-0.5">
      <Icon className="h-3.5 w-3.5 text-black/40 mt-0.5 flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
}

// ── Stage Detail Slide-over Panel ─────────────────────────────────────────────
type StagePanelTab = "overview" | "documents" | "workflow" | "automation" | "ai" | "approvals" | "comms" | "risk" | "finance";

function StageDetailPanel({
  record, stage, onClose,
}: {
  record: ProcRecord;
  stage: LifecycleStage;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<StagePanelTab>("overview");
  const tools = STAGE_TOOLS[stage.id] ?? DEFAULT_TOOLS;

  const tabs: { key: StagePanelTab; label: string; icon: React.ElementType }[] = [
    { key: "overview",   label: "Overview",      icon: Eye           },
    { key: "documents",  label: "Documents",     icon: FileText      },
    { key: "workflow",   label: "Workflow",      icon: RefreshCcw    },
    { key: "automation", label: "Automation",    icon: Settings      },
    { key: "ai",         label: "AI Assistant",  icon: Sparkles      },
    { key: "approvals",  label: "Approvals",     icon: CheckCircle2  },
    { key: "comms",      label: "Comms",         icon: MessageSquare },
    { key: "risk",       label: "Risk & Flags",  icon: AlertTriangle },
    { key: "finance",    label: "Finance",       icon: Wallet        },
  ];

  const handleAction = (action: string) => {
    pushNotification(`${action} — ${stage.label} · ${record.id}`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/8 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${TYPE_COLORS[record.type]}`}>{record.type}</span>
                <Badge tone={stage.status === "active" ? "blue" : stage.status === "completed" ? "green" : "muted"}>
                  Stage {stage.id} of {record.totalStages - 1}
                </Badge>
                {stage.status === "active" && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-black leading-tight">{stage.label}</h2>
              <p className="text-xs text-black/50 mt-0.5 truncate">{record.id} · {record.title}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 hover:text-black transition-colors flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AI role pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-violet-500" />
              <span className="text-[11px] text-violet-700 font-medium">{stage.aiRole}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-full px-2.5 py-1">
              <Users className="h-3 w-3 text-black/40" />
              <span className="text-[11px] text-black/60">{stage.owner}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-black/8 flex-shrink-0 scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px flex-shrink-0
                ${tab === t.key ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {tab === "overview" && (
            <>
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <p className="text-sm text-black/70 leading-relaxed">{stage.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stage.dueDate && (
                  <div className="border border-black/8 rounded-xl p-3">
                    <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Due Date</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-black">
                      <CalendarDays className="h-4 w-4 text-black/40" />{stage.dueDate}
                    </div>
                  </div>
                )}
                {stage.completedDate && (
                  <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">
                    <div className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Completed</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />{stage.completedDate}
                    </div>
                  </div>
                )}
                <div className="border border-black/8 rounded-xl p-3">
                  <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Value at Stake</div>
                  <div className="text-sm font-semibold text-black">{record.value}</div>
                </div>
                <div className="border border-black/8 rounded-xl p-3">
                  <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Risk Level</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RISK_COLORS[record.riskLevel]}`}>{record.riskLevel}</span>
                </div>
              </div>
              {record.aiAlerts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs">
                    <AlertTriangle className="h-4 w-4" /> AI Alerts ({record.aiAlerts.length})
                  </div>
                  {record.aiAlerts.map((a, i) => (
                    <div key={i} className="text-xs text-amber-700">{a}</div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAction("Stage advanced")} className="h-9 bg-black text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" /> Advance Stage
                </button>
                <button onClick={() => handleAction("Report downloaded")} className="h-9 border border-black/10 rounded-lg text-xs font-medium hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download Report
                </button>
              </div>
            </>
          )}

          {tab === "documents" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-black/60">Stage Documents</span>
                <button onClick={() => handleAction("Document uploaded")} className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] font-medium flex items-center gap-1 hover:opacity-90">
                  <Upload className="h-3 w-3" /> Upload
                </button>
              </div>
              {tools.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-black/30" />
                    <span className="text-xs text-black">{doc}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleAction(`Viewing ${doc}`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">View</button>
                    <button onClick={() => handleAction(`Downloaded ${doc}`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">DL</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "workflow" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Process Steps</span>
              {tools.workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-black/8 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-xs text-black">{step}</p>
                  </div>
                  <button onClick={() => handleAction(`${step} — marked complete`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-emerald-500 hover:text-white transition-colors flex-shrink-0">Done</button>
                </div>
              ))}
            </div>
          )}

          {tab === "automation" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Automated Actions at This Stage</span>
              {tools.automation.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <Settings className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-blue-800">{a}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                <Sparkles className="h-4 w-4 text-violet-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-violet-800">{stage.aiRole} — Active</div>
                  <div className="text-[11px] text-violet-600 mt-0.5">Monitoring stage · 94% confidence</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-black/60">AI Capabilities at This Stage</span>
              {tools.aiCapabilities.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-3 border border-black/8 rounded-xl hover:border-violet-200 transition-colors">
                  <div className="h-4 w-4 rounded-full bg-violet-100 grid place-items-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-black">{c}</p>
                  </div>
                  <button onClick={() => handleAction(`AI action: ${c}`)} className="h-6 px-2 rounded-md bg-violet-100 text-violet-700 text-[10px] font-medium hover:bg-violet-500 hover:text-white transition-colors flex-shrink-0">Run</button>
                </div>
              ))}
            </div>
          )}

          {tab === "approvals" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Required Approvals</span>
              {tools.approvals.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-5 w-5 rounded-full grid place-items-center ${i === 0 ? "bg-emerald-500" : "bg-black/10"}`}>
                      {i === 0 ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Lock className="h-2.5 w-2.5 text-black/30" />}
                    </div>
                    <span className="text-xs text-black">{a}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-[#F5F5F5] text-black/40"}`}>
                    {i === 0 ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}
              <button onClick={() => handleAction("Approval submitted")} className="w-full h-9 mt-2 bg-black text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                Submit for Approval
              </button>
            </div>
          )}

          {tab === "comms" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Communications at This Stage</span>
              {tools.communications.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-3.5 w-3.5 text-black/30" />
                    <span className="text-xs text-black">{c}</span>
                  </div>
                  <button onClick={() => handleAction(`${c} sent`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">
                    Send
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "risk" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Risk Flags & Monitoring</span>
              {tools.riskFlags.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertOctagon className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-800">{r}</span>
                </div>
              ))}
              <button onClick={() => handleAction("Risk report generated")} className="w-full h-9 mt-2 border border-amber-200 text-amber-700 bg-amber-50 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Generate Risk Report
              </button>
            </div>
          )}

          {tab === "finance" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Financial Controls at This Stage</span>
              {tools.finance.map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-emerald-800">{f}</span>
                </div>
              ))}
              <div className="border border-black/8 rounded-xl p-3 mt-2">
                <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Estimated Value</div>
                <div className="text-base font-bold text-black">{record.value}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lifecycle Stage Map for a selected record ─────────────────────────────────
function LifecycleStageMap({
  record, onSelectStage,
}: {
  record: ProcRecord;
  onSelectStage: (stage: LifecycleStage) => void;
}) {
  const stages = buildStages(record);

  const row1 = stages.slice(0, 9);
  const row2 = stages.slice(9, 18);
  const row3 = stages.slice(18);

  const renderRow = (items: LifecycleStage[], reverse = false) => (
    <div className={`flex items-stretch gap-0 ${reverse ? "flex-row-reverse" : ""}`}>
      {items.map((stage, idx) => (
        <button
          key={stage.id}
          onClick={() => onSelectStage(stage)}
          className={`flex-1 min-w-0 relative group flex flex-col items-center gap-1 px-1 py-2 rounded-lg border transition-all hover:border-black/30 hover:bg-[#F5F5F5]/80 text-center
            ${stage.status === "active" ? "border-black bg-black/5" : "border-transparent"}
          `}
          title={`${stage.label} — ${stage.status}`}
        >
          <StagePin status={stage.status} index={stage.id} />
          <span className={`text-[9px] font-medium leading-tight mt-0.5 w-full truncate
            ${stage.status === "completed" ? "text-emerald-600" : stage.status === "active" ? "text-black font-bold" : "text-black/35"}`}>
            {stage.shortLabel}
          </span>
          {/* connector */}
          {idx < items.length - 1 && (
            <div className={`absolute top-[18px] ${reverse ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"} w-4 h-0.5 z-10
              ${stage.status === "completed" ? "bg-emerald-400" : "bg-black/10"}`}
            />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      {renderRow(row1)}
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-0.5 bg-black/8" />
        <ChevronRight className="h-3 w-3 text-black/20 rotate-90" />
        <div className="flex-1 h-0.5 bg-black/8" />
      </div>
      {renderRow(row2, true)}
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-0.5 bg-black/8" />
        <ChevronRight className="h-3 w-3 text-black/20 rotate-90" />
        <div className="flex-1 h-0.5 bg-black/8" />
      </div>
      {renderRow(row3)}
    </div>
  );
}

// ── Record Selector Card ──────────────────────────────────────────────────────
function RecordCard({
  record, selected, onClick,
}: {
  record: ProcRecord;
  selected: boolean;
  onClick: () => void;
}) {
  const progress = Math.round((record.currentStage / (record.totalStages - 1)) * 100);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all hover:border-black/30
        ${selected ? "border-black bg-black/5 shadow-sm" : "border-black/8 bg-white hover:bg-[#F5F5F5]/60"}`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5 ${TYPE_COLORS[record.type]}`}>
          {record.type}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-black leading-tight truncate">{record.title}</div>
          <div className="text-[10px] text-black/40 mt-0.5 truncate">{record.entity} · {record.id}</div>
        </div>
        {record.aiAlerts.length > 0 && (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge tone={STATUS_TONE[record.status] ?? "muted"}>{record.status}</Badge>
        <span className="text-[10px] text-black/40">{record.currentStageLabel}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-black/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-black/30">Stage {record.currentStage}/{record.totalStages - 1}</span>
        <span className="text-[9px] text-black/40 font-medium">{progress}%</span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
        <span className="text-[10px] font-semibold text-black/70">{record.value}</span>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${RISK_COLORS[record.riskLevel]}`}>
          {record.riskLevel} Risk
        </span>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProcurementLifecyclePage() {
  const [selectedRecord, setSelectedRecord] = useState<ProcRecord>(PROC_RECORDS[0]);
  const [selectedStage, setSelectedStage]   = useState<LifecycleStage | null>(null);
  const [typeFilter, setTypeFilter]         = useState<ProcType | "All">("All");
  const [search, setSearch]                 = useState("");

  const filteredRecords = PROC_RECORDS.filter(r => {
    const matchType = typeFilter === "All" || r.type === typeFilter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
      || r.id.toLowerCase().includes(search.toLowerCase())
      || r.entity.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const stages = buildStages(selectedRecord);
  const completedStages = stages.filter(s => s.status === "completed").length;
  const activeStage = stages.find(s => s.status === "active");

  const totalAlerts = PROC_RECORDS.reduce((n, r) => n + r.aiAlerts.length, 0);

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1800px] mx-auto">

        {/* Header */}
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Procurement Control Tower</Badge>
          <Badge tone="muted">All Instruments · Full Lifecycle</Badge>
          {totalAlerts > 0 && (
            <Badge tone="amber">
              <AlertTriangle className="h-3 w-3 mr-1" />{totalAlerts} AI Alerts
            </Badge>
          )}
        </div>
        <PageHeader
          title="Procurement Lifecycle Control Tower"
          description="Select any procurement record — Tender, RFQ, RFP, EOI, or Auction — to view its full lifecycle stage map. Click any stage for complete tooling, AI capabilities, approvals, documents, and finance controls."
          actions={
            <div className="flex gap-2">
              <button
                onClick={() => pushNotification("Lifecycle report exported to PDF.", "success")}
                className="h-9 px-3 rounded-md border border-black/10 text-sm font-medium flex items-center gap-1.5 hover:bg-[#F5F5F5] transition-colors"
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={() => pushNotification("All lifecycle data refreshed.", "info")}
                className="h-9 px-3 rounded-md bg-black text-white text-sm font-medium flex items-center gap-1.5 hover:opacity-90"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
            </div>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Active Procurements" value="8" delta="Across all instruments" icon={FileText} />
          <KpiCard label="Stages Completed" value={String(completedStages)} delta={`${selectedRecord.id}`} icon={CheckCircle2} />
          <KpiCard label="AI Alerts" value={String(totalAlerts)} delta="Requiring attention" icon={AlertTriangle} />
          <KpiCard label="AI Agents Active" value="12" delta="All stages monitored" icon={Sparkles} />
        </div>

        {/* Main layout: sidebar list + stage map */}
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">

          {/* ── Left: record selector ───────────────────────────────────── */}
          <div className="space-y-3">
            <Card>
              <div className="px-4 pt-4 pb-3 border-b border-black/8">
                <div className="text-sm font-semibold text-black mb-3">Procurement Records</div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search records…"
                    className="w-full h-8 pl-8 pr-3 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {/* Type filter pills */}
                <div className="flex gap-1.5 flex-wrap">
                  {(["All", "Tender", "RFQ", "RFP", "EOI", "Auction"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`h-6 px-2 rounded-full text-[10px] font-semibold transition-colors
                        ${typeFilter === t ? "bg-black text-white" : "bg-[#F5F5F5] text-black/50 hover:bg-black/10"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
                {filteredRecords.length === 0 && (
                  <div className="text-center py-8 text-xs text-black/30">No records match your filter</div>
                )}
                {filteredRecords.map(r => (
                  <RecordCard
                    key={r.id}
                    record={r}
                    selected={selectedRecord.id === r.id}
                    onClick={() => setSelectedRecord(r)}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* ── Right: stage map ────────────────────────────────────────── */}
          <div className="space-y-4">
            <Card>
              <CardHeader
                title={`${selectedRecord.title}`}
                subtitle={`${selectedRecord.entity} · ${selectedRecord.id} · ${selectedRecord.value}`}
                action={
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${TYPE_COLORS[selectedRecord.type]}`}>
                      {selectedRecord.type}
                    </span>
                    <Badge tone={STATUS_TONE[selectedRecord.status] ?? "muted"}>{selectedRecord.status}</Badge>
                  </div>
                }
              />

              {/* Active stage callout */}
              {activeStage && (
                <div className="mx-5 mb-3 flex items-center gap-3 bg-black text-white rounded-xl px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">Current Stage: {activeStage.label}</div>
                    <div className="text-[11px] text-white/60 truncate">{activeStage.description}</div>
                  </div>
                  <button
                    onClick={() => setSelectedStage(activeStage)}
                    className="h-7 px-2.5 bg-white text-black rounded-lg text-[10px] font-semibold hover:bg-white/90 transition-colors flex-shrink-0 flex items-center gap-1"
                  >
                    Open <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Stage map */}
              <div className="px-5 pb-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-black/40">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-black/40">
                    <div className="w-3 h-3 rounded-full bg-black" /> Active
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-black/40">
                    <div className="w-3 h-3 rounded-full border-2 border-black/15 bg-white" /> Pending
                  </div>
                  <span className="ml-auto text-[10px] text-black/40">Click any stage to open full toolset →</span>
                </div>
                <LifecycleStageMap record={selectedRecord} onSelectStage={setSelectedStage} />
              </div>
            </Card>

            {/* Stage summary grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stages.filter(s => s.status !== "pending").slice(0, 4).map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className="p-4 bg-white border border-black/8 rounded-xl text-left hover:border-black/25 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <StagePin status={stage.status} index={stage.id} />
                    <ChevronRight className="h-3.5 w-3.5 text-black/20 group-hover:text-black transition-colors" />
                  </div>
                  <div className="text-xs font-semibold text-black leading-tight">{stage.shortLabel}</div>
                  <div className="text-[10px] text-black/40 mt-0.5">{stage.owner}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="h-2.5 w-2.5 text-violet-400" />
                    <span className="text-[9px] text-violet-500">{stage.aiRole}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Alerts for selected record */}
            {selectedRecord.aiAlerts.length > 0 && (
              <Card>
                <CardHeader
                  title="AI Alerts — Action Required"
                  action={<Badge tone="amber">{selectedRecord.aiAlerts.length} open</Badge>}
                />
                <div className="divide-y divide-black/5">
                  {selectedRecord.aiAlerts.map((alert, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-black font-medium">{alert}</p>
                        <p className="text-[10px] text-black/40 mt-0.5">{selectedRecord.id} · {activeStage?.label}</p>
                      </div>
                      <button
                        onClick={() => pushNotification(`Alert resolved: ${alert}`, "success")}
                        className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] font-medium hover:opacity-90 flex-shrink-0"
                      >
                        Resolve
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Stage Detail Slide-over */}
      {selectedStage && (
        <StageDetailPanel
          record={selectedRecord}
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
        />
      )}

      <AIAssistantPanel
        agentName="Lifecycle Control AI"
        agentRole="Monitors all stages across all procurement instruments"
        context="procurement lifecycle"
        color="blue"
        suggestedPrompts={[
          "Summarise risk across all active procurements",
          "Which records are overdue at their current stage?",
          "Generate lifecycle report for ZW-PRA-2026-00183",
          "What approvals are pending right now?",
        ]}
      />
    </AppShell>
  );
}
