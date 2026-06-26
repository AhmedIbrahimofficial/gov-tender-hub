import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useTenders } from "@/hooks/use-store";
import { useAuth } from "@/lib/auth-context";
import { pushNotification } from "@/lib/local-store";
import { toast } from "@/lib/toast";
import {
  Plus, Download, Search, FileText, Clock, CheckCircle2, XCircle,
  Filter, LayoutGrid, Table2, ChevronDown, X, Timer, Calendar,
  Building2, Tag, Banknote, Users, Bell, Eye, FileDown, Send, MapPin,
} from "lucide-react";
import GisMapView from "@/components/GisMapView";
import { TENDER_PINS } from "@/lib/gis-data";
import { ZW_MINISTRIES, getMinistryOptions, getDepartmentsForMinistry } from "@/lib/zw-ministries";

// ── Types ──────────────────────────────────────────────────────────────────

const TENDER_STATUSES = [
  "Draft", "Approval Pending", "Published", "Pre-Bid Meeting",
  "Bidding Open", "Bid Closing Soon", "Bid Closed", "Opening",
  "Evaluation", "Award Recommended", "Awarded", "Contract Signed",
] as const;
type TenderStatus = typeof TENDER_STATUSES[number];

const STATUS_COLORS: Record<TenderStatus, string> = {
  "Draft": "bg-gray-100 text-gray-600",
  "Approval Pending": "bg-yellow-100 text-yellow-700",
  "Published": "bg-blue-100 text-blue-700",
  "Pre-Bid Meeting": "bg-indigo-100 text-indigo-700",
  "Bidding Open": "bg-green-100 text-green-700",
  "Bid Closing Soon": "bg-amber-100 text-amber-700",
  "Bid Closed": "bg-red-100 text-red-700",
  "Opening": "bg-purple-100 text-purple-700",
  "Evaluation": "bg-orange-100 text-orange-700",
  "Award Recommended": "bg-teal-100 text-teal-700",
  "Awarded": "bg-emerald-100 text-emerald-700",
  "Contract Signed": "bg-gray-100 text-gray-800",
};

const CATEGORIES = [
  "Infrastructure & Construction", "Health & Pharmaceuticals", "ICT & Digital Systems",
  "Agriculture & Food Security", "Education & Training", "Energy & Power",
  "Water & Sanitation", "Transport & Logistics", "Defence & Security",
  "Environmental Services", "Mining & Resources", "Financial Services",
  "Professional Services", "Consulting & Advisory", "Media & Communications",
  "Office Supplies & Stationery", "Furniture & Fittings", "Medical Equipment",
  "Laboratory Equipment", "Printing & Publishing", "Legal Services",
  "Audit & Accounting", "Research & Development", "Security Services",
];

const METHODS = ["Open Competitive", "Restricted", "Direct Procurement", "Framework Agreement", "RFQ", "RFP", "EOI"];

// ── Mock Extended Tender Data ─────────────────────────────────────────────

export type EnhancedTender = {
  id: string; title: string; entity: string; ministry: string;
  department: string; category: string; method: string;
  estimatedValue: string; currency: string;
  status: TenderStatus; bids: number;
  publishedDate: string; bidOpenDate: string;
  bidCloseDate: string; bidOpeningDate: string;
  preBidDate: string; preBidLocation: string;
  documentFee: string; emd: string;
  description: string; validityDays: number;
  relaxationMinutes: number;
};

const MOCK_TENDERS: EnhancedTender[] = [
  {
    id: "ZW-PRA-2026-00184", title: "Supply & Installation of Solar Mini-Grids — 12 Rural Clinics",
    entity: "Ministry of Energy and Power Development", ministry: "moepd",
    department: "Renewable Energy", category: "Energy & Power", method: "Open Competitive",
    estimatedValue: "14,800,000", currency: "USD", status: "Bidding Open", bids: 11,
    publishedDate: "2026-05-01T08:00", bidOpenDate: "2026-05-20T09:00",
    bidCloseDate: "2026-07-08T16:00", bidOpeningDate: "2026-07-09T10:00",
    preBidDate: "2026-05-25T10:00", preBidLocation: "Ministry of Energy Boardroom, Livingstone House, Harare",
    documentFee: "USD 500", emd: "USD 148,000",
    description: "Supply, installation, commissioning and maintenance of solar mini-grid systems at 12 rural clinics across 4 provinces.",
    validityDays: 120, relaxationMinutes: 30,
  },
  {
    id: "ZW-PRA-2026-00183", title: "Procurement of Antiretroviral Medicines (2-Year Framework)",
    entity: "Ministry of Health and Child Care", ministry: "moh",
    department: "Pharmacy and Medicines", category: "Health & Pharmaceuticals", method: "Framework Agreement",
    estimatedValue: "42,500,000", currency: "USD", status: "Evaluation", bids: 8,
    publishedDate: "2026-03-15T08:00", bidOpenDate: "2026-04-01T09:00",
    bidCloseDate: "2026-06-12T16:00", bidOpeningDate: "2026-06-13T10:00",
    preBidDate: "2026-04-10T10:00", preBidLocation: "MOH Conference Hall, Kaguvi Building",
    documentFee: "USD 1,000", emd: "USD 425,000",
    description: "National framework agreement for supply of essential ARV medicines including TDF/3TC, EFV and paediatric formulations.",
    validityDays: 180, relaxationMinutes: 0,
  },
  {
    id: "ZW-PRA-2026-00182", title: "National Tax Administration System — Phase II",
    entity: "ZIMRA", ministry: "mof",
    department: "Revenue and Taxation Policy", category: "ICT & Digital Systems", method: "Restricted",
    estimatedValue: "9,200,000", currency: "USD", status: "Bidding Open", bids: 5,
    publishedDate: "2026-05-10T08:00", bidOpenDate: "2026-06-01T09:00",
    bidCloseDate: "2026-07-21T16:00", bidOpeningDate: "2026-07-22T10:00",
    preBidDate: "2026-06-10T09:00", preBidLocation: "ZIMRA Head Office, Harare",
    documentFee: "USD 500", emd: "USD 92,000",
    description: "Development and implementation of integrated tax administration system phase II including taxpayer portal and analytics.",
    validityDays: 90, relaxationMinutes: 60,
  },
  {
    id: "ZW-PRA-2026-00181", title: "Rehabilitation of Beitbridge–Harare Highway (Section 4)",
    entity: "Ministry of Transport and Infrastructural Development", ministry: "mot",
    department: "Infrastructure Projects", category: "Infrastructure & Construction", method: "Open Competitive",
    estimatedValue: "88,000,000", currency: "USD", status: "Published", bids: 0,
    publishedDate: "2026-06-01T08:00", bidOpenDate: "2026-07-01T09:00",
    bidCloseDate: "2026-08-04T16:00", bidOpeningDate: "2026-08-05T10:00",
    preBidDate: "2026-07-08T10:00", preBidLocation: "Ministry of Transport Conference Room, Harare",
    documentFee: "USD 2,000", emd: "USD 880,000",
    description: "Rehabilitation and upgrading of 148km section of Beitbridge–Harare corridor including bridges and drainage.",
    validityDays: 180, relaxationMinutes: 30,
  },
  {
    id: "ZW-PRA-2026-00180", title: "Supply of Fertiliser — Pfumvudza Programme 2026/27",
    entity: "Ministry of Agriculture", ministry: "moam",
    department: "Agricultural Production and Extension", category: "Agriculture & Food Security", method: "Open Competitive",
    estimatedValue: "31,400,000", currency: "USD", status: "Awarded", bids: 14,
    publishedDate: "2026-01-10T08:00", bidOpenDate: "2026-02-01T09:00",
    bidCloseDate: "2026-05-30T16:00", bidOpeningDate: "2026-05-31T10:00",
    preBidDate: "2026-02-15T10:00", preBidLocation: "Ministry of Agriculture Boardroom, Harare",
    documentFee: "USD 750", emd: "USD 314,000",
    description: "Supply and delivery of blended NPK fertiliser (Compound D and AN) for the 2026/27 Pfumvudza programme.",
    validityDays: 120, relaxationMinutes: 0,
  },
  {
    id: "ZW-PRA-2026-00179", title: "School Textbooks — Primary Grades 1–7",
    entity: "Ministry of Primary and Secondary Education", ministry: "mopse",
    department: "Curriculum Development", category: "Education & Training", method: "Open Competitive",
    estimatedValue: "6,700,000", currency: "USD", status: "Bidding Open", bids: 12,
    publishedDate: "2026-05-15T08:00", bidOpenDate: "2026-06-01T09:00",
    bidCloseDate: "2026-07-02T16:00", bidOpeningDate: "2026-07-03T10:00",
    preBidDate: "2026-06-08T10:00", preBidLocation: "MOPSE Boardroom, Ambassador House",
    documentFee: "USD 300", emd: "USD 67,000",
    description: "Printing and supply of primary school textbooks for grades 1-7, all subjects, covering 1.2 million students.",
    validityDays: 90, relaxationMinutes: 30,
  },
  {
    id: "ZW-PRA-2026-00178", title: "Construction of 4 District Hospitals",
    entity: "Ministry of Health and Child Care", ministry: "moh",
    department: "Curative and Clinical Services", category: "Infrastructure & Construction", method: "Open Competitive",
    estimatedValue: "56,000,000", currency: "USD", status: "Draft", bids: 0,
    publishedDate: "2026-09-15T08:00", bidOpenDate: "2026-10-01T09:00",
    bidCloseDate: "2026-11-30T16:00", bidOpeningDate: "2026-12-01T10:00",
    preBidDate: "2026-10-10T10:00", preBidLocation: "MOH Conference Hall, Kaguvi Building",
    documentFee: "USD 1,500", emd: "USD 560,000",
    description: "Design and construction of 4 new district hospitals in Mashonaland West, Manicaland, Masvingo and Matebeleland North.",
    validityDays: 180, relaxationMinutes: 60,
  },
];


// ── Countdown Timer Component ─────────────────────────────────────────────

function CountdownTimer({ target, label, color = "text-emerald-600" }: { target: string; label: string; color?: string }) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const calc = () => setDiff(new Date(target).getTime() - Date.now());
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return <span className="text-xs text-red-500 font-medium">{label}: Expired</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className="flex items-center gap-1">
      <Timer className="h-3 w-3 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground">{label}:</span>
      <span className={`text-[11px] font-mono font-bold ${color}`}>
        {d > 0 ? `${d}d ` : ""}{h}h {m}m {s}s
      </span>
    </div>
  );
}

// ── New Tender Modal ───────────────────────────────────────────────────────

function NewTenderModal({ onClose, onSave }: { onClose: () => void; onSave: (t: EnhancedTender) => void }) {
  const ministryOptions = getMinistryOptions();
  const [form, setForm] = useState({
    title: "", description: "", ministry: "", department: "",
    entity: "", category: CATEGORIES[0], method: METHODS[0],
    estimatedValue: "", currency: "USD",
    fundingSource: "Government of Zimbabwe", fundingPct: "100",
    publishedDate: "", bidOpenDate: "", bidCloseDate: "", bidOpeningDate: "",
    validityDays: "120", relaxationMinutes: "30", extensionTime: "",
    preBidDate: "", preBidLocation: "", preBidMode: "Physical",
    documentFee: "", documentFeeCurrency: "USD",
    emd: "", emdCurrency: "USD",
    performanceBond: "10",
    specialInstructions: "",
  });
  const [depts, setDepts] = useState<{ id: string; name: string }[]>([]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (form.ministry) {
      const ds = getDepartmentsForMinistry(form.ministry);
      setDepts(ds);
      if (ds.length > 0) set("department", ds[0].name);
    }
  }, [form.ministry]);

  const autoId = `ZW-PRA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

  const inp = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const label = (t: string) => <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t}</label>;

  const submit = () => {
    if (!form.title || !form.ministry || !form.estimatedValue) {
      toast("Title, Ministry and Estimated Value are required", "warning"); return;
    }
    const min = ZW_MINISTRIES.find(m => m.id === form.ministry);
    const tender: EnhancedTender = {
      id: autoId, title: form.title, description: form.description,
      entity: form.entity || min?.name || "Unknown",
      ministry: form.ministry, department: form.department,
      category: form.category, method: form.method,
      estimatedValue: form.estimatedValue, currency: form.currency,
      status: "Draft", bids: 0,
      publishedDate: form.publishedDate, bidOpenDate: form.bidOpenDate,
      bidCloseDate: form.bidCloseDate, bidOpeningDate: form.bidOpeningDate,
      preBidDate: form.preBidDate, preBidLocation: form.preBidLocation,
      documentFee: `${form.documentFeeCurrency} ${form.documentFee}`,
      emd: `${form.emdCurrency} ${form.emd}`,
      validityDays: Number(form.validityDays), relaxationMinutes: Number(form.relaxationMinutes),
    };
    onSave(tender);
    pushNotification(`New tender created: ${autoId} — ${form.title}`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl border border-border my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-semibold">New Tender</h2>
            <p className="text-xs text-muted-foreground">Ref: {autoId} (auto-generated)</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="sm:col-span-2">{label("Tender Title *")}<input className={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Supply of Office Equipment..." /></div>
          {/* Description */}
          <div className="sm:col-span-2">{label("Description")}<textarea className={inp} rows={2} value={form.description} onChange={e => set("description", e.target.value)} /></div>
          {/* Ministry */}
          <div>{label("Ministry *")}<select className={inp} value={form.ministry} onChange={e => set("ministry", e.target.value)}>
            <option value="">— Select Ministry —</option>
            {ministryOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select></div>
          {/* Department */}
          <div>{label("Department")}<select className={inp} value={form.department} onChange={e => set("department", e.target.value)}>
            {depts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select></div>
          {/* Entity */}
          <div>{label("Procuring Entity")}<input className={inp} value={form.entity} onChange={e => set("entity", e.target.value)} placeholder="e.g. ZIMRA" /></div>
          {/* Category */}
          <div>{label("Category")}<select className={inp} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select></div>
          {/* Method */}
          <div>{label("Procurement Method")}<select className={inp} value={form.method} onChange={e => set("method", e.target.value)}>
            {METHODS.map(m => <option key={m}>{m}</option>)}
          </select></div>
          {/* Value */}
          <div>{label("Estimated Value *")}<div className="flex gap-2">
            <select className="rounded-lg border border-border bg-background px-2 py-2 text-sm" value={form.currency} onChange={e => set("currency", e.target.value)}>
              {["USD","ZWL","ZAR","EUR","GBP"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input className={inp} value={form.estimatedValue} onChange={e => set("estimatedValue", e.target.value)} placeholder="0.00" />
          </div></div>
          {/* Funding */}
          <div>{label("Funding Source")}<input className={inp} value={form.fundingSource} onChange={e => set("fundingSource", e.target.value)} /></div>
          <div>{label("Funding %")}<input className={inp} type="number" value={form.fundingPct} onChange={e => set("fundingPct", e.target.value)} /></div>
          {/* Dates */}
          <div>{label("Publication Date & Time")}<input type="datetime-local" className={inp} value={form.publishedDate} onChange={e => set("publishedDate", e.target.value)} /></div>
          <div>{label("Bid Submission Opens")}<input type="datetime-local" className={inp} value={form.bidOpenDate} onChange={e => set("bidOpenDate", e.target.value)} /></div>
          <div>{label("Bid Submission Closes *")}<input type="datetime-local" className={inp} value={form.bidCloseDate} onChange={e => set("bidCloseDate", e.target.value)} /></div>
          <div>{label("Bid Opening Date & Time")}<input type="datetime-local" className={inp} value={form.bidOpeningDate} onChange={e => set("bidOpeningDate", e.target.value)} /></div>
          {/* Validity & Relaxation */}
          <div>{label("Bid Validity (days)")}<input type="number" className={inp} value={form.validityDays} onChange={e => set("validityDays", e.target.value)} /></div>
          <div>{label("Relaxation Time (minutes)")}<input type="number" className={inp} value={form.relaxationMinutes} onChange={e => set("relaxationMinutes", e.target.value)} /></div>
          {/* Pre-bid */}
          <div>{label("Pre-Bid Meeting Date")}<input type="datetime-local" className={inp} value={form.preBidDate} onChange={e => set("preBidDate", e.target.value)} /></div>
          <div>{label("Pre-Bid Meeting Mode")}<select className={inp} value={form.preBidMode} onChange={e => set("preBidMode", e.target.value)}>
            <option>Physical</option><option>Online</option><option>Hybrid</option>
          </select></div>
          <div className="sm:col-span-2">{label("Pre-Bid Meeting Location")}<input className={inp} value={form.preBidLocation} onChange={e => set("preBidLocation", e.target.value)} /></div>
          {/* Fees */}
          <div>{label("Document Fee")}<div className="flex gap-2">
            <select className="rounded-lg border border-border bg-background px-2 py-2 text-sm" value={form.documentFeeCurrency} onChange={e => set("documentFeeCurrency", e.target.value)}>
              {["USD","ZWL","ZAR"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input className={inp} value={form.documentFee} onChange={e => set("documentFee", e.target.value)} placeholder="0.00" />
          </div></div>
          <div>{label("Earnest Money Deposit (EMD)")}<div className="flex gap-2">
            <select className="rounded-lg border border-border bg-background px-2 py-2 text-sm" value={form.emdCurrency} onChange={e => set("emdCurrency", e.target.value)}>
              {["USD","ZWL","ZAR"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input className={inp} value={form.emd} onChange={e => set("emd", e.target.value)} placeholder="0.00" />
          </div></div>
          <div>{label("Performance Bond (%)")}<input type="number" className={inp} value={form.performanceBond} onChange={e => set("performanceBond", e.target.value)} /></div>
          {/* Special instructions */}
          <div className="sm:col-span-2">{label("Special Instructions")}<textarea className={inp} rows={2} value={form.specialInstructions} onChange={e => set("specialInstructions", e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
          <button onClick={submit} className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Create Tender
          </button>
        </div>
      </div>
    </div>
  );
}


// ── EOI Modal ─────────────────────────────────────────────────────────────

function EOIModal({ tender, onClose }: { tender: EnhancedTender; onClose: () => void }) {
  const [form, setForm] = useState({ company: "", contactPerson: "", email: "", phone: "", experience: "", statement: "" });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const inp = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const submit = () => {
    if (!form.company || !form.email) { toast("Company and email required", "warning"); return; }
    pushNotification(`EOI submitted for ${tender.id} by ${form.company}`, "success");
    toast(`Expression of Interest submitted for ${tender.title}`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold">Expression of Interest</h2>
            <p className="text-xs text-muted-foreground">{tender.id}</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name *</label>
            <input className={`${inp} mt-1`} value={form.company} onChange={e => set("company", e.target.value)} /></div>
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Person</label>
            <input className={`${inp} mt-1`} value={form.contactPerson} onChange={e => set("contactPerson", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email *</label>
              <input type="email" className={`${inp} mt-1`} value={form.email} onChange={e => set("email", e.target.value)} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
              <input className={`${inp} mt-1`} value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          </div>
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Relevant Experience (years)</label>
            <input type="number" className={`${inp} mt-1`} value={form.experience} onChange={e => set("experience", e.target.value)} /></div>
          <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statement of Interest</label>
            <textarea className={`${inp} mt-1`} rows={3} value={form.statement} onChange={e => set("statement", e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={submit} className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
            <Send className="h-4 w-4" /> Submit EOI
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tender Card Component ─────────────────────────────────────────────────

function TenderCard({ t, onEOI }: { t: EnhancedTender; onEOI: (t: EnhancedTender) => void }) {
  const navigate = useNavigate();
  const isOpen = t.status === "Bidding Open";
  const isClosingSoon = t.status === "Bid Closing Soon";
  const isClosed = ["Bid Closed", "Opening", "Evaluation", "Award Recommended", "Awarded", "Contract Signed"].includes(t.status);

  const downloadDocs = () => {
    toast(`Downloading bidding documents for ${t.id}…`, "info");
    pushNotification(`Documents downloaded for tender ${t.id}`, "success");
    setTimeout(() => {
      const blob = new Blob([`TENDER BIDDING DOCUMENTS\n\nReference: ${t.id}\nTitle: ${t.title}\nEntity: ${t.entity}\nEstimated Value: ${t.currency} ${Number(t.estimatedValue).toLocaleString()}\nClose Date: ${t.bidCloseDate}\n\nFor full document package, contact the procuring entity.\n\nDocument Fee: ${t.documentFee}\nEMD Required: ${t.emd}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${t.id}-BiddingDocs.txt`; a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  const statusCls = STATUS_COLORS[t.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">{t.id}</span>
            <button onClick={() => navigate(`/tenders/${t.id}`)} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCls} cursor-pointer hover:opacity-80 transition-opacity`}>
              {t.status}
            </button>
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-snug cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/tenders/${t.id}`)}>
            {t.title}
          </h3>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{t.entity}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{t.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{t.method}</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Banknote className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
          <span>{t.currency} {Number(t.estimatedValue).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Doc Fee: {t.documentFee}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{t.bids} {t.bids === 1 ? "bid" : "bids"}</span>
        </div>
      </div>

      {/* Timers */}
      <div className="bg-secondary/50 rounded-xl p-3 space-y-1.5">
        {t.preBidDate && <CountdownTimer target={t.preBidDate} label="Pre-Bid Meeting" color="text-indigo-600" />}
        {t.bidOpenDate && <CountdownTimer target={t.bidOpenDate} label="Bidding Opens" color="text-blue-600" />}
        {t.bidCloseDate && (
          <CountdownTimer
            target={t.bidCloseDate}
            label="Bid Submission Deadline"
            color={isClosingSoon ? "text-amber-600" : isClosed ? "text-red-500" : "text-emerald-600"}
          />
        )}
        {t.bidOpeningDate && <CountdownTimer target={t.bidOpeningDate} label="Bid Opening" color="text-purple-600" />}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <button onClick={() => navigate(`/tenders/${t.id}`)} className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg border border-border hover:bg-secondary transition-colors">
          <Eye className="h-3.5 w-3.5" /> View Details
        </button>
        <button onClick={downloadDocs} className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg border border-border hover:bg-secondary transition-colors">
          <FileDown className="h-3.5 w-3.5" /> Documents
        </button>
        {(isOpen || t.status === "Published") && (
          <button onClick={() => onEOI(t)} className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-auto">
            <Send className="h-3.5 w-3.5" /> Submit EOI
          </button>
        )}
      </div>

      {/* Lifecycle stages clickable */}
      <div className="flex gap-1 flex-wrap">
        {["Preparation", "Approval", "Publication", "Clarifications", "Bidding", "Opening", "Evaluation", "Award"].map((stage) => (
          <button key={stage} onClick={() => navigate(`/tenders/${t.id}/stage/${stage.toLowerCase()}`)}
            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground">
            {stage}
          </button>
        ))}
      </div>
    </div>
  );
}


// ── Filter Sidebar ────────────────────────────────────────────────────────

function FilterSidebar({ filters, setFilters, onClose }: {
  filters: Record<string, string>;
  setFilters: (f: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState({ ...filters });
  const set = (k: string, v: string) => setLocal(p => ({ ...p, [k]: v }));
  const inp = "w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex">
      <div className="w-80 bg-card border-r border-border h-full overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Filter Tenders</h3>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Ministry</label>
            <select className={inp} value={local.ministry} onChange={e => set("ministry", e.target.value)}>
              <option value="">All Ministries</option>
              {getMinistryOptions().map(m => <option key={m.value} value={m.value}>{m.code} — {m.label.replace("Ministry of ", "")}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
            <select className={inp} value={local.category} onChange={e => set("category", e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Method</label>
            <select className={inp} value={local.method} onChange={e => set("method", e.target.value)}>
              <option value="">All Methods</option>
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Status</label>
            <select className={inp} value={local.status} onChange={e => set("status", e.target.value)}>
              <option value="">All Statuses</option>
              {TENDER_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Min Value (USD)</label>
            <input type="number" className={inp} value={local.minValue} onChange={e => set("minValue", e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Max Value (USD)</label>
            <input type="number" className={inp} value={local.maxValue} onChange={e => set("maxValue", e.target.value)} placeholder="No limit" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Closing From</label>
            <input type="date" className={inp} value={local.closeFrom} onChange={e => set("closeFrom", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Closing To</label>
            <input type="date" className={inp} value={local.closeTo} onChange={e => set("closeTo", e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => { setFilters(local); onClose(); }} className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Apply Filters
          </button>
          <button onClick={() => { const e = { ministry: "", category: "", method: "", status: "", minValue: "", maxValue: "", closeFrom: "", closeTo: "" }; setLocal(e); setFilters(e); }} className="h-9 px-3 rounded-lg border border-border text-sm">
            Reset
          </button>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

type MainTab = "Tenders Register" | "GIS Map";
const MAIN_TABS: MainTab[] = ["Tenders Register", "GIS Map"];

export default function TendersPage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<MainTab>("Tenders Register");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"card" | "table">("card");
  const [showNew, setShowNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [eoiTender, setEoiTender] = useState<EnhancedTender | null>(null);
  const [localTenders, setLocalTenders] = useState<EnhancedTender[]>(MOCK_TENDERS);
  const [filters, setFilters] = useState<Record<string, string>>({ ministry: "", category: "", method: "", status: "", minValue: "", maxValue: "", closeFrom: "", closeTo: "" });

  const filtered = localTenders.filter(t => {
    const q = search.toLowerCase();
    if (q && !t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) && !t.entity.toLowerCase().includes(q)) return false;
    if (filters.ministry && t.ministry !== filters.ministry) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.method && t.method !== filters.method) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.minValue && Number(t.estimatedValue.replace(/,/g, "")) < Number(filters.minValue)) return false;
    if (filters.maxValue && Number(t.estimatedValue.replace(/,/g, "")) > Number(filters.maxValue)) return false;
    return true;
  });

  const statusCounts = localTenders.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const exportCSV = () => {
    const rows = ["Reference,Title,Entity,Category,Method,Value,Currency,Status,BidClose,Bids",
      ...filtered.map(t => `${t.id},"${t.title}","${t.entity}","${t.category}","${t.method}",${t.estimatedValue},${t.currency},${t.status},${t.bidCloseDate},${t.bids}`)
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tenders-register.csv"; a.click();
    URL.revokeObjectURL(url);
    pushNotification("Tenders exported to CSV", "success");
  };

  return (
    <AppShell>
      <div className={`p-4 sm:p-6 mx-auto ${mainTab === "GIS Map" ? "max-w-[1800px] flex flex-col h-[calc(100vh-56px)]" : "max-w-[1600px]"}`}>
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Phases 3–10</span>
          <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Government of Zimbabwe</span>
        </div>
        <PageHeader
          title="Tenders Register"
          description="NITB-style tender hub — full lifecycle from preparation to contract signing with real-time countdowns."
          actions={
            mainTab === "Tenders Register" ? (
              <button onClick={() => setShowNew(true)} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                <Plus className="h-4 w-4" /> New Tender
              </button>
            ) : null
          }
        />

        {/* Main tab bar */}
        <div className="flex gap-1 border-b border-border mb-5">
          {MAIN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                mainTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "GIS Map" && <MapPin className="h-3.5 w-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* ── GIS Map Tab ─────────────────────────────────────────────── */}
        {mainTab === "GIS Map" && (
          <div className="flex-1 rounded-2xl overflow-hidden border border-border shadow-sm min-h-0" style={{ minHeight: "500px" }}>
            <GisMapView
              pins={TENDER_PINS}
              height="100%"
              title="Tenders GIS Map"
              onNavigate={pin => navigate(`/tenders/${pin.id}`)}
            />
          </div>
        )}

        {/* ── Tenders Register Tab ─────────────────────────────────────── */}
        {mainTab === "Tenders Register" && (<>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Total Tenders" value={String(localTenders.length)} delta="All statuses" icon={FileText} />
          <KpiCard label="Bidding Open" value={String(statusCounts["Bidding Open"] || 0)} delta="Accepting bids now" icon={Clock} />
          <KpiCard label="Awarded" value={String(statusCounts["Awarded"] || 0)} delta="This period" icon={CheckCircle2} />
          <KpiCard label="Draft" value={String(statusCounts["Draft"] || 0)} delta="Pending approval" icon={XCircle} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenders, references, entities…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={() => setShowFilters(true)} className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button onClick={() => setView("card")} className={`h-9 px-3 text-sm flex items-center gap-1.5 transition-colors ${view === "card" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
              <LayoutGrid className="h-4 w-4" /> Cards
            </button>
            <button onClick={() => setView("table")} className={`h-9 px-3 text-sm flex items-center gap-1.5 transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
              <Table2 className="h-4 w-4" /> Table
            </button>
          </div>
          <button onClick={exportCSV} className="h-9 px-3 rounded-md border border-border bg-card text-sm flex items-center gap-1.5 hover:bg-secondary">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} tender{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {filtered.map(t => <TenderCard key={t.id} t={t} onEOI={setEoiTender} />)}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-muted-foreground text-sm">No tenders match your search or filters.</div>
            )}
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <Card className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs text-muted-foreground">
                  <tr>{["Ref", "Title", "Entity", "Category", "Method", "Value", "Bid Close", "Bids", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left font-medium px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">No tenders found.</td></tr>
                  ) : filtered.map(t => (
                    <tr key={t.id} className="hover:bg-secondary/30 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{t.id}</td>
                      <td className="px-4 py-3 max-w-[220px]"><div className="truncate font-medium" onClick={() => navigate(`/tenders/${t.id}`)}>{t.title}</div></td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{t.entity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{t.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="text-[11px] bg-secondary px-2 py-0.5 rounded">{t.method}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-xs">{t.currency} {Number(t.estimatedValue).toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{t.bidCloseDate.split("T")[0]}</td>
                      <td className="px-4 py-3 text-xs">{t.bids}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => navigate(`/tenders/${t.id}`)} className="text-xs text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {showNew && <NewTenderModal onClose={() => setShowNew(false)} onSave={t => setLocalTenders(p => [t, ...p])} />}
        {showFilters && <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}
        {eoiTender && <EOIModal tender={eoiTender} onClose={() => setEoiTender(null)} />}
        </>)}
      </div>
    </AppShell>
  );
}
