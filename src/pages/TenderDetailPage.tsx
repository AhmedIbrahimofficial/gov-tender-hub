import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell, Card, CardHeader, Badge } from "@/components/AppShell";
import { toast } from "@/lib/toast";
import { pushNotification } from "@/lib/local-store";
import {
  ArrowLeft, FileText, Building2, Tag, Banknote, Calendar, Clock,
  Users, Timer, Download, Send, Eye, ChevronRight, CheckCircle2,
  AlertTriangle, Info, MapPin, Phone, Mail, Globe, Printer,
  Lock, Unlock, Shield, Award, X, Plus, FileDown,
} from "lucide-react";
import { ZW_MINISTRIES } from "@/lib/zw-ministries";

// -- Types --
const TENDER_STAGES = [
  { key: "preparation",    label: "Preparation",     icon: FileText    },
  { key: "approval",       label: "Approval",         icon: Shield      },
  { key: "publication",    label: "Publication",      icon: Globe       },
  { key: "clarifications", label: "Clarifications",   icon: Info        },
  { key: "bidding",        label: "Bidding",          icon: Users       },
  { key: "opening",        label: "Bid Opening",      icon: Unlock      },
  { key: "evaluation",     label: "Evaluation",       icon: Eye         },
  { key: "award",          label: "Award",            icon: Award       },
] as const;

type StageKey = typeof TENDER_STAGES[number]["key"];

// -- Mock tender data map --
const MOCK_DETAIL: Record<string, {
  id: string; title: string; entity: string; ministry: string;
  department: string; category: string; method: string;
  estimatedValue: string; currency: string;
  status: string; bids: number; currentStage: StageKey;
  publishedDate: string; bidOpenDate: string;
  bidCloseDate: string; bidOpeningDate: string;
  preBidDate: string; preBidLocation: string;
  documentFee: string; emd: string; performanceBond: string;
  description: string; scope: string; validityDays: number;
  relaxationMinutes: number; fundingSource: string;
  contactName: string; contactEmail: string; contactPhone: string;
  documents: { name: string; size: string; type: string }[];
  timeline: { stage: string; date: string; status: "done" | "active" | "pending" }[];
  bidders: { name: string; submitted: string; status: string }[];
  qa: { q: string; a: string; date: string }[];
}> = {
  "ZW-PRA-2026-00184": {
    id: "ZW-PRA-2026-00184",
    title: "Supply & Installation of Solar Mini-Grids — 12 Rural Clinics",
    entity: "Ministry of Energy and Power Development",
    ministry: "moepd", department: "Renewable Energy",
    category: "Energy & Power", method: "Open Competitive",
    estimatedValue: "14,800,000", currency: "USD",
    status: "Bidding Open", bids: 11, currentStage: "bidding",
    publishedDate: "2026-05-01T08:00",
    bidOpenDate: "2026-05-20T09:00",
    bidCloseDate: "2026-07-08T16:00",
    bidOpeningDate: "2026-07-09T10:00",
    preBidDate: "2026-05-25T10:00",
    preBidLocation: "Ministry of Energy Boardroom, Livingstone House, Harare",
    documentFee: "USD 500", emd: "USD 148,000", performanceBond: "10%",
    fundingSource: "Government of Zimbabwe — Treasury",
    description: "Supply, installation, commissioning and 5-year maintenance of solar mini-grid systems at 12 rural clinics across Mashonaland West, Midlands, Manicaland and Masvingo provinces.",
    scope: "Scope includes: PV panels (min. 50kWp per site), battery storage (min. 100kWh), inverters, distribution boards, protective equipment, grid synchronisation, commissioning, handover training and 5-year O&M contract.",
    validityDays: 120, relaxationMinutes: 30,
    contactName: "Mrs. T. Nyoni (Procurement Officer)",
    contactEmail: "tenders@energy.gov.zw",
    contactPhone: "+263 4 706 830",
    documents: [
      { name: "Invitation to Tender", size: "2.4 MB", type: "PDF" },
      { name: "Technical Specifications", size: "8.1 MB", type: "PDF" },
      { name: "Bill of Quantities", size: "1.8 MB", type: "Excel" },
      { name: "General Conditions of Contract", size: "3.2 MB", type: "PDF" },
      { name: "Bid Submission Forms", size: "0.9 MB", type: "PDF" },
      { name: "Site Visit Report", size: "5.6 MB", type: "PDF" },
    ],
    timeline: [
      { stage: "Preparation",   date: "2026-04-01", status: "done"    },
      { stage: "Approval",      date: "2026-04-28", status: "done"    },
      { stage: "Publication",   date: "2026-05-01", status: "done"    },
      { stage: "Clarifications",date: "2026-05-25", status: "done"    },
      { stage: "Bidding",       date: "2026-07-08", status: "active"  },
      { stage: "Bid Opening",   date: "2026-07-09", status: "pending" },
      { stage: "Evaluation",    date: "2026-07-30", status: "pending" },
      { stage: "Award",         date: "2026-08-15", status: "pending" },
    ],
    bidders: [
      { name: "SunPower Zimbabwe (Pvt) Ltd",     submitted: "2026-06-10", status: "Registered" },
      { name: "Highveld Engineering (Pvt) Ltd",  submitted: "2026-06-12", status: "Registered" },
      { name: "Africa Solar Solutions Ltd",      submitted: "2026-06-14", status: "Registered" },
      { name: "Harare Green Energy Co.",         submitted: "2026-06-15", status: "Registered" },
    ],
    qa: [
      { q: "Can a JV bid?", a: "Yes. Joint ventures are permitted provided the lead partner holds ≥51% stake.", date: "2026-05-28" },
      { q: "Is the Pre-Bid meeting mandatory?", a: "Attendance is highly recommended but not mandatory. Minutes will be published.", date: "2026-05-26" },
      { q: "What is the minimum experience requirement?", a: "Minimum 5 years in solar installation with at least 3 projects ≥USD 1M each.", date: "2026-05-29" },
    ],
  },
  "ZW-PRA-2026-00183": {
    id: "ZW-PRA-2026-00183",
    title: "Procurement of Antiretroviral Medicines (2-Year Framework)",
    entity: "Ministry of Health and Child Care",
    ministry: "moh", department: "Pharmacy and Medicines",
    category: "Health & Pharmaceuticals", method: "Framework Agreement",
    estimatedValue: "42,500,000", currency: "USD",
    status: "Evaluation", bids: 8, currentStage: "evaluation",
    publishedDate: "2026-03-15T08:00",
    bidOpenDate: "2026-04-01T09:00",
    bidCloseDate: "2026-06-12T16:00",
    bidOpeningDate: "2026-06-13T10:00",
    preBidDate: "2026-04-10T10:00",
    preBidLocation: "MOH Conference Hall, Kaguvi Building",
    documentFee: "USD 1,000", emd: "USD 425,000", performanceBond: "10%",
    fundingSource: "Government of Zimbabwe / Global Fund",
    description: "National 2-year framework agreement for the supply of essential antiretroviral medicines.",
    scope: "TDF/3TC 300/300mg, EFV 600mg, DTG 50mg and paediatric formulations. Estimated 1.4 million patient-months annually.",
    validityDays: 180, relaxationMinutes: 0,
    contactName: "Mr. G. Rusike (Procurement Manager)",
    contactEmail: "procurement@mohcc.gov.zw",
    contactPhone: "+263 4 730 021",
    documents: [
      { name: "Request for Proposal", size: "3.8 MB", type: "PDF" },
      { name: "Technical Specifications", size: "6.2 MB", type: "PDF" },
      { name: "Framework Agreement Template", size: "2.1 MB", type: "PDF" },
    ],
    timeline: [
      { stage: "Preparation",   date: "2026-02-15", status: "done"   },
      { stage: "Approval",      date: "2026-03-10", status: "done"   },
      { stage: "Publication",   date: "2026-03-15", status: "done"   },
      { stage: "Clarifications",date: "2026-04-10", status: "done"   },
      { stage: "Bidding",       date: "2026-06-12", status: "done"   },
      { stage: "Bid Opening",   date: "2026-06-13", status: "done"   },
      { stage: "Evaluation",    date: "2026-07-10", status: "active" },
      { stage: "Award",         date: "2026-07-30", status: "pending"},
    ],
    bidders: [
      { name: "Zimbabwe Pharma Holdings",   submitted: "2026-05-20", status: "Under Evaluation" },
      { name: "NATPHARM",                   submitted: "2026-05-22", status: "Under Evaluation" },
      { name: "Africa Health Supplies Ltd", submitted: "2026-05-25", status: "Under Evaluation" },
    ],
    qa: [
      { q: "Are generic ARVs acceptable?", a: "Yes, provided they carry WHO pre-qualification or equivalent NRA approval.", date: "2026-04-12" },
    ],
  },
};

// Fallback tender
const DEFAULT_TENDER = MOCK_DETAIL["ZW-PRA-2026-00184"];

// -- Countdown Timer --
function CountdownTimer({ target, label, color = "text-emerald-600" }: { target: string; label: string; color?: string }) {
  const [diff, setDiff] = useState(new Date(target).getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return <span className={`text-xs font-medium text-red-500`}>{label}: Expired</span>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return (
    <div className="flex items-center gap-1.5">
      <Timer className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className={`text-xs font-mono font-bold ${color}`}>{d > 0 ? `${d}d ` : ""}{h}h {m}m {s}s</span>
    </div>
  );
}

// -- EOI Modal --
function EOIModal({ tender, onClose }: { tender: typeof DEFAULT_TENDER; onClose: () => void }) {
  const [form, setForm] = useState({ company: "", contact: "", email: "", phone: "", regNo: "", experience: "", statement: "" });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const inp = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const submit = () => {
    if (!form.company || !form.email) { toast("Company name and email are required", "warning"); return; }
    pushNotification(`EOI submitted for ${tender.id} by ${form.company}`, "success");
    toast(`EOI submitted successfully for ${tender.id}`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold">Expression of Interest</h2>
            <p className="text-xs text-muted-foreground">{tender.id} — {tender.title.slice(0, 50)}…</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company / Organisation Name *</label>
            <input className={`${inp} mt-1`} value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. Highveld Engineering (Pvt) Ltd" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Person</label>
              <input className={`${inp} mt-1`} value={form.contact} onChange={e => set("contact", e.target.value)} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration No.</label>
              <input className={`${inp} mt-1`} value={form.regNo} onChange={e => set("regNo", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email *</label>
              <input type="email" className={`${inp} mt-1`} value={form.email} onChange={e => set("email", e.target.value)} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
              <input className={`${inp} mt-1`} value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          </div>
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of Relevant Experience</label>
            <input type="number" className={`${inp} mt-1`} value={form.experience} onChange={e => set("experience", e.target.value)} /></div>
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statement of Interest</label>
            <textarea className={`${inp} mt-1`} rows={3} value={form.statement} onChange={e => set("statement", e.target.value)}
              placeholder="Briefly describe your capability and interest in this tender…" /></div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
          <button onClick={submit} className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
            <Send className="h-4 w-4" /> Submit EOI
          </button>
        </div>
      </div>
    </div>
  );
}

// -- Main Page --
export default function TenderDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "documents" | "bidders" | "qa" | "timeline">("overview");
  const [showEOI, setShowEOI] = useState(false);

  const tender = MOCK_DETAIL[id] ?? DEFAULT_TENDER;

  const isOpen = tender.status === "Bidding Open";
  const isPublished = tender.status === "Published";

  const downloadDoc = (doc: typeof tender.documents[0]) => {
    toast(`Downloading ${doc.name}…`, "info");
    pushNotification(`Document downloaded: ${doc.name} (${tender.id})`, "success");
  };

  const downloadAll = () => {
    toast("Preparing full document package…", "info");
    setTimeout(() => {
      const blob = new Blob([`TENDER: ${tender.id}\nTITLE: ${tender.title}\nENTITY: ${tender.entity}\n\nFor full documents, contact: ${tender.contactEmail}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${tender.id}-Documents.txt`; a.click(); URL.revokeObjectURL(url);
    }, 600);
  };

  const stageOrder = TENDER_STAGES.map(s => s.key);
  const currentStageIdx = stageOrder.indexOf(tender.currentStage);

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
          <button onClick={() => navigate("/tenders")} className="hover:text-foreground flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" /> Tenders
          </button>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="font-mono">{tender.id}</span>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{tender.title.slice(0, 40)}…</span>
        </nav>

        {/* Header card */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">{tender.id}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  tender.status === "Bidding Open" ? "bg-green-100 text-green-700" :
                  tender.status === "Evaluation" ? "bg-amber-100 text-amber-700" :
                  tender.status === "Awarded" ? "bg-emerald-100 text-emerald-700" :
                  tender.status === "Published" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{tender.status}</span>
                <span className="text-xs bg-secondary text-foreground/60 px-2 py-0.5 rounded-full">{tender.method}</span>
              </div>
              <h1 className="text-lg font-bold text-foreground leading-snug">{tender.title}</h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {tender.entity}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <button onClick={() => window.print()} className="h-9 px-3 rounded-lg border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button onClick={downloadAll} className="h-9 px-3 rounded-lg border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
                <Download className="h-3.5 w-3.5" /> Documents
              </button>
              {(isOpen || isPublished) && (
                <button onClick={() => setShowEOI(true)} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <Send className="h-3.5 w-3.5" /> Submit EOI
                </button>
              )}
            </div>
          </div>

          {/* Key numbers row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Estimated Value</span>
              <span className="text-base font-bold text-foreground mt-0.5">{tender.currency} {Number(tender.estimatedValue).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Document Fee</span>
              <span className="text-base font-bold text-foreground mt-0.5">{tender.documentFee}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Earnest Money (EMD)</span>
              <span className="text-base font-bold text-foreground mt-0.5">{tender.emd}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Bids Received</span>
              <span className="text-base font-bold text-foreground mt-0.5">{tender.bids}</span>
            </div>
          </div>

          {/* Live timers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 bg-secondary/40 rounded-xl p-3">
            {tender.preBidDate && <CountdownTimer target={tender.preBidDate} label="Pre-Bid Meeting" color="text-indigo-600" />}
            {tender.bidOpenDate && <CountdownTimer target={tender.bidOpenDate} label="Bidding Opens" color="text-blue-600" />}
            {tender.bidCloseDate && <CountdownTimer target={tender.bidCloseDate} label="Submission Closes" color={isOpen ? "text-emerald-600" : "text-red-500"} />}
            {tender.bidOpeningDate && <CountdownTimer target={tender.bidOpeningDate} label="Bid Opening" color="text-purple-600" />}
          </div>
        </div>

        {/* Stage progress bar */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            {TENDER_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx;
              const isActive = idx === currentStageIdx;
              const Icon = stage.icon;
              return (
                <div key={stage.key} className="flex items-center">
                  <button
                    onClick={() => navigate(`/tenders/${tender.id}/stage/${stage.key}`)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors text-center group hover:bg-secondary/60 ${isActive ? "bg-primary/10 border border-primary/30" : ""}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isDone ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${isActive ? "text-primary" : isDone ? "text-emerald-700" : "text-muted-foreground"}`}>
                      {stage.label}
                    </span>
                  </button>
                  {idx < TENDER_STAGES.length - 1 && (
                    <div className={`h-0.5 w-6 flex-shrink-0 ${idx < currentStageIdx ? "bg-emerald-400" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-5 overflow-x-auto">
          {(["overview","documents","bidders","qa","timeline"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`h-9 px-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "qa" ? "Q & A" : t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardHeader title="Tender Description" />
                <div className="px-5 py-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">{tender.description}</p>
                </div>
              </Card>
              <Card>
                <CardHeader title="Scope of Work" />
                <div className="px-5 py-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">{tender.scope}</p>
                </div>
              </Card>
              <Card>
                <CardHeader title="Key Dates & Schedule" />
                <div className="divide-y divide-border">
                  {[
                    { label: "Publication Date", value: tender.publishedDate ? new Date(tender.publishedDate).toLocaleString() : "—" },
                    { label: "Pre-Bid Meeting", value: tender.preBidDate ? new Date(tender.preBidDate).toLocaleString() : "—" },
                    { label: "Bid Submission Opens", value: tender.bidOpenDate ? new Date(tender.bidOpenDate).toLocaleString() : "—" },
                    { label: "Bid Submission Closes", value: tender.bidCloseDate ? new Date(tender.bidCloseDate).toLocaleString() : "—" },
                    { label: "Bid Opening Date", value: tender.bidOpeningDate ? new Date(tender.bidOpeningDate).toLocaleString() : "—" },
                    { label: "Bid Validity (days)", value: `${tender.validityDays} days` },
                    { label: "Relaxation Time", value: tender.relaxationMinutes > 0 ? `${tender.relaxationMinutes} minutes` : "None" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-5">
              <Card>
                <CardHeader title="Tender Details" />
                <div className="divide-y divide-border">
                  {[
                    { label: "Ministry", value: tender.entity },
                    { label: "Department", value: tender.department },
                    { label: "Category", value: tender.category },
                    { label: "Method", value: tender.method },
                    { label: "Funding Source", value: tender.fundingSource },
                    { label: "Performance Bond", value: tender.performanceBond },
                    { label: "Pre-Bid Location", value: tender.preBidLocation },
                  ].map(row => (
                    <div key={row.label} className="px-5 py-2.5">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{row.label}</div>
                      <div className="text-sm text-foreground mt-0.5">{row.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Contact Information" />
                <div className="px-5 py-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /> {tender.contactName}</div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> <a href={`mailto:${tender.contactEmail}`} className="text-primary hover:underline">{tender.contactEmail}</a></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {tender.contactPhone}</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === "documents" && (
          <Card>
            <CardHeader title="Tender Documents" subtitle={`${tender.documents.length} documents available`}
              action={<button onClick={downloadAll} className="h-7 px-3 rounded-lg bg-primary text-primary-foreground text-xs flex items-center gap-1"><Download className="h-3.5 w-3.5" /> Download All</button>} />
            <div className="divide-y divide-border">
              {tender.documents.map(doc => (
                <div key={doc.name} className="flex items-center justify-between px-5 py-4 hover:bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold ${doc.type === "PDF" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{doc.type}</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.size}</div>
                    </div>
                  </div>
                  <button onClick={() => downloadDoc(doc)} className="h-8 px-3 rounded-lg border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
                    <FileDown className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "bidders" && (
          <Card>
            <CardHeader title="Registered Bidders" subtitle={`${tender.bidders.length} bidders registered`} />
            {tender.bidders.length === 0 ? (
              <div className="px-5 py-12 text-center text-muted-foreground text-sm">No bidders registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs text-muted-foreground">
                    <tr>
                      {["Company", "Date Submitted", "Status"].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tender.bidders.map(b => (
                      <tr key={b.name} className="hover:bg-secondary/20">
                        <td className="px-5 py-3 font-medium">{b.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">{b.submitted}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.status.includes("Evaluation") ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {tab === "qa" && (
          <div className="space-y-4">
            <Card>
              <CardHeader title="Questions & Answers" subtitle="Official clarifications" />
              {tender.qa.map((item, i) => (
                <div key={i} className="px-5 py-4 border-b border-border last:border-0">
                  <div className="flex gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">Q</div>
                    <p className="text-sm font-medium text-foreground">{item.q}</p>
                  </div>
                  <div className="flex gap-2 pl-0">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">A</div>
                    <div>
                      <p className="text-sm text-foreground/80">{item.a}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Posted: {item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "timeline" && (
          <Card>
            <CardHeader title="Tender Timeline" subtitle="Stage-by-stage progress" />
            <div className="px-5 py-5">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                {tender.timeline.map((item, i) => (
                  <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === "done" ? "bg-emerald-500 text-white" :
                      item.status === "active" ? "bg-primary text-primary-foreground" :
                      "bg-secondary border-2 border-border text-muted-foreground"
                    }`}>
                      {item.status === "done" ? <CheckCircle2 className="h-4 w-4" /> :
                       item.status === "active" ? <Clock className="h-4 w-4" /> :
                       <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${item.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{item.stage}</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <span className={`text-[11px] font-medium mt-0.5 inline-block ${
                        item.status === "done" ? "text-emerald-600" :
                        item.status === "active" ? "text-primary" :
                        "text-muted-foreground"
                      }`}>{item.status === "done" ? "Completed" : item.status === "active" ? "In Progress" : "Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
      {showEOI && <EOIModal tender={tender} onClose={() => setShowEOI(false)} />}
    </AppShell>
  );
}
