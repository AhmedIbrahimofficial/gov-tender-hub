import { useState } from "react";
import {
  CheckCircle2, Clock, Circle, AlertCircle, ChevronRight, X,
  FileText, RefreshCcw, Settings, Sparkles, CheckCircle, MessageSquare,
  AlertTriangle, Wallet, Eye, Upload, Download, Lock, DollarSign,
  Users, AlertOctagon, BarChart3,
} from "lucide-react";
import { Card, CardHeader, Badge } from "@/components/AppShell";
import { pushNotification } from "@/lib/local-store";

// ─── Types ────────────────────────────────────────────────────────────────────
export type TowerStageStatus = "completed" | "active" | "pending" | "blocked";

export type TowerStage = {
  id: number;
  label: string;
  shortLabel: string;
  description: string;
  status: TowerStageStatus;
  aiRole: string;
  owner: string;
  documents: string[];
  workflow: string[];
  automation: string[];
  aiCapabilities: string[];
  approvals: string[];
  communications: string[];
  riskFlags: string[];
  finance: string[];
};

type StagePanelTab = "overview" | "documents" | "workflow" | "automation" | "ai" | "approvals" | "comms" | "risk" | "finance";

// ─── Status styles ────────────────────────────────────────────────────────────
const STAGE_ICON: Record<TowerStageStatus, React.ElementType> = {
  completed: CheckCircle2, active: Clock, pending: Circle, blocked: AlertCircle,
};
const STAGE_PIN_STYLE: Record<TowerStageStatus, string> = {
  completed: "bg-emerald-500 text-white border-emerald-500",
  active:    "bg-black text-white border-black ring-2 ring-black ring-offset-2",
  pending:   "bg-white text-black/35 border-black/15",
  blocked:   "bg-red-100 text-red-600 border-red-300",
};

// ─── Stage Pin ────────────────────────────────────────────────────────────────
function StagePin({ status, index }: { status: TowerStageStatus; index: number }) {
  const Icon = STAGE_ICON[status];
  return (
    <div className={`w-6 h-6 rounded-full border-2 grid place-items-center text-[9px] font-bold flex-shrink-0 transition-all ${STAGE_PIN_STYLE[status]}`}>
      {status === "completed" ? <Icon className="h-3 w-3" /> : index}
    </div>
  );
}

// ─── Stage Detail Panel ───────────────────────────────────────────────────────
function StageDetailPanel({ stage, onClose, context }: { stage: TowerStage; onClose: () => void; context: string }) {
  const [tab, setTab] = useState<StagePanelTab>("overview");

  const TABS: { key: StagePanelTab; label: string; icon: React.ElementType }[] = [
    { key: "overview",   label: "Overview",     icon: Eye           },
    { key: "documents",  label: "Documents",    icon: FileText      },
    { key: "workflow",   label: "Workflow",     icon: RefreshCcw    },
    { key: "automation", label: "Automation",   icon: Settings      },
    { key: "ai",         label: "AI",           icon: Sparkles      },
    { key: "approvals",  label: "Approvals",    icon: CheckCircle   },
    { key: "comms",      label: "Comms",        icon: MessageSquare },
    { key: "risk",       label: "Risk",         icon: AlertTriangle },
    { key: "finance",    label: "Finance",      icon: Wallet        },
  ];

  const act = (msg: string) => pushNotification(`${msg} — ${stage.label}`, "success");

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/8 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge tone={stage.status === "active" ? "blue" : stage.status === "completed" ? "green" : stage.status === "blocked" ? "red" : "muted"}>
                  Stage {stage.id}
                </Badge>
                {stage.status === "active" && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-black leading-tight">{stage.label}</h2>
              <p className="text-xs text-black/50 mt-0.5">{context}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 hover:text-black transition-colors flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-black/8 flex-shrink-0 scrollbar-none">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px flex-shrink-0
                ${tab === t.key ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>
              <t.icon className="h-3.5 w-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {tab === "overview" && (
            <>
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <p className="text-sm text-black/70 leading-relaxed">{stage.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => act("Stage advanced")}
                  className="h-9 bg-black text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" /> Advance Stage
                </button>
                <button onClick={() => act("Report downloaded")}
                  className="h-9 border border-black/10 rounded-lg text-xs font-medium hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download Report
                </button>
              </div>
            </>
          )}

          {tab === "documents" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-black/60">Stage Documents</span>
                <button onClick={() => act("Document uploaded")} className="h-7 px-2.5 bg-black text-white rounded-lg text-[10px] font-medium flex items-center gap-1 hover:opacity-90">
                  <Upload className="h-3 w-3" /> Upload
                </button>
              </div>
              {stage.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-black/30" />
                    <span className="text-xs text-black">{doc}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => act(`Viewed ${doc}`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">View</button>
                    <button onClick={() => act(`Downloaded ${doc}`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">DL</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "workflow" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Process Steps</span>
              {stage.workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-black/8 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold grid place-items-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-xs text-black flex-1">{step}</p>
                  <button onClick={() => act(`${step} — marked complete`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-emerald-500 hover:text-white transition-colors flex-shrink-0">Done</button>
                </div>
              ))}
            </div>
          )}

          {tab === "automation" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Automated Actions at This Stage</span>
              {stage.automation.map((a, i) => (
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
              <span className="text-xs font-semibold text-black/60 block">AI Capabilities at This Stage</span>
              {stage.aiCapabilities.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-3 border border-black/8 rounded-xl hover:border-violet-200 transition-colors">
                  <div className="h-4 w-4 rounded-full bg-violet-100 grid place-items-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-black flex-1">{c}</p>
                  <button onClick={() => act(`AI: ${c}`)} className="h-6 px-2 rounded-md bg-violet-100 text-violet-700 text-[10px] font-medium hover:bg-violet-500 hover:text-white transition-colors flex-shrink-0">Run</button>
                </div>
              ))}
            </div>
          )}

          {tab === "approvals" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Required Approvals</span>
              {stage.approvals.map((a, i) => (
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
              <button onClick={() => act("Approval submitted")} className="w-full h-9 mt-2 bg-black text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                Submit for Approval
              </button>
            </div>
          )}

          {tab === "comms" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Communications at This Stage</span>
              {stage.communications.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-black/8 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-3.5 w-3.5 text-black/30" />
                    <span className="text-xs text-black">{c}</span>
                  </div>
                  <button onClick={() => act(`${c} sent`)} className="h-6 px-2 rounded-md bg-[#F5F5F5] text-[10px] hover:bg-black hover:text-white transition-colors">Send</button>
                </div>
              ))}
            </div>
          )}

          {tab === "risk" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Risk Flags & Monitoring</span>
              {stage.riskFlags.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertOctagon className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-800">{r}</span>
                </div>
              ))}
              <button onClick={() => act("Risk report generated")} className="w-full h-9 mt-2 border border-amber-200 text-amber-700 bg-amber-50 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Generate Risk Report
              </button>
            </div>
          )}

          {tab === "finance" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black/60">Financial Controls at This Stage</span>
              {stage.finance.map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-emerald-800">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stage Map Grid ───────────────────────────────────────────────────────────
function StageMapGrid({ stages, onSelect }: { stages: TowerStage[]; onSelect: (s: TowerStage) => void }) {
  const rows: TowerStage[][] = [];
  const ROW_SIZE = 8;
  for (let i = 0; i < stages.length; i += ROW_SIZE) {
    rows.push(stages.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="space-y-3">
      {rows.map((row, ri) => (
        <div key={ri} className={`flex items-stretch gap-0 ${ri % 2 === 1 ? "flex-row-reverse" : ""}`}>
          {row.map((stage, si) => (
            <button key={stage.id} onClick={() => onSelect(stage)}
              title={`${stage.label} — ${stage.status}`}
              className={`flex-1 min-w-0 group flex flex-col items-center gap-1 px-1 py-2 rounded-lg border transition-all hover:border-black/30 hover:bg-[#F5F5F5]/80 text-center relative
                ${stage.status === "active" ? "border-black bg-black/5" : "border-transparent"}`}>
              <StagePin status={stage.status} index={stage.id} />
              <span className={`text-[9px] font-medium leading-tight w-full truncate
                ${stage.status === "completed" ? "text-emerald-600" : stage.status === "active" ? "text-black font-bold" : stage.status === "blocked" ? "text-red-500" : "text-black/35"}`}>
                {stage.shortLabel}
              </span>
              {si < row.length - 1 && (
                <div className={`absolute top-[18px] ${ri % 2 === 1 ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"} w-4 h-0.5 z-10
                  ${stage.status === "completed" ? "bg-emerald-400" : "bg-black/10"}`} />
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main LifecycleTower component ────────────────────────────────────────────
export default function LifecycleTower({
  title,
  subtitle,
  stages,
  context,
  badgeLabel,
}: {
  title: string;
  subtitle: string;
  stages: TowerStage[];
  context: string;
  badgeLabel?: string;
}) {
  const [selectedStage, setSelectedStage] = useState<TowerStage | null>(null);
  const activeStage   = stages.find(s => s.status === "active");
  const completedCount = stages.filter(s => s.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* Legend + stats row */}
      <div className="flex items-center gap-4 text-xs text-black/50 flex-wrap">
        {([["bg-emerald-500","Completed"],["bg-black","Active"],["bg-white border-2 border-black/15","Pending"],["bg-red-200","Blocked"]] as const).map(([cls, lbl]) => (
          <div key={lbl} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${cls}`} />
            {lbl}
          </div>
        ))}
        {badgeLabel && <Badge tone="blue" >{badgeLabel}</Badge>}
        <span className="ml-auto text-[10px] text-black/40">{completedCount}/{stages.length} stages complete · Click any stage to open full toolset →</span>
      </div>

      {/* Active stage callout */}
      {activeStage && (
        <div className="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">Current Stage: {activeStage.label}</div>
            <div className="text-[11px] text-white/60 truncate">{activeStage.description}</div>
          </div>
          <button onClick={() => setSelectedStage(activeStage)}
            className="h-7 px-2.5 bg-white text-black rounded-lg text-[10px] font-semibold hover:bg-white/90 transition-colors flex-shrink-0 flex items-center gap-1">
            Open <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Stage map */}
      <Card>
        <CardHeader title={title} subtitle={subtitle} />
        <div className="px-5 pb-5 pt-4">
          <StageMapGrid stages={stages} onSelect={setSelectedStage} />
        </div>
      </Card>

      {/* Quick cards for active/recent stages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.filter(s => s.status !== "pending").slice(0, 4).map(stage => (
          <button key={stage.id} onClick={() => setSelectedStage(stage)}
            className="p-4 bg-white border border-black/8 rounded-xl text-left hover:border-black/25 hover:shadow-sm transition-all group">
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

      {/* Slide-over panel */}
      {selectedStage && (
        <StageDetailPanel stage={selectedStage} onClose={() => setSelectedStage(null)} context={context} />
      )}
    </div>
  );
}
