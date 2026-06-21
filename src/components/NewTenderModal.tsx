import { useState } from "react";
import { X, CheckCircle2, Sparkles, ChevronRight, FileText, Users, Zap } from "lucide-react";
import { Badge } from "@/components/AppShell";
import { addItem, pushNotification } from "@/lib/local-store";
import { useAuth } from "@/lib/auth-context";

type Props = { open: boolean; onClose: () => void };

const STEPS = [
  { label: "Tender Details",    icon: FileText },
  { label: "Specifications",    icon: FileText },
  { label: "Evaluation Design", icon: Users },
  { label: "Committee",         icon: Users },
  { label: "Review & Submit",   icon: CheckCircle2 },
];

const METHODS = ["Open Tender", "Restricted Tender", "Request for Quotation (RFQ)", "Request for Proposal (RFP)", "Framework Agreement", "Direct Procurement", "Emergency Procurement"];
const CATEGORIES = ["Infrastructure / Works", "Health & Pharmaceuticals", "ICT & Digital", "Agriculture", "Education", "Services / Consultancy", "Transport & Fleet", "Security Services", "Office Supplies", "Other"];
const ENTITIES = ["Ministry of Finance", "Ministry of Health & Child Care", "ZIMRA", "Ministry of Transport", "Ministry of Energy", "Ministry of Agriculture", "Ministry of Education", "ZINARA", "City of Harare", "PRAZ"];

const AI_SUGGESTIONS: Record<number, { title: string; text: string; actions: string[] }> = {
  1: { title: "Procurement Method Suggestion", text: "Based on estimated value of USD 14.8M, Open Competitive Tendering is recommended. This exceeds the USD 5M threshold per PPDPA Section 32.", actions: ["Apply Open Tender", "Review thresholds"] },
  2: { title: "Specification Assistant", text: "I can generate technical specifications from a description. Paste your project brief and I'll draft compliant specs with BOQ, TOR, and evaluation criteria.", actions: ["Generate specs", "Use template"] },
  3: { title: "Evaluation Criteria Suggestion", text: "For Infrastructure/Works, recommended weights: Experience 25%, Key Personnel 20%, Equipment 20%, Methodology 20%, Financial Capacity 15%.", actions: ["Apply suggested weights", "Customize"] },
  4: { title: "Committee Composition", text: "For USD 14.8M tender, a 5-member evaluation committee is recommended: 1 Chairperson, 2 Technical, 1 Financial, 1 Legal. Ensure no conflict of interest.", actions: ["Auto-assign committee", "Manual selection"] },
};

export default function NewTenderModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showAI, setShowAI] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    entity: "",
    category: "",
    method: "Open Tender",
    estimatedValue: "",
    currency: "USD",
    fundingSource: "",
    closingDate: "",
    description: "",
    specs: "",
    evalMethod: "QCBS",
    passmark: "70",
    weights: { technical: "70", financial: "30" },
    committee: ["", "", "", "", ""],
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const tenderRef = `ZW-PRA-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;

  const handleSubmit = () => {
    const tender = {
      id: tenderRef,
      title: form.title || "Untitled Tender",
      entity: form.entity || "Unknown Entity",
      category: form.category || "General",
      method: form.method,
      value: `${form.currency} ${Number(form.estimatedValue || 0).toLocaleString()}`,
      status: "Draft",
      closing: form.closingDate || "TBD",
      bids: 0,
      createdBy: user?.name ?? "System",
      createdAt: new Date().toISOString(),
    };
    addItem("tenders", tender);
    pushNotification(`New tender created: ${tender.title}`, "success");
    setSubmitted(true);
  };

  if (!open) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Tender Created!</h2>
          <div className="text-sm text-muted-foreground mb-4">Your tender has been submitted for approval workflow.</div>
          <div className="bg-secondary rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Reference</span><span className="font-mono font-semibold text-primary">{tenderRef}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Title</span><span className="font-medium">{form.title || "New Tender"}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Method</span><span>{form.method}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Value</span><span className="font-semibold">{form.currency} {Number(form.estimatedValue || 0).toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Status</span><Badge tone="amber">Pending Approval</Badge></div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-left flex gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <strong>AI Actions triggered:</strong> Specification check, compliance scan, and approval routing to Legal → Finance → Procurement Manager. Expected approval: 3–5 business days.
            </div>
          </div>
          <button onClick={() => { onClose(); setStep(1); setSubmitted(false); }} className="w-full h-10 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity">
            Back to Tenders
          </button>
        </div>
      </div>
    );
  }

  const ai = AI_SUGGESTIONS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">Create New Tender</h2>
            <div className="text-xs text-muted-foreground">Step {step} of {STEPS.length} — {STEPS[step - 1].label}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAI(!showAI)} className="h-7 px-2 rounded-md bg-violet-50 border border-violet-200 text-xs text-violet-700 flex items-center gap-1 hover:bg-violet-100">
              <Sparkles className="h-3 w-3" /> AI Assistant {showAI ? "On" : "Off"}
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-0">
            {STEPS.map((s, i) => {
              const done = i + 1 < step;
              const active = i + 1 === step;
              return (
                <div key={s.label} className="flex items-center flex-1">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-pointer transition-colors ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white ring-2 ring-primary/30" : "bg-secondary text-muted-foreground"}`}
                    onClick={() => done && setStep(i + 1)}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className={`ml-1.5 text-[10px] font-medium hidden md:block flex-1 ${active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground"}`}>{s.label}</div>
                  {i < STEPS.length - 1 && <div className={`h-0.5 w-4 mx-1 flex-shrink-0 ${done ? "bg-emerald-400" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 p-6">
          {/* Form */}
          <div className="flex-1 min-w-0">
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tender Title *</label>
                  <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Supply of Solar Mini-Grids — 12 Rural Clinics" className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Procuring Entity *</label>
                    <select value={form.entity} onChange={e => set("entity", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select entity…</option>
                      {ENTITIES.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category *</label>
                    <select value={form.category} onChange={e => set("category", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select category…</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Procurement Method *</label>
                  <select value={form.method} onChange={e => set("method", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Value *</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">{form.currency}</span>
                      <input type="number" value={form.estimatedValue} onChange={e => set("estimatedValue", e.target.value)} placeholder="0.00" className="w-full h-9 pl-12 pr-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency</label>
                    <select value={form.currency} onChange={e => set("currency", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm">
                      <option>USD</option><option>ZWL</option><option>EUR</option><option>GBP</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Funding Source</label>
                    <select value={form.fundingSource} onChange={e => set("fundingSource", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm">
                      <option value="">Select…</option>
                      <option>Treasury</option><option>World Bank</option><option>AfDB</option><option>Donor Grant</option><option>Loan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bid Closing Date</label>
                    <input type="date" value={form.closingDate} onChange={e => set("closingDate", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brief Description</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Briefly describe the procurement need…" className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technical Specifications / Scope of Work</label>
                  <textarea value={form.specs} onChange={e => set("specs", e.target.value)}
                    rows={8} placeholder="Paste or describe your technical specifications here. The AI can generate these from your description…"
                    className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tender Type</label>
                    <select className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm">
                      <option>Supplies</option><option>Works</option><option>Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Period</label>
                    <input placeholder="e.g. 90 days ARO" className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="h-8 px-3 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary flex items-center gap-1.5">
                    📎 Attach BOQ
                  </button>
                  <button className="h-8 px-3 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary flex items-center gap-1.5">
                    📎 Attach Drawings
                  </button>
                  <button className="h-8 px-3 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary flex items-center gap-1.5">
                    📎 Attach TOR
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evaluation Method</label>
                  <select value={form.evalMethod} onChange={e => set("evalMethod", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="QCBS">QCBS — Quality and Cost Based Selection</option>
                    <option value="LRB">LRB — Lowest Responsive Bidder</option>
                    <option value="LERB">LERB — Lowest Evaluated Responsive Bidder</option>
                    <option value="QBS">QBS — Quality Based Selection</option>
                    <option value="Fixed">Fixed Budget Selection</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technical Weight (%)</label>
                    <input type="number" min={0} max={100} value={form.weights.technical}
                      onChange={e => setForm(f => ({ ...f, weights: { technical: e.target.value, financial: String(100 - Number(e.target.value)) } }))}
                      className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Financial Weight (%)</label>
                    <input type="number" value={form.weights.financial} readOnly className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technical Pass Mark (%)</label>
                  <input type="number" min={0} max={100} value={form.passmark} onChange={e => set("passmark", e.target.value)} className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Evaluation Criteria</label>
                  <div className="space-y-2">
                    {[
                      { name: "Technical Compliance", wt: "60" },
                      { name: "Delivery Capability", wt: "20" },
                      { name: "Warranty / After-Sales", wt: "10" },
                      { name: "Experience", wt: "10" },
                    ].map((c, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input defaultValue={c.name} className="flex-1 h-8 px-3 rounded-md border border-border bg-secondary text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                        <input defaultValue={c.wt} type="number" className="w-16 h-8 px-2 text-center rounded-md border border-border bg-secondary text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 text-xs text-primary hover:underline">+ Add criterion</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  Assign evaluation committee members. All members must submit Conflict of Interest declarations before evaluation begins.
                </div>
                {["Chairperson", "Technical Evaluator 1", "Technical Evaluator 2", "Financial Evaluator", "Legal Advisor"].map((role, i) => (
                  <div key={role}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{role}</label>
                    <input
                      value={form.committee[i]}
                      onChange={e => setForm(f => { const c = [...f.committee]; c[i] = e.target.value; return { ...f, committee: c }; })}
                      placeholder={`Search staff — ${role}…`}
                      className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Tender Summary — Ready to Submit</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      ["Reference", tenderRef],
                      ["Title", form.title || "(not set)"],
                      ["Entity", form.entity || "(not set)"],
                      ["Category", form.category || "(not set)"],
                      ["Method", form.method],
                      ["Value", `${form.currency} ${Number(form.estimatedValue || 0).toLocaleString()}`],
                      ["Closing Date", form.closingDate || "(not set)"],
                      ["Eval Method", form.evalMethod],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{l}</span>
                        <span className="font-semibold text-foreground text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approval Workflow (Auto-routed)</div>
                  {[
                    { step: "Legal Review", assignee: "Legal Office", days: "2 days" },
                    { step: "Finance Review", assignee: "Finance Officer", days: "1 day" },
                    { step: "Compliance Review", assignee: "Compliance Unit", days: "1 day" },
                    { step: "Final Approval", assignee: "Procurement Manager", days: "1 day" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                      <div className="h-5 w-5 rounded-full bg-primary text-white text-[10px] grid place-items-center font-bold flex-shrink-0">{i + 1}</div>
                      <div className="flex-1 text-xs font-medium text-foreground">{a.step}</div>
                      <div className="text-[10px] text-muted-foreground">{a.assignee}</div>
                      <div className="text-[10px] text-muted-foreground">{a.days}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex gap-2">
                  <Sparkles className="h-4 w-4 text-violet-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-violet-700">
                    <strong>AI Compliance Check:</strong> Procurement method matches value threshold ✓ · Evaluation design complete ✓ · Committee assigned ✓ · PPDPA Section 32 compliant ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Panel */}
          {showAI && ai && (
            <div className="w-52 flex-shrink-0">
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 sticky top-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="h-5 w-5 rounded-full bg-violet-600 grid place-items-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-violet-700">AI Assistant</span>
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] font-semibold text-violet-600 mb-1">{ai.title}</div>
                <div className="text-[10px] text-violet-700 leading-relaxed mb-2">{ai.text}</div>
                <div className="space-y-1">
                  {ai.actions.map(a => (
                    <button key={a} className="w-full text-[10px] px-2 py-1 rounded-md bg-violet-100 text-violet-700 hover:bg-violet-200 text-left font-medium transition-colors">
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            className="h-9 px-4 rounded-md border border-border text-sm hover:bg-secondary disabled:opacity-40 transition-colors">
            ← Back
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="h-9 px-4 rounded-md border border-border text-sm hover:bg-secondary">Cancel</button>
            {step < STEPS.length
              ? <button onClick={() => setStep(s => s + 1)} className="h-9 px-5 rounded-md bg-primary text-white text-sm font-semibold hover:opacity-90 flex items-center gap-1.5 transition-opacity">
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              : <button onClick={handleSubmit} className="h-9 px-5 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:opacity-90 flex items-center gap-1.5 transition-opacity">
                  <Zap className="h-4 w-4" /> Submit Tender
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
