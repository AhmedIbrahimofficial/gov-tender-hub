import { useState } from "react";
import { AppShell, PageHeader, Card, Badge } from "@/components/AppShell";
import {
  FileText, CheckCircle2, Clock, Circle, AlertCircle,
  ChevronRight, ChevronLeft, Sparkles, Users, Upload,
  Download, Eye, MessageSquare, AlertTriangle, DollarSign,
  Shield, BarChart3, Search, BookOpen, Info, Save, Send,
  RotateCcw, HelpCircle, ArrowUp, UserPlus, PauseCircle,
  XCircle, Check, X, Filter, Plus, Flag, Lock,
} from "lucide-react";
import { pushNotification } from "@/lib/local-store";

// ─── Types ────────────────────────────────────────────────────────────────────
type UserHierarchyRole = "Initiator" | "Approver" | "Authorizer" | "Adjudicator" | "Oversight";
type StageStatus = "completed" | "active" | "pending" | "blocked";
type Priority = "High" | "Medium" | "Low";
type WorkQueueStatus = "My Tasks" | "Pending Tasks" | "Overdue Tasks" | "Escalated Tasks" | "Delegated Tasks";

interface WorkbenchRecord {
  recordNumber: string;
  referenceNumber: string;
  title: string;
  ministry: string;
  department: string;
  financialYear: string;
  budgetCode: string;
  procurementType: string;
  currentStage: string;
  status: "Open" | "Pending" | "Approved" | "Rejected" | "On Hold";
  priority: Priority;
  dueDate: string;
  ageOnStage: string;
  owner: string;
  organization: string;
  percentageComplete: number;
  processStage: UserHierarchyRole;
  userRole: UserHierarchyRole;
  userName: string;
  userJobTitle: string;
  userLocation: string;
  lastSaved: string;
  connectionStatus: "Online" | "Offline";
  version: string;
  value: string;
}

type NavTab =
  | "overview" | "details" | "participants" | "suppliers"
  | "documents" | "approvals" | "communications" | "risks"
  | "compliance" | "financials" | "performance" | "audit" | "ai";

type WorkAreaTab = "form" | "checklist" | "instructions";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_RECORD: WorkbenchRecord = {
  recordNumber: "TND-2026-001",
  referenceNumber: "ZW-PRA-2026-00183",
  title: "Procurement of Antiretroviral Medicines (2-Year Framework)",
  ministry: "Ministry of Health & Child Care",
  department: "Pharmacy & Medicines Control",
  financialYear: "2026/2027",
  budgetCode: "BC-MHCC-2026-0041",
  procurementType: "Tender",
  currentStage: "Technical Evaluation",
  status: "Pending",
  priority: "High",
  dueDate: "2026-06-25",
  ageOnStage: "3 days",
  owner: "D. Moyo",
  organization: "Ministry of Health & Child Care",
  percentageComplete: 46,
  processStage: "Initiator",
  userRole: "Initiator",
  userName: "D. Moyo",
  userJobTitle: "Senior Procurement Officer",
  userLocation: "Harare HQ",
  lastSaved: "2026-06-25 09:14",
  connectionStatus: "Online",
  version: "v3.2",
  value: "USD 42,500,000",
};

// ─── Stage definitions per procurement type ──────────────────────────────────
const STAGES_BY_TYPE: Record<string, string[]> = {
  Tender: [
    "Planning", "Requisition", "Preparation", "Approval", "Advertisement",
    "Supplier Mgmt", "Clarifications", "Bid Submission", "Bid Opening",
    "Admin Evaluation", "Technical Evaluation", "Financial Evaluation",
    "Combined Ranking", "Due Diligence", "Award Approval", "Notification",
    "Contract Draft", "Contract Execution", "Delivery", "Invoicing", "Payment", "Closeout",
  ],
  RFQ: [
    "Planning", "Requisition", "Preparation", "Quotation Invite",
    "Quote Submission", "Admin Evaluation", "Technical Evaluation", "Financial Evaluation",
    "Award", "Contract", "Delivery", "Invoicing", "Payment",
  ],
  RFP: [
    "Planning", "Requisition", "TOR Preparation", "Approval", "Advertisement",
    "Proposal Submission", "Admin Evaluation", "Technical Evaluation",
    "Financial Evaluation", "Negotiation", "Award", "Contract", "Delivery", "Payment",
  ],
  EOI: [
    "Planning", "EOI Preparation", "Approval", "EOI Advertisement",
    "EOI Submission", "Shortlisting", "Notification", "RFP Stage",
  ],
  Auction: [
    "Planning", "Asset Assessment", "Approval", "Advertisement",
    "Registration", "Pre-Auction", "Live Auction", "Award", "Payment", "Handover",
  ],
};

function getStagesForRecord(record: WorkbenchRecord): { stages: string[]; currentIndex: number } {
  const stages = STAGES_BY_TYPE[record.procurementType] ?? STAGES_BY_TYPE["Tender"];
  const idx = stages.findIndex(s => s.toLowerCase() === record.currentStage.toLowerCase());
  const currentIndex = idx >= 0 ? idx : Math.round((record.percentageComplete / 100) * (stages.length - 1));
  return { stages, currentIndex };
}

const MOCK_QUEUE_ITEMS = [
  { id: "WQ-001", title: "Technical Evaluation — ARV Medicines", type: "My Tasks",        priority: "High",   due: "2026-06-25", status: "active"   },
  { id: "WQ-002", title: "Approve RFQ-2026-0892 Award",          type: "Pending Tasks",   priority: "Medium", due: "2026-06-27", status: "pending"  },
  { id: "WQ-003", title: "BOQ Review — Highway Section 4",       type: "Overdue Tasks",   priority: "High",   due: "2026-06-22", status: "overdue"  },
  { id: "WQ-004", title: "EOI Shortlist — Water Treatment",      type: "Delegated Tasks", priority: "Low",    due: "2026-06-30", status: "delegated"},
];

const MOCK_DOCUMENTS = [
  { name: "Tender Document v3.pdf",     category: "Tender Documents",  size: "2.4 MB", uploaded: "2026-06-20", status: "Final"   },
  { name: "BOQ_ARV_2026.xlsx",          category: "Quotations",        size: "840 KB", uploaded: "2026-06-21", status: "Final"   },
  { name: "Evaluation Matrix.xlsx",     category: "Evaluation Reports",size: "1.1 MB", uploaded: "2026-06-23", status: "Draft"   },
  { name: "Budget Approval Letter.pdf", category: "Contracts",         size: "310 KB", uploaded: "2026-06-18", status: "Approved"},
];

const MOCK_AUDIT = [
  { user: "D. Moyo",       action: "Submitted Technical Evaluation",    timestamp: "2026-06-25 09:14", reason: "Evaluation scores consolidated"          },
  { user: "A. Chikwanda",  action: "Returned for Correction",           timestamp: "2026-06-24 16:42", reason: "Score sheet incomplete for Vendor 3"     },
  { user: "D. Moyo",       action: "Uploaded Evaluation Matrix v2",     timestamp: "2026-06-23 11:08", reason: "Revision of criteria weightings"         },
  { user: "L. Ndlovu",     action: "Approved Budget Confirmation",      timestamp: "2026-06-22 08:55", reason: "Budget line confirmed in IFMIS"          },
  { user: "System",        action: "AI Divergence Alert triggered",     timestamp: "2026-06-21 14:30", reason: "2 evaluators diverge >15 pts on Crit. 3" },
];

const MOCK_NOTES = [
  { author: "D. Moyo",      time: "09:14", type: "internal", text: "Score sheets uploaded. Awaiting CPO review before submission."                           },
  { author: "A. Chikwanda", time: "Yesterday", type: "comment", text: "Please verify evaluator declarations are signed for all 8 evaluators before advancing." },
  { author: "System AI",    time: "2 days ago", type: "alert",  text: "Evaluator divergence >15 pts on Criterion 3. Consensus meeting recommended."          },
];

const MOCK_PARTICIPANTS = [
  { name: "D. Moyo",       role: "Senior Procurement Officer", hierarchy: "Initiator"   as UserHierarchyRole, status: "Active",   task: "Evaluation coordination",  done: false },
  { name: "A. Chikwanda",  role: "Finance Officer",            hierarchy: "Approver"    as UserHierarchyRole, status: "Pending",  task: "Budget confirmation",      done: false },
  { name: "L. Ndlovu",     role: "Legal Officer",              hierarchy: "Authorizer"  as UserHierarchyRole, status: "Complete", task: "Compliance clearance",     done: true  },
  { name: "CPO — D. Sithole", role: "Chief Procurement Officer", hierarchy: "Authorizer" as UserHierarchyRole, status: "Pending", task: "Final sign-off",          done: false },
  { name: "S. Nkosi",      role: "Auditor",                    hierarchy: "Oversight"   as UserHierarchyRole, status: "Viewer",   task: "Observation only",         done: false },
];

const MOCK_SUPPLIERS = [
  { id: "VEN-00481", name: "Zimbabwe Pharma Holdings",    score: 87, financial: 92, status: "Qualified",   risk: "Low",    bids: 1 },
  { id: "VEN-00495", name: "Harare Pharma Distributors", score: 74, financial: 81, status: "Qualified",   risk: "Low",    bids: 1 },
  { id: "VEN-00502", name: "Bulawayo Medical Supplies",  score: 68, financial: 70, status: "Qualified",   risk: "Medium", bids: 1 },
  { id: "VEN-00511", name: "Eastern Pharma Ltd",         score: 55, financial: 62, status: "Under Review",risk: "Medium", bids: 1 },
  { id: "VEN-00478", name: "Mutare Drug Consortium",     score: 41, financial: 38, status: "Non-Responsive", risk: "High", bids: 1 },
];

const MOCK_APPROVALS = [
  { stage: "Budget Confirmation",    approver: "L. Ndlovu",    role: "Finance Officer",    date: "2026-06-22", status: "Approved",  comment: "Budget line BC-MHCC-2026-0041 confirmed" },
  { stage: "Legal Clearance",        approver: "A. Mpofu",     role: "Legal Officer",       date: "2026-06-23", status: "Approved",  comment: "Procurement method compliant with PPDPA" },
  { stage: "Technical Evaluation",   approver: "D. Moyo",      role: "Procurement Officer", date: "—",          status: "Pending",   comment: "" },
  { stage: "Adjudication Board",     approver: "CPO Board",    role: "Adjudicator",         date: "—",          status: "Not Yet",   comment: "" },
  { stage: "Award Authorisation",    approver: "PS — R. Dube", role: "Authorizer",          date: "—",          status: "Not Yet",   comment: "" },
];

const MOCK_RISKS = [
  { id: "RSK-001", title: "Evaluator score divergence",        category: "Process",    level: "High",   status: "Open",      owner: "D. Moyo",      mitigation: "Schedule consensus meeting before submission" },
  { id: "RSK-002", title: "Budget utilisation at 94%",         category: "Financial",  level: "Medium", status: "Monitoring",owner: "A. Chikwanda", mitigation: "Budget officer monitoring IFMIS weekly" },
  { id: "RSK-003", title: "Single-source risk — 1 qualified",  category: "Supply",     level: "Medium", status: "Open",      owner: "D. Moyo",      mitigation: "Non-responsive suppliers under appeal review" },
  { id: "RSK-004", title: "Deadline risk — 2 days remaining",  category: "Time",       level: "High",   status: "Escalated", owner: "CPO",          mitigation: "CPO expediting sign-offs" },
];

// ─── 1. Context Header ────────────────────────────────────────────────────────
function ContextHeader({ record }: { record: WorkbenchRecord }) {
  const statusColors = {
    Open: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
    "On Hold": "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };
  const roleColors: Record<UserHierarchyRole, string> = {
    Initiator:  "bg-blue-600 text-white",
    Approver:   "bg-violet-600 text-white",
    Authorizer: "bg-emerald-600 text-white",
    Adjudicator:"bg-amber-600 text-white",
    Oversight:  "bg-red-600 text-white",
  };

  return (
    <div className="bg-white border-b border-black/10 px-4 py-3 flex-shrink-0">
      {/* Row 1: Record identity */}
      <div className="flex flex-wrap items-start gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-xs font-mono font-bold text-black/60">{record.recordNumber}</span>
            <span className="text-[10px] text-black/30">·</span>
            <span className="text-xs font-mono text-black/50">{record.referenceNumber}</span>
            <Badge tone="blue">{record.procurementType}</Badge>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusColors[record.status]}`}>{record.status}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityColors[record.priority]}`}>{record.priority}</span>
          </div>
          <h2 className="text-sm font-semibold text-black leading-snug">{record.title}</h2>
        </div>
        {/* User role pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0 ${roleColors[record.userRole]}`}>
          <Users className="h-3 w-3" />
          <span className="text-[11px] font-bold">{record.userRole}</span>
        </div>
      </div>

      {/* Row 2: Metadata grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1 text-[11px]">
        {[
          { label: "Ministry",      value: record.ministry },
          { label: "Dept",          value: record.department },
          { label: "Fin. Year",     value: record.financialYear },
          { label: "Budget Code",   value: record.budgetCode },
          { label: "Stage",         value: record.currentStage },
          { label: "Due Date",      value: record.dueDate },
          { label: "Age on Stage",  value: record.ageOnStage },
          { label: "Owner",         value: record.owner },
          { label: "Value",         value: record.value },
          { label: "Organization",  value: record.organization },
          { label: "User",          value: `${record.userName} · ${record.userJobTitle}` },
          { label: "Location",      value: record.userLocation },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <span className="text-black/40 font-medium">{label}: </span>
            <span className="text-black font-semibold truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Row 3: Progress bar */}
      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 bg-black/8 rounded-full h-1.5 overflow-hidden">
          <div className="bg-black h-full rounded-full transition-all" style={{ width: `${record.percentageComplete}%` }} />
        </div>
        <span className="text-[10px] font-bold text-black/60 flex-shrink-0">{record.percentageComplete}% complete</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className={`h-1.5 w-1.5 rounded-full ${record.connectionStatus === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-[10px] text-black/40">{record.connectionStatus} · {record.lastSaved} · {record.version}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Workflow Progress Tracker ─────────────────────────────────────────────
function WorkflowProgressTracker({ stages, currentIndex }: { stages: string[]; currentIndex: number; record?: WorkbenchRecord }) {
  // Show 2 before, current, 2 after — fitting in the window
  const start = Math.max(0, currentIndex - 2);
  const end   = Math.min(stages.length, currentIndex + 3);
  const visible = stages.slice(start, end).map((label, i) => ({
    label,
    index: start + i,
    status: start + i < currentIndex ? "completed" : start + i === currentIndex ? "active" : "pending",
  }));
  const pct = Math.round((currentIndex / (stages.length - 1)) * 100);

  return (
    <div className="bg-white border-b border-black/10 px-4 py-2.5 flex-shrink-0">
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
        {start > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-black/30 mr-2 flex-shrink-0">
            <ChevronLeft className="h-3 w-3" /> {start} before
          </div>
        )}
        {visible.map((s, i) => (
          <div key={s.index} className="flex items-center flex-shrink-0">
            <div className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors
              ${s.status === "active" ? "bg-black text-white" : s.status === "completed" ? "text-emerald-600" : "text-black/30"}`}>
              <div className={`h-5 w-5 rounded-full flex items-center justify-center mb-0.5 text-[9px] font-bold
                ${s.status === "active" ? "bg-white text-black" : s.status === "completed" ? "bg-emerald-500 text-white" : "bg-black/10 text-black/40"}`}>
                {s.status === "completed" ? <Check className="h-3 w-3" /> : s.index + 1}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${s.status === "active" ? "text-white" : ""}`}>{s.label}</span>
            </div>
            {i < visible.length - 1 && (
              <div className={`w-6 h-0.5 flex-shrink-0 ${s.status === "completed" ? "bg-emerald-400" : "bg-black/10"}`} />
            )}
          </div>
        ))}
        {end < stages.length && (
          <div className="flex items-center gap-1 text-[10px] text-black/30 ml-2 flex-shrink-0">
            {stages.length - end} more <ChevronRight className="h-3 w-3" />
          </div>
        )}
        <div className="ml-auto pl-4 flex items-center gap-2 flex-shrink-0">
          <div className="w-20 bg-black/8 rounded-full h-1.5 overflow-hidden">
            <div className="bg-black h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-black/50 font-semibold">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Navigation Panel ──────────────────────────────────────────────────────
const NAV_TABS: { key: NavTab; label: string; icon: React.ElementType }[] = [
  { key: "overview",        label: "Overview",        icon: Eye           },
  { key: "details",         label: "Details",         icon: FileText      },
  { key: "participants",    label: "Participants",     icon: Users         },
  { key: "suppliers",       label: "Suppliers",       icon: Users         },
  { key: "documents",       label: "Documents",       icon: FileText      },
  { key: "approvals",       label: "Approvals",       icon: CheckCircle2  },
  { key: "communications",  label: "Comms",           icon: MessageSquare },
  { key: "risks",           label: "Risks",           icon: AlertTriangle },
  { key: "compliance",      label: "Compliance",      icon: Shield        },
  { key: "financials",      label: "Financials",      icon: DollarSign    },
  { key: "performance",     label: "Performance",     icon: BarChart3     },
  { key: "audit",           label: "Audit",           icon: Lock          },
  { key: "ai",              label: "AI Assistant",    icon: Sparkles      },
];

const QUEUE_FILTERS: WorkQueueStatus[] = [
  "My Tasks", "Pending Tasks", "Overdue Tasks", "Escalated Tasks", "Delegated Tasks",
];

function NavigationPanel({
  activeTab, onTabChange,
  queueFilter, onQueueFilterChange,
}: {
  activeTab: NavTab;
  onTabChange: (t: NavTab) => void;
  queueFilter: WorkQueueStatus;
  onQueueFilterChange: (f: WorkQueueStatus) => void;
}) {
  return (
    <div className="flex flex-col h-full border-r border-black/10 bg-white overflow-hidden">
      {/* Section label */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider">Navigation</span>
      </div>
      {/* Nav tabs */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0">
        <div className="space-y-0.5">
          {NAV_TABS.map(t => (
            <button key={t.key} onClick={() => onTabChange(t.key)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors
                ${activeTab === t.key ? "bg-black text-white" : "text-black/55 hover:bg-[#F5F5F5] hover:text-black"}`}>
              <t.icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
        {/* Work Queue section */}
        <div className="mt-3 pt-2 border-t border-black/8">
          <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider px-2 mb-1 block">Work Queue</span>
          {QUEUE_FILTERS.map(f => {
            const count = MOCK_QUEUE_ITEMS.filter(q => q.type === f).length;
            return (
              <button key={f} onClick={() => onQueueFilterChange(f)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors
                  ${queueFilter === f ? "bg-black text-white" : "text-black/55 hover:bg-[#F5F5F5] hover:text-black"}`}>
                <span className="truncate">{f}</span>
                {count > 0 && (
                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${queueFilter === f ? "bg-white/20 text-white" : "bg-black/10 text-black/50"}`}>{count}</span>
                )}
              </button>
            );
          })}
          {/* Queue item preview */}
          {MOCK_QUEUE_ITEMS.filter(q => q.type === queueFilter).map(q => (
            <div key={q.id} className={`mx-1 mt-1 p-2 rounded-lg border text-[10px] cursor-pointer hover:bg-[#F5F5F5]
              ${q.status === "overdue" ? "border-red-100 bg-red-50" : q.status === "active" ? "border-blue-100 bg-blue-50" : "border-black/8"}`}>
              <div className="font-semibold text-black truncate">{q.title}</div>
              <div className={`mt-0.5 ${q.status === "overdue" ? "text-red-500" : "text-black/40"}`}>Due: {q.due}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Main Work Area ────────────────────────────────────────────────────────
function MainWorkArea({ activeTab, record }: { activeTab: NavTab; record: WorkbenchRecord }) {
  const [checks, setChecks] = useState({
    specAttached: true, budgetApproved: true, evalCompleted: false,
    declarationsSigned: false, conflictsChecked: true,
  });
  const [workAreaTab, setWorkAreaTab] = useState<WorkAreaTab>("form");
  const toggle = (k: keyof typeof checks) => setChecks(p => ({ ...p, [k]: !p[k] }));
  const act = (msg: string) => pushNotification(msg, "success");

  const roleColors: Record<UserHierarchyRole, string> = {
    Initiator:   "bg-blue-100 text-blue-700",
    Approver:    "bg-violet-100 text-violet-700",
    Authorizer:  "bg-emerald-100 text-emerald-700",
    Adjudicator: "bg-amber-100 text-amber-700",
    Oversight:   "bg-red-100 text-red-700",
  };

  if (activeTab === "overview") return (
    <div className="flex flex-col h-full">
      {/* Work area sub-tabs: Form / Checklist / Instructions */}
      <div className="flex border-b border-black/8 bg-white flex-shrink-0 px-4 pt-2">
        {([
          { key: "form"         as WorkAreaTab, label: "Work Form"        },
          { key: "checklist"    as WorkAreaTab, label: "Checklist"        },
          { key: "instructions" as WorkAreaTab, label: "Task Instructions"},
        ] as { key: WorkAreaTab; label: string }[]).map(t => (
          <button key={t.key} onClick={() => setWorkAreaTab(t.key)}
            className={`px-3 pb-2 text-[10px] font-semibold border-b-2 transition-colors -mb-px mr-1
              ${workAreaTab === t.key ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Work area content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {workAreaTab === "form" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Record Type",     value: record.procurementType,    color: "bg-blue-50 border-blue-100 text-blue-800"    },
                { label: "Current Stage",   value: record.currentStage,       color: "bg-black text-white border-black"             },
                { label: "Value",           value: record.value,              color: "bg-emerald-50 border-emerald-100 text-emerald-800" },
                { label: "Completion",      value: `${record.percentageComplete}%`, color: "bg-violet-50 border-violet-100 text-violet-800" },
              ].map(c => (
                <div key={c.label} className={`p-3 rounded-xl border ${c.color}`}>
                  <div className="text-[10px] font-medium opacity-70">{c.label}</div>
                  <div className="text-sm font-bold mt-0.5">{c.value}</div>
                </div>
              ))}
            </div>
            {/* Stage-specific data entry form */}
            <div className="p-3 bg-white border border-black/10 rounded-xl space-y-3">
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Stage Work Form — {record.currentStage}</div>
              {[
                { label: "Description / Notes", type: "textarea", placeholder: "Enter evaluation summary or stage notes…" },
                { label: "Recommendation",      type: "textarea", placeholder: "State your recommendation for this stage…" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[10px] font-semibold text-black/50 mb-1">{f.label}</label>
                  <textarea rows={2} placeholder={f.placeholder}
                    className="w-full px-3 py-2 text-xs border border-black/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black/10" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Amount (USD)",  placeholder: "e.g. 42,500,000" },
                  { label: "Budget Code",   placeholder: record.budgetCode  },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[10px] font-semibold text-black/50 mb-1">{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full h-8 px-3 text-xs border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" />
                  </div>
                ))}
              </div>
            </div>
            {/* Editable items table */}
            <div className="p-3 bg-white border border-black/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Line Items</div>
                <button onClick={() => act("Row added")} className="h-6 px-2 bg-black text-white rounded-lg text-[9px] flex items-center gap-1 hover:opacity-90">
                  <Plus className="h-3 w-3" /> Add Row
                </button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-black/8">
                    {["Item", "Qty", "Unit Price (USD)", "Total (USD)"].map(h => (
                      <th key={h} className="text-left text-[9px] font-bold text-black/40 uppercase pb-1.5 pr-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: "Tenofovir/Lamivudine/Efavirenz 300/300/600mg",  qty: "2,400,000", unit: "4.20",  total: "10,080,000" },
                    { item: "Abacavir/Lamivudine 600/300mg",                 qty: "1,800,000", unit: "5.80",  total: "10,440,000" },
                    { item: "Dolutegravir 50mg",                             qty: "3,200,000", unit: "6.25",  total: "20,000,000" },
                    { item: "Logistics & Cold Chain (2%)",                   qty: "—",          unit: "—",     total: "810,000"    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-black/5 hover:bg-[#F5F5F5]">
                      <td className="py-1.5 pr-2 text-black/80">{row.item}</td>
                      <td className="py-1.5 pr-2 text-black/60">{row.qty}</td>
                      <td className="py-1.5 pr-2 text-black/60">{row.unit}</td>
                      <td className="py-1.5 text-black font-semibold">{row.total}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black/20">
                    <td colSpan={3} className="py-2 text-xs font-bold text-right pr-2">TOTAL</td>
                    <td className="py-2 text-sm font-bold text-black">41,330,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* AI alert */}
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>AI Alert:</strong> Evaluator divergence of &gt;15 pts on Criterion 3 — consensus meeting required before submission.
              </div>
            </div>
          </>
        )}

        {workAreaTab === "checklist" && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-black/50 mb-1">Stage Completeness Checklist</div>
            {[
              { key: "specAttached"       as const, label: "Specification / TOR attached",          required: true  },
              { key: "budgetApproved"     as const, label: "Budget approved and confirmed",          required: true  },
              { key: "evalCompleted"      as const, label: "Evaluation completed and signed",        required: true  },
              { key: "declarationsSigned" as const, label: "All evaluator declarations signed",      required: true  },
              { key: "conflictsChecked"   as const, label: "Conflict of interest checks done",       required: true  },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border border-black/8 rounded-xl cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                <div onClick={() => toggle(item.key)}
                  className={`h-5 w-5 rounded-md border-2 grid place-items-center flex-shrink-0 transition-colors cursor-pointer
                    ${checks[item.key] ? "bg-black border-black" : "border-black/20"}`}>
                  {checks[item.key] && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs text-black flex-1">{item.label}</span>
                {item.required && <span className="text-[9px] text-red-500 font-semibold">Required</span>}
                {checks[item.key] && <span className="text-[10px] text-emerald-600 font-semibold">✓ Met</span>}
              </label>
            ))}
            <div className={`p-2.5 rounded-xl text-xs font-semibold text-center ${Object.values(checks).every(Boolean) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {Object.values(checks).filter(Boolean).length}/{Object.values(checks).length} items met
              {!Object.values(checks).every(Boolean) && " — resolve all before submitting"}
            </div>
          </div>
        )}

        {workAreaTab === "instructions" && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-black/50 mb-1">Task Instructions — {record.currentStage}</div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed">
              <strong>Your role: {record.userRole}.</strong> As the {record.userRole}, you are responsible for completing the current stage tasks listed below before submitting for {record.userRole === "Initiator" ? "Approver" : record.userRole === "Approver" ? "Authorizer" : "the next stage"} review.
            </div>
            {[
              { step: 1, title: "Review all submitted evaluation score sheets",               done: true  },
              { step: 2, title: "Verify all 8 evaluators have signed independence declarations", done: true  },
              { step: 3, title: "Identify and resolve any evaluator score divergences >15 pts",  done: false },
              { step: 4, title: "Prepare consolidated evaluation matrix for CPO sign-off",       done: false },
              { step: 5, title: "Upload signed evaluation report to the documents panel",        done: false },
              { step: 6, title: "Complete the stage work form with recommendation",              done: false },
            ].map(s => (
              <div key={s.step} className={`flex items-start gap-3 p-3 border rounded-xl ${s.done ? "border-emerald-100 bg-emerald-50" : "border-black/8 bg-white"}`}>
                <div className={`h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold flex-shrink-0 ${s.done ? "bg-emerald-500 text-white" : "bg-black/10 text-black/40"}`}>
                  {s.done ? <Check className="h-3.5 w-3.5" /> : s.step}
                </div>
                <span className={`text-xs ${s.done ? "text-emerald-700 line-through opacity-70" : "text-black"}`}>{s.title}</span>
              </div>
            ))}
            <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                <span className="text-[10px] font-bold text-violet-700">AI Guidance</span>
              </div>
              <p className="text-xs text-violet-700 leading-relaxed">Based on the current state of this record, your priority action is to <strong>schedule a consensus meeting</strong> with the evaluation committee to resolve the score divergence on Criterion 3 before proceeding.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (activeTab === "details") return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-black/50 mb-1">Core Procurement Information</div>
      {[
        { label: "Description",        value: "Procurement of antiretroviral medicines for a 2-year framework contract covering national distribution.", full: true },
        { label: "Estimated Value",    value: record.value },
        { label: "Budget Code",        value: record.budgetCode },
        { label: "Method",             value: "Open Tender — Framework Contract" },
        { label: "Financial Year",     value: record.financialYear },
        { label: "Procuring Entity",   value: record.organization },
        { label: "Responsible Officer",value: `${record.userName} — ${record.userJobTitle}` },
        { label: "Ministry",           value: record.ministry },
        { label: "Department",         value: record.department },
      ].map(f => (
        <div key={f.label} className={`flex ${(f as any).full ? "flex-col gap-0.5" : "items-start gap-2"} p-2.5 border border-black/8 rounded-lg`}>
          <span className="text-[11px] font-medium text-black/50 flex-shrink-0 w-36">{f.label}:</span>
          <span className="text-xs text-black">{f.value}</span>
        </div>
      ))}
    </div>
  );

  if (activeTab === "participants") return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-black/60">Participants — Role Hierarchy</span>
        <button onClick={() => act("User added")} className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] flex items-center gap-1 hover:opacity-90">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      {MOCK_PARTICIPANTS.map((p, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-black text-white text-[10px] font-bold grid place-items-center flex-shrink-0">
              {p.name.split(" ").map((x: string) => x[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-black truncate">{p.name}</div>
              <div className="text-[10px] text-black/40 truncate">{p.role} · {p.task}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${roleColors[p.hierarchy]}`}>{p.hierarchy}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${p.done ? "bg-emerald-100 text-emerald-700" : p.status === "Active" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
              {p.done ? "Done" : p.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  if (activeTab === "suppliers") return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-black/60">Bidders & Vendors — {MOCK_SUPPLIERS.length} registered</span>
        <span className="text-[10px] bg-black/5 text-black/50 px-2 py-0.5 rounded-full">8 bids received</span>
      </div>
      {MOCK_SUPPLIERS.map((s) => (
        <div key={s.id} className="p-3 border border-black/8 rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-black truncate">{s.name}</div>
              <div className="text-[10px] text-black/40">{s.id}</div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${s.status === "Qualified" ? "bg-emerald-100 text-emerald-700" : s.status === "Under Review" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{s.status}</span>
              <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${s.risk === "Low" ? "bg-emerald-50 text-emerald-600" : s.risk === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>{s.risk}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-black/50">Tech: <strong className="text-black">{s.score}</strong></span>
            <span className="text-[10px] text-black/50">Financial: <strong className="text-black">{s.financial}</strong></span>
            <div className="flex-1 bg-black/8 rounded-full h-1 overflow-hidden">
              <div className="bg-black h-full rounded-full" style={{ width: `${s.score}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (activeTab === "approvals") return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-black/60 mb-1">Approval Chain & History</div>
      {MOCK_APPROVALS.map((a, i) => (
        <div key={i} className="flex gap-3 p-3 border border-black/8 rounded-xl">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`h-6 w-6 rounded-full grid place-items-center
              ${a.status === "Approved" ? "bg-emerald-500" : a.status === "Pending" ? "bg-amber-400" : "bg-black/10"}`}>
              {a.status === "Approved" ? <Check className="h-3 w-3 text-white" /> : <Clock className="h-3 w-3 text-white" />}
            </div>
            {i < MOCK_APPROVALS.length - 1 && <div className="w-px flex-1 bg-black/8 mt-0.5 mb-0.5 min-h-[12px]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-black">{a.stage}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0
                ${a.status === "Approved" ? "bg-emerald-100 text-emerald-700" : a.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                {a.status}
              </span>
            </div>
            <div className="text-[10px] text-black/50 mt-0.5">{a.approver} · {a.role}{a.date !== "—" ? ` · ${a.date}` : ""}</div>
            {a.comment && <div className="text-[10px] text-black/40 italic mt-0.5">"{a.comment}"</div>}
          </div>
        </div>
      ))}
      <button onClick={() => act("Submitted for next approval")} className="w-full h-9 mt-1 bg-black text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity">
        Submit for Next Approval
      </button>
    </div>
  );

  if (activeTab === "communications") return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-black/60">Communications — Messages & Clarifications</div>
      <div className="flex gap-2 flex-wrap">
        {["Team Chat", "Clarification Request", "Meeting Notes"].map(t => (
          <button key={t} onClick={() => act(`${t} opened`)} className="h-7 px-2.5 border border-black/10 rounded-lg text-[10px] hover:bg-black hover:text-white transition-colors">{t}</button>
        ))}
      </div>
      {MOCK_NOTES.map((n, i) => (
        <div key={i} className="p-3 border border-black/8 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center flex-shrink-0">
              {n.author.split(" ").map((x: string) => x[0]).join("").slice(0, 2)}
            </div>
            <span className="text-xs font-semibold text-black">{n.author}</span>
            <span className="text-[10px] text-black/30 ml-auto">{n.time}</span>
          </div>
          <p className="text-xs text-black/70 leading-relaxed pl-7">{n.text}</p>
        </div>
      ))}
    </div>
  );

  if (activeTab === "risks") return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-black/60">Risk Register</span>
        <button onClick={() => act("Risk logged")} className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] flex items-center gap-1 hover:opacity-90">
          <Flag className="h-3 w-3" /> Log Risk
        </button>
      </div>
      {MOCK_RISKS.map((r) => (
        <div key={r.id} className={`p-3 border rounded-xl ${r.level === "High" ? "border-red-100 bg-red-50" : "border-amber-100 bg-amber-50"}`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-black">{r.title}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${r.level === "High" ? "bg-red-200 text-red-700" : "bg-amber-200 text-amber-700"}`}>{r.level}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${r.status === "Open" ? "bg-blue-100 text-blue-700" : r.status === "Escalated" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{r.status}</span>
            </div>
          </div>
          <div className="text-[10px] text-black/50 mb-0.5">{r.category} · Owner: {r.owner}</div>
          <div className="text-[10px] text-black/60 italic">Mitigation: {r.mitigation}</div>
        </div>
      ))}
    </div>
  );

  if (activeTab === "compliance") return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-black/50">Compliance Checklist</div>
      {[
        { key: "specAttached"      as const, label: "Specification / TOR attached"      },
        { key: "budgetApproved"    as const, label: "Budget approved and confirmed"      },
        { key: "evalCompleted"     as const, label: "Evaluation completed and signed"    },
        { key: "declarationsSigned"as const, label: "All evaluator declarations signed"  },
        { key: "conflictsChecked"  as const, label: "Conflict of interest checks done"   },
      ].map(item => (
        <label key={item.key} className="flex items-center gap-3 p-3 border border-black/8 rounded-xl cursor-pointer hover:bg-[#F5F5F5] transition-colors">
          <div onClick={() => toggle(item.key)}
            className={`h-5 w-5 rounded-md border-2 grid place-items-center flex-shrink-0 transition-colors cursor-pointer
              ${checks[item.key] ? "bg-black border-black" : "border-black/20"}`}>
            {checks[item.key] && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-xs text-black flex-1">{item.label}</span>
          {checks[item.key] && <span className="text-[10px] text-emerald-600 font-semibold">✓ Met</span>}
        </label>
      ))}
      <div className={`p-2.5 rounded-xl text-xs font-semibold text-center ${Object.values(checks).every(Boolean) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {Object.values(checks).filter(Boolean).length}/{Object.values(checks).length} items met
        {!Object.values(checks).every(Boolean) && " — resolve all before submitting"}
      </div>
    </div>
  );

  if (activeTab === "financials") return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-black/50">Budget & Expenditure</div>
      {[
        { label: "Approved Budget",    value: "USD 45,000,000", cls: "bg-blue-50 border-blue-100 text-blue-800"    },
        { label: "Committed (PO)",     value: "USD 42,500,000", cls: "bg-amber-50 border-amber-100 text-amber-800" },
        { label: "Invoiced to Date",   value: "USD 0",          cls: "bg-gray-50 border-gray-200 text-gray-700"    },
        { label: "Available Balance",  value: "USD 2,500,000",  cls: "bg-emerald-50 border-emerald-100 text-emerald-800" },
      ].map(b => (
        <div key={b.label} className={`flex items-center justify-between p-3 border rounded-xl ${b.cls}`}>
          <span className="text-xs font-medium">{b.label}</span>
          <span className="text-sm font-bold">{b.value}</span>
        </div>
      ))}
    </div>
  );

  if (activeTab === "performance") return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-black/50">KPIs & Performance Tracking</div>
      {[
        { label: "Cycle Time",             value: "18 days", target: "14 days", met: false, bar: 70  },
        { label: "Compliance Score",        value: "82%",     target: "90%",     met: false, bar: 82  },
        { label: "Evaluator Participation", value: "8/8",     target: "8/8",     met: true,  bar: 100 },
        { label: "Document Completeness",   value: "94%",     target: "100%",    met: false, bar: 94  },
        { label: "Budget Accuracy",         value: "On track",target: "On track",met: true,  bar: 96  },
      ].map(k => (
        <div key={k.label} className="p-3 border border-black/8 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-black">{k.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-black">{k.value}</span>
              <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${k.met ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {k.met ? "✓ Met" : `Target: ${k.target}`}
              </span>
            </div>
          </div>
          <div className="w-full bg-black/8 rounded-full h-1 overflow-hidden">
            <div className={`h-full rounded-full ${k.met ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${k.bar}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (activeTab === "audit") return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-black/60">Activity History</span>
        <span className="text-[10px] text-black/30 italic">Immutable — nothing hidden</span>
      </div>
      {MOCK_AUDIT.map((a, i) => (
        <div key={i} className="flex gap-3 p-2.5 border border-black/8 rounded-xl">
          <div className="h-6 w-6 rounded-full bg-black/10 text-black/50 text-[9px] font-bold grid place-items-center flex-shrink-0">
            {a.user.split(" ").map((x: string) => x[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-black">{a.user}</span>
              <span className="text-[10px] text-black/30 flex-shrink-0">{a.timestamp}</span>
            </div>
            <p className="text-xs text-black/70 mt-0.5">{a.action}</p>
            {a.reason && <p className="text-[10px] text-black/40 italic mt-0.5">"{a.reason}"</p>}
          </div>
        </div>
      ))}
    </div>
  );

  if (activeTab === "ai") return (
    <div className="p-4 space-y-3">
      <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500 flex-shrink-0" />
        <div>
          <div className="text-xs font-bold text-violet-800">Procurement AI Assistant — Active</div>
          <div className="text-[10px] text-violet-600">Monitoring this record · 94% confidence</div>
        </div>
        <span className="ml-auto h-2 w-2 rounded-full bg-violet-500 animate-pulse flex-shrink-0" />
      </div>
      {[
        { insight: "2 evaluators diverge >15 pts on Criterion 3 — consensus required",  action: "Schedule Meeting", priority: "High"   },
        { insight: "Budget at 94% utilisation — approaching ceiling",                   action: "Review Budget",    priority: "Medium" },
        { insight: "Vendor VEN-00511 has increased risk profile since last submission", action: "Review Vendor",    priority: "Medium" },
        { insight: "Deadline in 2 days — fast-track CPO sign-off today",               action: "Escalate Now",     priority: "High"   },
      ].map((item, i) => (
        <div key={i} className={`p-3 border rounded-xl flex items-start gap-2 ${item.priority === "High" ? "border-red-100 bg-red-50" : "border-amber-100 bg-amber-50"}`}>
          <Sparkles className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${item.priority === "High" ? "text-red-400" : "text-amber-400"}`} />
          <p className={`text-xs flex-1 ${item.priority === "High" ? "text-red-800" : "text-amber-800"}`}>{item.insight}</p>
          <button onClick={() => act(item.action)} className="h-6 px-2 rounded-lg bg-black text-white text-[9px] font-medium hover:opacity-90 flex-shrink-0 whitespace-nowrap">{item.action}</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input placeholder="Ask AI about this procurement…" className="flex-1 h-8 px-3 text-xs border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200" />
        <button onClick={() => act("AI query sent")} className="h-8 px-3 bg-violet-600 text-white rounded-xl text-xs hover:bg-violet-700 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Ask
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 flex flex-col items-center justify-center h-32 text-black/30">
      <FileText className="h-8 w-8 mb-2 opacity-40" />
      <span className="text-sm font-medium capitalize">{activeTab}</span>
    </div>
  );
}

// ─── 5. Action Panel ──────────────────────────────────────────────────────────
function ActionPanel({ record }: { record: WorkbenchRecord }) {
  const act = (msg: string) => pushNotification(msg, "success");
  const ACTIONS = [
    { label: "Save Draft",           icon: Save,       cls: "border border-black/10 text-black hover:bg-[#F5F5F5]",         fn: () => act("Draft saved — " + record.recordNumber)             },
    { label: "Submit",               icon: Send,       cls: "bg-black text-white hover:bg-black/90",                        fn: () => act("Submitted for approval — " + record.recordNumber)  },
    { label: "Approve",              icon: CheckCircle2, cls: "bg-emerald-600 text-white hover:bg-emerald-700",             fn: () => act("Approved — " + record.recordNumber)                },
    { label: "Return for Correction",icon: RotateCcw,  cls: "bg-amber-500 text-white hover:bg-amber-600",                  fn: () => act("Returned for correction")                          },
    { label: "Reject",               icon: XCircle,    cls: "bg-red-600 text-white hover:bg-red-700",                      fn: () => act("Rejected — " + record.recordNumber)                },
    { label: "Request Clarification",icon: HelpCircle, cls: "border border-blue-200 text-blue-700 hover:bg-blue-50",       fn: () => act("Clarification requested")                          },
    { label: "Escalate",             icon: ArrowUp,    cls: "border border-amber-200 text-amber-700 hover:bg-amber-50",    fn: () => act("Escalated to higher authority")                    },
    { label: "Delegate",             icon: UserPlus,   cls: "border border-violet-200 text-violet-700 hover:bg-violet-50", fn: () => act("Delegated to another user")                        },
    { label: "Hold",                 icon: PauseCircle,cls: "border border-gray-200 text-gray-600 hover:bg-gray-50",       fn: () => act("Process placed on hold")                           },
    { label: "Close",                icon: X,          cls: "border border-black/10 text-black/50 hover:bg-[#F5F5F5]",     fn: () => act("Task closed")                                      },
  ];
  return (
    <div className="flex flex-col h-full border-l border-black/10 bg-white overflow-hidden">
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider">Actions</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 min-h-0 space-y-1">
        {ACTIONS.map(a => (
          <button key={a.label} onClick={a.fn}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${a.cls}`}>
            <a.icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate text-left">{a.label}</span>
          </button>
        ))}
      </div>
      {/* AI recommendation */}
      <div className="flex-shrink-0 mx-2 mb-2 p-2.5 bg-violet-50 border border-violet-100 rounded-xl">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3 w-3 text-violet-500" />
          <span className="text-[10px] font-semibold text-violet-700">AI Recommends</span>
        </div>
        <p className="text-[10px] text-violet-600 leading-snug">Schedule consensus meeting before submitting — 2 evaluator scores diverge by &gt;15 pts.</p>
      </div>
    </div>
  );
}

// ─── 6. Documents & Attachments Panel ────────────────────────────────────────
function DocumentsPanel() {
  const act = (msg: string) => pushNotification(msg, "success");
  const cats = Array.from(new Set(MOCK_DOCUMENTS.map(d => d.category)));
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-black/60">Documents & Attachments</span>
        <div className="flex gap-1">
          <button onClick={() => act("Document uploaded")} className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] flex items-center gap-1 hover:opacity-90">
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button onClick={() => act("Documents downloaded")} className="h-7 px-2.5 border border-black/10 rounded-lg text-[10px] flex items-center gap-1 hover:bg-[#F5F5F5]">
            <Download className="h-3 w-3" /> All
          </button>
        </div>
      </div>
      {cats.map(cat => (
        <div key={cat}>
          <div className="text-[10px] font-semibold text-black/40 uppercase tracking-wider mb-1">{cat}</div>
          {MOCK_DOCUMENTS.filter(d => d.category === cat).map(doc => (
            <div key={doc.name} className="flex items-center justify-between p-2.5 border border-black/8 rounded-xl hover:bg-[#F5F5F5] group mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 text-black/30 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-black truncate">{doc.name}</div>
                  <div className="text-[10px] text-black/40">{doc.size} · {doc.uploaded}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${doc.status === "Final" || doc.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{doc.status}</span>
                <button onClick={() => act(`Viewing ${doc.name}`)} className="h-6 px-1.5 rounded bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors"><Eye className="h-3 w-3" /></button>
                <button onClick={() => act(`Downloaded ${doc.name}`)} className="h-6 px-1.5 rounded bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors"><Download className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── 7. Notes & Communications Panel ─────────────────────────────────────────
function NotesPanel() {
  const [note, setNote] = useState("");
  const act = (msg: string) => pushNotification(msg, "success");
  const typeColors = {
    internal: "bg-blue-50 text-blue-700 border-blue-100",
    comment:  "bg-gray-100 text-gray-600 border-gray-200",
    alert:    "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-black/60">Notes, Discussions & Communications</div>
      <div className="space-y-2">
        {MOCK_NOTES.map((n, i) => (
          <div key={i} className="p-3 border border-black/8 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center flex-shrink-0">
                  {n.author.split(" ").map(x => x[0]).join("").slice(0, 2)}
                </div>
                <span className="text-xs font-semibold text-black">{n.author}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${typeColors[n.type as keyof typeof typeColors]}`}>{n.type}</span>
              </div>
              <span className="text-[10px] text-black/30">{n.time}</span>
            </div>
            <p className="text-xs text-black/70 leading-relaxed pl-7">{n.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
          placeholder="Add an internal note or comment…"
          className="flex-1 px-3 py-2 text-xs border border-black/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/10" />
        <button onClick={() => { act("Note added"); setNote(""); }}
          className="h-9 px-3 bg-black text-white rounded-xl text-xs self-end hover:opacity-90">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── 8. Audit Trail & Activity History ────────────────────────────────────────
function AuditTrailPanel() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-black/60">Audit Trail & Activity History</span>
        <span className="text-[10px] text-black/40 bg-black/5 px-2 py-0.5 rounded-full">Nothing happens without appearing here</span>
      </div>
      <div className="space-y-2">
        {MOCK_AUDIT.map((a, i) => (
          <div key={i} className="flex gap-3 p-3 border border-black/8 rounded-xl">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-black/10 text-black/50 text-[9px] font-bold grid place-items-center">
                {a.user.split(" ").map(x => x[0]).join("").slice(0, 2)}
              </div>
              {i < MOCK_AUDIT.length - 1 && <div className="w-px flex-1 bg-black/8 mt-0.5" />}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-black">{a.user}</span>
                <span className="text-[10px] text-black/30 flex-shrink-0">{a.timestamp}</span>
              </div>
              <p className="text-xs text-black/70 mt-0.5">{a.action}</p>
              {a.reason && <p className="text-[11px] text-black/40 mt-0.5 italic">"{a.reason}"</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 9. Intelligence & Compliance Panel ──────────────────────────────────────
function IntelligencePanel() {
  const act = (msg: string) => pushNotification(msg, "info");
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-black/60">Intelligence & Compliance</div>
      {/* Compliance status */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Compliance Status</div>
        {[
          { label: "Required approvals",       met: true  },
          { label: "Missing documents",         met: true  },
          { label: "Procurement thresholds",    met: true  },
          { label: "Evaluator declarations",    met: false },
        ].map(c => (
          <div key={c.label} className={`flex items-center justify-between p-2 rounded-lg border ${c.met ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
            <span className={`text-xs ${c.met ? "text-emerald-700" : "text-red-700"}`}>{c.label}</span>
            <span className={`text-[10px] font-bold ${c.met ? "text-emerald-600" : "text-red-600"}`}>{c.met ? "✓ Met" : "✗ Missing"}</span>
          </div>
        ))}
      </div>
      {/* Risk indicators */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Risk Indicators</div>
        {[
          { label: "Evaluator divergence >15pts", level: "High"   },
          { label: "Budget utilisation 94%",       level: "Medium" },
          { label: "Deadline in 2 days",            level: "High"   },
        ].map(r => (
          <div key={r.label} className={`flex items-center justify-between p-2 rounded-lg border
            ${r.level === "High" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
            <span className={`text-xs ${r.level === "High" ? "text-red-700" : "text-amber-700"}`}>{r.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.level === "High" ? "bg-red-200 text-red-700" : "bg-amber-200 text-amber-700"}`}>{r.level}</span>
          </div>
        ))}
      </div>
      {/* SLA Monitor */}
      <div className="p-3 bg-black text-white rounded-xl">
        <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">SLA Monitor</div>
        <div className="text-sm font-bold">Remaining: 2 Days 4 Hours</div>
        <div className="w-full bg-white/20 rounded-full h-1.5 mt-1.5 overflow-hidden">
          <div className="bg-amber-400 h-full rounded-full" style={{ width: "78%" }} />
        </div>
      </div>
      {/* Recommendation engine */}
      <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-[10px] font-bold text-violet-700">Recommendation Engine</span>
        </div>
        <p className="text-xs text-violet-700">Next Recommended Action: <strong>Schedule consensus meeting</strong> to resolve evaluator divergence before advancing to Financial Evaluation.</p>
        <button onClick={() => act("AI recommendation noted")} className="mt-2 h-6 px-2.5 bg-violet-600 text-white text-[10px] rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Apply
        </button>
      </div>
    </div>
  );
}

// ─── 10. Status & System Information ─────────────────────────────────────────
function StatusBar({ record }: { record: WorkbenchRecord }) {
  return (
    <div className="bg-white border-t border-black/10 px-4 py-1.5 flex items-center gap-4 text-[10px] text-black/50 flex-shrink-0">
      <div className="flex items-center gap-1">
        <div className={`h-1.5 w-1.5 rounded-full ${record.connectionStatus === "Online" ? "bg-emerald-500" : "bg-red-500"}`} />
        {record.connectionStatus}
      </div>
      <span>Last saved: {record.lastSaved}</span>
      <span>Record: <span className="text-black font-medium">{record.status}</span></span>
      <span>Workflow: <span className="text-black font-medium">{record.currentStage}</span></span>
      <span>{record.version}</span>
      <span className="ml-auto">{record.userName} · {record.userLocation}</span>
    </div>
  );
}

// ─── 11 & 12. Search & Knowledge Centre (bottom tabs) ────────────────────────
type BottomTab = "search" | "knowledge" | "documents" | "notes" | "audit" | "intelligence" | "stages";

function BottomSection({ tab, setTab }: { tab: BottomTab; setTab: (t: BottomTab) => void }) {
  const tabs: { key: BottomTab; label: string }[] = [
    { key: "stages",       label: "📋 Stage Modules"   },
    { key: "documents",    label: "6. Documents"      },
    { key: "notes",        label: "7. Communications" },
    { key: "audit",        label: "8. Audit Trail"    },
    { key: "intelligence", label: "9. Intelligence"   },
    { key: "search",       label: "11. Search"        },
    { key: "knowledge",    label: "12. Knowledge"     },
  ];
  return (
    <div className="flex flex-col h-full border-t border-black/10 bg-white overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-black/8 flex-shrink-0">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-[10px] font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px flex-shrink-0
              ${tab === t.key ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === "stages"       && <StageModulesPanel />}
        {tab === "documents"    && <DocumentsPanel />}
        {tab === "notes"        && <NotesPanel />}
        {tab === "audit"        && <AuditTrailPanel />}
        {tab === "intelligence" && <IntelligencePanel />}
        {tab === "search"       && <SearchPanel />}
        {tab === "knowledge"    && <KnowledgePanel />}
      </div>
    </div>
  );
}

function StageModulesPanel() {
  const stages = [
    { num: 1, label: "Procurement Planning",   route: "/procurement/planning",             status: "completed", desc: "Annual plan · Budget · Demand"          },
    { num: 2, label: "Requisition",             route: "/procurement/requisition",          status: "completed", desc: "Purchase requisition · Items · Approval" },
    { num: 3, label: "Procurement Strategy",   route: "/procurement/strategy",             status: "completed", desc: "Method · Market · Supplier analysis"    },
    { num: 4, label: "Tender Preparation",     route: "/procurement/tender-preparation",   status: "active",    desc: "BOQ · Specs · Evaluation criteria"      },
    { num: 5, label: "Advertisement",          route: "/procurement/advertisement",        status: "pending",   desc: "Publication · Clarifications · Q&A"     },
    { num: 6, label: "Bid Submission",         route: "/procurement/bid-submission",       status: "pending",   desc: "Encrypted vault · Validation · Receipt"  },
    { num: 7, label: "Bid Opening",            route: "/lifecycle",                        status: "pending",   desc: "Opening ceremony · Register · Records"  },
    { num: 8, label: "Evaluation",             route: "/evaluations",                      status: "pending",   desc: "Admin · Technical · Financial scoring"  },
    { num: 9, label: "Award",                  route: "/awards",                           status: "pending",   desc: "Adjudication · Notice · Standstill"     },
    { num: 10, label: "Contract",              route: "/contracts",                        status: "pending",   desc: "Draft · Execute · Manage"               },
  ];
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold">Procurement Stage Modules — Full Lifecycle</div>
        <a href="/lifecycle" className="text-[10px] text-black/40 hover:text-black underline">View full lifecycle tower →</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {stages.map(s => (
          <a key={s.num} href={s.route}
            className={`block p-2.5 rounded-xl border transition-all hover:border-black/30 hover:shadow-sm cursor-pointer
              ${s.status === "completed" ? "border-emerald-200 bg-emerald-50" : s.status === "active" ? "border-black bg-black text-white" : "border-black/8 bg-white hover:bg-[#F9F9F9]"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0
                ${s.status === "completed" ? "bg-emerald-500 text-white" : s.status === "active" ? "bg-white text-black" : "bg-black/10 text-black/50"}`}>
                {s.num}
              </div>
              <span className={`text-[10px] font-bold truncate ${s.status === "active" ? "text-white" : s.status === "completed" ? "text-emerald-700" : "text-black"}`}>
                {s.label}
              </span>
            </div>
            <div className={`text-[9px] leading-tight ${s.status === "active" ? "text-white/70" : "text-black/40"}`}>{s.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SearchPanel() {
  const [q, setQ] = useState("");
  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-semibold text-black/60">Search & Discovery</div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search records, documents, vendors…"
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-black/10" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {["Advanced Search", "Saved Searches", "Recent Records"].map(f => (
          <button key={f} className="h-7 px-3 border border-black/10 rounded-lg text-[10px] hover:bg-[#F5F5F5] flex items-center gap-1">
            <Filter className="h-3 w-3" /> {f}
          </button>
        ))}
      </div>
    </div>
  );
}

function KnowledgePanel() {
  const act = (msg: string) => pushNotification(msg, "info");
  const items = [
    { title: "PPDPA 2018 — Procurement Regulations", type: "Law",       action: "View"     },
    { title: "Treasury Instructions — Financial Mgmt", type: "Policy",  action: "View"     },
    { title: "Evaluation Committee SOP",               type: "Procedure",action: "View"    },
    { title: "Standard Bidding Document — Goods",      type: "Template", action: "Download" },
    { title: "Conflict of Interest Declaration Form",  type: "Template", action: "Download" },
    { title: "Procurement Regulations FAQs 2026",      type: "FAQ",      action: "View"     },
  ];
  return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-black/60">Knowledge Centre — Policies, Procedures, Templates</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map(item => (
          <div key={item.title} className="flex items-center justify-between p-2.5 border border-black/8 rounded-xl hover:bg-[#F5F5F5] group">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-black/30 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-black truncate">{item.title}</div>
                <div className="text-[10px] text-black/40">{item.type}</div>
              </div>
            </div>
            <button onClick={() => act(`${item.title} opened`)} className="h-6 px-2 rounded-lg bg-[#F5F5F5] text-[10px] opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all flex-shrink-0">{item.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Record pool — each card holds enough data to populate the workbench ────────
const ALL_RECORDS: WorkbenchRecord[] = [
  MOCK_RECORD,
  {
    ...MOCK_RECORD,
    recordNumber: "RFQ-2026-0892", referenceNumber: "ZW-RFQ-2026-00892",
    title: "Office Stationery — Q3 2026",
    ministry: "Ministry of Finance", department: "Finance Department",
    budgetCode: "BC-MF-2026-0012", procurementType: "RFQ",
    currentStage: "Admin Evaluation", status: "Open", priority: "Low",
    dueDate: "2026-06-28", ageOnStage: "1 day", percentageComplete: 34,
    value: "USD 4,200", userRole: "Approver",
  },
  {
    ...MOCK_RECORD,
    recordNumber: "RFP-2026-0041", referenceNumber: "ZW-RFP-2026-00041",
    title: "Provision of Legal Advisory Services — 3 Years",
    ministry: "Ministry of Justice", department: "Legal Services",
    budgetCode: "BC-MJ-2026-0009", procurementType: "RFP",
    currentStage: "Financial Evaluation", status: "Pending", priority: "Medium",
    dueDate: "2026-06-30", ageOnStage: "2 days", percentageComplete: 58,
    value: "USD 2,400,000", userRole: "Initiator",
  },
  {
    ...MOCK_RECORD,
    recordNumber: "TND-2026-002", referenceNumber: "ZW-PRA-2026-00181",
    title: "Rehabilitation of Beitbridge–Harare Highway (Section 4)",
    ministry: "Ministry of Transport", department: "Roads & Infrastructure",
    budgetCode: "BC-MT-2026-0088", procurementType: "Tender",
    currentStage: "Advertisement", status: "Open", priority: "High",
    dueDate: "2026-08-04", ageOnStage: "0 days", percentageComplete: 15,
    value: "USD 88,000,000", userRole: "Authorizer",
  },
  {
    ...MOCK_RECORD,
    recordNumber: "EOI-2026-0018", referenceNumber: "ZW-EOI-2026-00018",
    title: "Expression of Interest — Water Treatment Consultancy",
    ministry: "Ministry of Water", department: "Water Resources",
    budgetCode: "BC-MW-2026-0003", procurementType: "EOI",
    currentStage: "EOI Advertisement", status: "Open", priority: "Low",
    dueDate: "2026-07-15", ageOnStage: "0 days", percentageComplete: 12,
    value: "Est. USD 800,000", userRole: "Initiator",
  },
];

// ─── Hierarchy Strip — shows all 5 levels, highlights current user ────────────
function HierarchyStrip({ currentRole }: { currentRole: UserHierarchyRole }) {
  const ROLES: { key: UserHierarchyRole; label: string; short: string }[] = [
    { key: "Initiator",   label: "Initiator",   short: "1" },
    { key: "Approver",    label: "Approver",    short: "2" },
    { key: "Authorizer",  label: "Authorizer",  short: "3" },
    { key: "Adjudicator", label: "Adjudicator", short: "4" },
    { key: "Oversight",   label: "Oversight",   short: "5" },
  ];
  const roleColors: Record<UserHierarchyRole, string> = {
    Initiator:   "bg-blue-600   text-white ring-2 ring-blue-300",
    Approver:    "bg-violet-600 text-white ring-2 ring-violet-300",
    Authorizer:  "bg-emerald-600 text-white ring-2 ring-emerald-300",
    Adjudicator: "bg-amber-500  text-white ring-2 ring-amber-300",
    Oversight:   "bg-red-600    text-white ring-2 ring-red-300",
  };
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {ROLES.map((r, i) => (
        <div key={r.key} className="flex items-center gap-1">
          <div className={`flex flex-col items-center`}>
            <div className={`h-5 w-5 rounded-full grid place-items-center text-[9px] font-bold transition-all
              ${currentRole === r.key ? roleColors[r.key] : "bg-black/8 text-black/30"}`}>
              {r.short}
            </div>
            <span className={`text-[8px] mt-0.5 whitespace-nowrap ${currentRole === r.key ? "text-black font-bold" : "text-black/30"}`}>
              {r.label}
            </span>
          </div>
          {i < ROLES.length - 1 && <div className="w-4 h-px bg-black/10 mb-3 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function ProcurementWorkbenchPage() {
  const [activeNav, setActiveNav]         = useState<NavTab>("overview");
  const [queueFilter, setQueueFilter]     = useState<WorkQueueStatus>("My Tasks");
  const [bottomTab, setBottomTab]         = useState<BottomTab>("intelligence");
  const [activeRecord, setActiveRecord]   = useState<WorkbenchRecord>(ALL_RECORDS[0]);
  const [showRecordList, setShowRecordList] = useState(false);
  const [bottomH, setBottomH]             = useState(260);
  const dragging                          = { y: 0, h: 0 };

  const startDrag = (e: React.MouseEvent) => {
    dragging.y = e.clientY;
    dragging.h = bottomH;
    const onMove = (ev: MouseEvent) => setBottomH(Math.min(420, Math.max(120, dragging.h - (ev.clientY - dragging.y))));
    const onUp   = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const priorityDot: Record<Priority, string> = {
    High: "bg-red-500", Medium: "bg-amber-400", Low: "bg-emerald-500",
  };

  return (
    <AppShell>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-black/10 px-4 py-2 flex items-center gap-3 flex-shrink-0">
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-black leading-tight">Procurement Workbench</h1>
          <p className="text-[10px] text-black/40">Where the work gets done · {ALL_RECORDS.length} records in queue</p>
        </div>

        {/* Hierarchy strip */}
        <div className="hidden lg:flex items-center px-3 py-1 bg-[#F5F5F5] rounded-lg flex-shrink-0">
          <HierarchyStrip currentRole={activeRecord.userRole} />
        </div>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowRecordList(v => !v)}
            className={`h-8 px-3 border rounded-lg text-xs flex items-center gap-1.5 transition-colors ${showRecordList ? "bg-black text-white border-black" : "border-black/10 hover:bg-[#F5F5F5]"}`}>
            <Filter className="h-3.5 w-3.5" />
            {activeRecord.recordNumber}
            <ChevronRight className={`h-3 w-3 transition-transform ${showRecordList ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Record switcher dropdown ─────────────────────────────────────── */}
      {showRecordList && (
        <div className="bg-white border-b border-black/10 px-4 py-2.5 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {ALL_RECORDS.map(r => (
              <button key={r.recordNumber}
                onClick={() => { setActiveRecord(r); setShowRecordList(false); setActiveNav("overview"); }}
                className={`flex-shrink-0 p-2.5 border rounded-xl text-left transition-all min-w-[190px] hover:border-black/30
                  ${r.recordNumber === activeRecord.recordNumber ? "border-black bg-black/5 shadow-sm" : "border-black/10"}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${priorityDot[r.priority]}`} />
                  <span className="text-[10px] font-mono text-black/50">{r.recordNumber}</span>
                  <span className="text-[9px] bg-black/8 text-black/50 px-1 py-0.5 rounded ml-auto">{r.procurementType}</span>
                </div>
                <div className="text-xs font-semibold text-black truncate leading-tight">{r.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-black/40 truncate">{r.currentStage}</span>
                  <span className={`text-[9px] font-semibold ml-auto ${r.status === "Pending" ? "text-amber-600" : r.status === "Approved" ? "text-emerald-600" : "text-blue-600"}`}>{r.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 1. Context Header ────────────────────────────────────────────── */}
      <ContextHeader record={activeRecord} />

      {/* ── 2. Workflow Progress Tracker ────────────────────────────────── */}
      {(() => {
        const { stages, currentIndex } = getStagesForRecord(activeRecord);
        return <WorkflowProgressTracker stages={stages} currentIndex={currentIndex} />;
      })()}

      {/* ── 3 + 4 + 5. Three-column middle ───────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* 3. Navigation Panel — 176px fixed */}
        <div className="w-44 flex-shrink-0 hidden md:flex flex-col border-r border-black/10 bg-white overflow-hidden">
          <NavigationPanel
            activeTab={activeNav}
            onTabChange={setActiveNav}
            queueFilter={queueFilter}
            onQueueFilterChange={setQueueFilter}
          />
        </div>

        {/* 4. Main Work Area — fills remaining space */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-[#F5F5F5]">
          <MainWorkArea activeTab={activeNav} record={activeRecord} />
        </div>

        {/* 5. Action Panel — 148px fixed */}
        <div className="w-37 flex-shrink-0 hidden md:flex flex-col border-l border-black/10 bg-white overflow-hidden" style={{ width: "148px" }}>
          <ActionPanel record={activeRecord} />
        </div>

      </div>

      {/* ── Drag handle ─────────────────────────────────────────────────── */}
      <div
        onMouseDown={startDrag}
        className="h-2 flex-shrink-0 bg-[#F5F5F5] border-t border-b border-black/8 cursor-ns-resize flex items-center justify-center hover:bg-black/5 transition-colors group"
        title="Drag to resize">
        <div className="w-8 h-0.5 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
      </div>

      {/* ── 6–9, 11–12. Bottom panels ────────────────────────────────────── */}
      <div style={{ height: `${bottomH}px` }} className="flex-shrink-0 overflow-hidden">
        <BottomSection tab={bottomTab} setTab={setBottomTab} />
      </div>

      {/* ── 10. Status bar ──────────────────────────────────────────────── */}
      <StatusBar record={activeRecord} />
    </AppShell>
  );
}
