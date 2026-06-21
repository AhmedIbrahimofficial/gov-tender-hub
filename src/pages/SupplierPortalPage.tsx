import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { tenders } from "@/lib/mock-data";
import {
  Search, Download, FileText, Clock, CheckCircle2, LogOut,
  ChevronDown, Bell, X, Upload, Send, Eye, AlertCircle,
  Building2, Paperclip, ArrowRight, MapPin, Tag, Calendar,
  Hash, Users, ShieldCheck, Info, ExternalLink,
} from "lucide-react";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

const STATUS_COLOR: Record<string, string> = {
  Published: "bg-blue-100 text-blue-700 border border-blue-200",
  Bidding:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Evaluation:"bg-amber-100 text-amber-700 border border-amber-200",
  Awarded:   "bg-gray-100 text-gray-500 border border-gray-200",
};

type Application = {
  tenderId: string;
  tenderTitle: string;
  submittedAt: string;
  status: "Submitted" | "Under Review" | "Shortlisted" | "Unsuccessful";
  bidAmount: string;
  files: string[];
};

/* ─── Tender Detail Modal ──────────────────────────────────────────────────── */
function TenderDetailModal({ tender, onClose, onApply }: {
  tender: typeof tenders[number];
  onClose: () => void;
  onApply: () => void;
}) {
  const SCOPE = [
    "Supply and installation of all materials as per Bill of Quantities",
    "Compliance with national technical standards and specifications",
    "Submission of performance bond (10% of contract value)",
    "Delivery within specified timeline — liquidated damages apply",
    "Warranty period: 24 months from date of practical completion",
    "On-site supervision and testing prior to handover",
  ];

  const ELIGIBILITY = [
    "Company registration certificate (current)",
    "Tax clearance certificate (valid)",
    "Audited financial statements (last 3 years)",
    "Minimum 5 years proven experience in similar projects",
    "PRAZ / relevant professional body registration",
    "Bid security: 2% of bid amount (bank guarantee or cash)",
  ];

  const TIMELINE = [
    { event: "Tender Published",      date: "2026-06-01", done: true  },
    { event: "Pre-bid Meeting",        date: "2026-06-20", done: true  },
    { event: "Clarifications Deadline",date: "2026-06-28", done: false },
    { event: "Bid Submission Deadline",date: tender.closing,           done: false },
    { event: "Bid Opening",            date: "Next business day",       done: false },
    { event: "Evaluation Period",      date: "4–6 weeks",               done: false },
    { event: "Award Notification",     date: "~8 weeks after closing",  done: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl sm:my-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-black/10 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLOR[tender.status] ?? "bg-gray-100 text-gray-600"}`}>{tender.status}</span>
              <span className="text-[11px] font-mono text-black/40">{tender.id}</span>
            </div>
            <h2 className="text-sm font-bold text-black leading-snug">{tender.title}</h2>
            <div className="text-xs text-black/50 mt-0.5">{tender.entity}</div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 h-8 w-8 rounded-lg hover:bg-black/5 grid place-items-center text-black/40 hover:text-black transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Key Facts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Hash,        label: "Reference",     value: tender.id },
              { icon: Tag,         label: "Category",      value: tender.category },
              { icon: Building2,   label: "Procuring Entity", value: tender.entity },
              { icon: ShieldCheck, label: "Method",        value: tender.method },
              { icon: Calendar,    label: "Closing Date",  value: tender.closing },
              { icon: Users,       label: "Bids Received", value: `${tender.bids} bids` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#F5F5F5] rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-black/40" />
                  <span className="text-[10px] text-black/40 uppercase tracking-wider font-medium">{label}</span>
                </div>
                <div className="text-sm font-semibold text-black leading-tight">{value}</div>
              </div>
            ))}
          </div>

          {/* Estimated Value highlight */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-0.5">Estimated Contract Value</div>
              <div className="text-2xl font-bold text-blue-700">{tender.value}</div>
            </div>
            <ShieldCheck className="h-8 w-8 text-blue-300" />
          </div>

          {/* Scope of Work */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-black/40" />
              <span className="text-sm font-semibold text-black">Scope of Work</span>
            </div>
            <div className="space-y-1.5">
              {SCOPE.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-black/70">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-black/40" />
              <span className="text-sm font-semibold text-black">Eligibility Requirements</span>
            </div>
            <div className="space-y-1.5">
              {ELIGIBILITY.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-black/70">
                  <div className="h-1.5 w-1.5 rounded-full bg-black/30 mt-1.5 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Procurement Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-black/40" />
              <span className="text-sm font-semibold text-black">Procurement Timeline</span>
            </div>
            <div className="relative pl-5">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-black/10" />
              {TIMELINE.map((ev, i) => (
                <div key={i} className="relative mb-3 last:mb-0">
                  <div className={`absolute -left-3 top-1 h-2.5 w-2.5 rounded-full border-2 ${ev.done ? "bg-emerald-500 border-emerald-500" : "bg-white border-black/20"}`} />
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${ev.done ? "text-emerald-600 font-medium" : "text-black/70"}`}>{ev.event}</span>
                    <span className="text-xs text-black/40 whitespace-nowrap">{ev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-black/10 p-4 bg-black/2">
            <div className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Contact & Enquiries</div>
            <div className="text-sm text-black/70">For clarifications, contact the Procurement Unit at <span className="font-medium text-black">{tender.entity}</span></div>
            <div className="text-xs text-black/40 mt-1">All clarifications must be submitted in writing via the APPIIOMS portal. Verbal clarifications will not be considered.</div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 px-5 pb-5 pt-3 border-t border-black/10 flex-shrink-0 flex-wrap">
          <button onClick={onApply}
            className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
            <Send className="h-3.5 w-3.5" /> Apply Now
          </button>
          <button onClick={() => {
            const content = `TENDER NOTICE\n\nReference: ${tender.id}\nTitle: ${tender.title}\nEntity: ${tender.entity}\nCategory: ${tender.category}\nValue: ${tender.value}\nMethod: ${tender.method}\nClosing Date: ${tender.closing}\nBids Received: ${tender.bids}\n\nGovernment of Zimbabwe · PRAZ\n© 2026 APPIIOMS`;
            const blob = new Blob([content], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `${tender.id}-notice.txt`; a.click();
            URL.revokeObjectURL(url);
          }}
            className="h-10 px-4 rounded-xl border border-black/10 text-sm text-black/70 hover:bg-black/5 transition-colors flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button onClick={onClose}
            className="h-10 px-4 rounded-xl border border-black/10 text-sm text-black/50 hover:bg-black/5 transition-colors ml-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Bid / Apply Modal ────────────────────────────────────────────────────── */
function BidModal({ tender, onClose, onSubmit }: {
  tender: typeof tenders[number];
  onClose: () => void;
  onSubmit: (app: Application) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bidAmount, setBidAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map(f => f.name);
    setFiles(prev => [...prev, ...names]);
  };

  const handleSubmit = () => {
    setDone(true);
    onSubmit({
      tenderId: tender.id,
      tenderTitle: tender.title,
      submittedAt: new Date().toLocaleString(),
      status: "Submitted",
      bidAmount: `${currency} ${Number(bidAmount || 0).toLocaleString()}`,
      files,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div>
            <div className="text-sm font-bold text-black">Apply for Tender</div>
            <div className="text-xs text-black/50 truncate max-w-xs">{tender.title}</div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-black/40" /></button>
        </div>

        {!done ? (
          <>
            {/* Steps indicator */}
            <div className="flex px-5 pt-4 gap-2 mb-4">
              {["Bid Details", "Documents", "Review"].map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-black text-white" : "bg-black/10 text-black/40"}`}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs ${step === i + 1 ? "text-black font-medium" : "text-black/40"} hidden sm:inline`}>{s}</span>
                  {i < 2 && <div className="flex-1 h-px bg-black/10 mx-1" />}
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 max-h-[50vh] overflow-y-auto">
              {step === 1 && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                    <strong>{tender.id}</strong> · {tender.entity} · Closes {tender.closing}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black/50 uppercase tracking-wider">Bid Amount</label>
                    <div className="flex gap-2 mt-1.5">
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="h-10 px-3 rounded-xl border border-black/10 text-sm bg-white">
                        <option>USD</option><option>ZWL</option><option>EUR</option>
                      </select>
                      <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="0.00"
                        className="flex-1 h-10 px-4 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black/50 uppercase tracking-wider">Cover Letter / Bid Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                      placeholder="Briefly describe your bid approach, qualifications, and why you are best suited…"
                      className="mt-1.5 w-full px-4 py-3 rounded-xl border border-black/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-black mb-2">Required Documents</div>
                  {["Company Registration Certificate", "Tax Clearance Certificate", "Financial Statements (3 years)", "Technical Proposal", "Bid Security / Bank Guarantee"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-black/2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-black/40" />
                        <span className="text-sm text-black">{doc}</span>
                      </div>
                      {files.some(f => f.toLowerCase().includes(doc.toLowerCase().split(" ")[0])) ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="text-xs text-black/30">Required</span>
                      )}
                    </div>
                  ))}
                  <div>
                    <input type="file" ref={fileRef} multiple className="hidden" onChange={addFile} />
                    <button onClick={() => fileRef.current?.click()}
                      className="w-full h-12 rounded-xl border-2 border-dashed border-black/20 text-sm text-black/50 hover:border-black/40 hover:text-black transition-colors flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4" /> Click to attach documents (PDF, DOCX, XLSX)
                    </button>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-1.5">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                          <Paperclip className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs text-emerald-700 truncate flex-1">{f}</span>
                          <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                            <X className="h-3.5 w-3.5 text-emerald-400 hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">Ready to Submit</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-black/50">Tender</span><span className="font-medium text-black text-right max-w-[200px] truncate">{tender.title}</span></div>
                      <div className="flex justify-between"><span className="text-black/50">Reference</span><span className="font-mono text-black">{tender.id}</span></div>
                      <div className="flex justify-between"><span className="text-black/50">Bid Amount</span><span className="font-semibold text-black">{currency} {Number(bidAmount || 0).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-black/50">Documents</span><span className="text-black">{files.length} attached</span></div>
                      <div className="flex justify-between"><span className="text-black/50">Closing</span><span className="text-black">{tender.closing}</span></div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-700">By submitting you confirm all information is accurate and you agree to PPDPA procurement terms. Bid submissions are final.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 pb-5 pt-3 border-t border-black/10">
              <button onClick={() => setStep(s => Math.max(1, s - 1) as 1 | 2 | 3)} disabled={step === 1}
                className="h-9 px-4 rounded-xl border border-black/10 text-sm hover:bg-black/5 disabled:opacity-40">← Back</button>
              {step < 3
                ? <button onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)} className="h-9 px-5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800">Continue →</button>
                : <button onClick={handleSubmit} className="h-9 px-5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5"><Send className="h-4 w-4" /> Submit Application</button>
              }
            </div>
          </>
        ) : (
          <div className="px-5 py-10 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-black mb-2">Application Submitted!</div>
            <div className="text-sm text-black/50 mb-1">Your bid has been received by the procuring entity.</div>
            <div className="text-xs text-black/40 mb-6">Reference: {tender.id} · {new Date().toLocaleString()}</div>
            <button onClick={onClose} className="h-9 px-6 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Supplier Portal ─────────────────────────────────────────────────── */
export default function SupplierPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"tenders" | "myapps">("tenders");
  const [bidTender, setBidTender] = useState<typeof tenders[number] | null>(null);
  const [detailTender, setDetailTender] = useState<typeof tenders[number] | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showUser, setShowUser] = useState(false);

  const published = tenders.filter(t => ["Published", "Bidding"].includes(t.status));
  const filtered = published.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.entity.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate("/signin"); };

  const downloadPDF = (tender: typeof tenders[number]) => {
    // Demo: create a simple text blob as "PDF"
    const content = `TENDER NOTICE\n\nReference: ${tender.id}\nTitle: ${tender.title}\nEntity: ${tender.entity}\nCategory: ${tender.category}\nValue: ${tender.value}\nMethod: ${tender.method}\nClosing Date: ${tender.closing}\nBids Received: ${tender.bids}\n\nGovernment of Zimbabwe · PRAZ\n© 2026 APPIIOMS`;
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${tender.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-black/10 flex items-center px-4 gap-3 sticky top-0 z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoIcon className="h-6 w-6 text-black" />
          <span className="text-sm font-semibold text-black hidden sm:block">APPIIOMS</span>
        </Link>
        <div className="h-5 w-px bg-black/10 hidden sm:block" />
        <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full hidden sm:inline">Supplier Portal</span>
        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenders…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
        </div>

        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F5F5F5] text-black/40 hover:text-black">
          <Bell className="h-4 w-4" />
        </button>

        <div className="relative">
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <div className="h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-bold grid place-items-center">{user?.avatar ?? "?"}</div>
            <span className="text-xs font-medium text-black hidden sm:block max-w-[100px] truncate">{user?.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-black/30 hidden sm:block" />
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-2xl bg-white border border-black/10 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-black/10">
                <div className="text-xs font-semibold text-black">{user?.name}</div>
                <div className="text-[11px] text-black/40">{user?.entity}</div>
                <div className="text-[11px] text-black/40">{user?.email}</div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-xs text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenders…"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
        </div>
      </div>

      {/* Welcome banner */}
      <div className="bg-blue-600 text-white px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Welcome, {user?.name} 👋</div>
            <div className="text-xs text-blue-200 mt-0.5">{user?.entity} · Supplier Portal · Browse & apply for government tenders</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold">{published.length}</div>
            <div className="text-xs text-blue-200">Open tenders</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-black/10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {([["tenders", "Open Tenders"], ["myapps", `My Applications (${applications.length})`]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === k ? "border-blue-600 text-blue-600" : "border-transparent text-black/50 hover:text-black"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {activeTab === "tenders" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-black/50">{filtered.length} open tender{filtered.length !== 1 ? "s" : ""} available for bidding</div>
                <div className="text-xs text-black/30">Updated live</div>
              </div>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-black/40 text-sm">No tenders match your search.</div>
              )}

              {filtered.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-black/10 shadow-sm hover:shadow-md hover:border-black/20 transition-all p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLOR[t.status] ?? "bg-gray-100 text-gray-600"}`}>{t.status}</span>
                        <span className="text-[11px] text-black/40 font-mono">{t.id}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-black leading-snug">{t.title}</h3>
                      <div className="text-xs text-black/50 mt-1">{t.entity} · {t.category}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold text-black">{t.value}</div>
                      <div className="text-[11px] text-black/40">{t.method}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-black/50 mb-4 flex-wrap">
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Closes {t.closing}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {t.bids} bids received</div>
                    <div className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {t.entity}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setBidTender(t)}
                      className="h-9 px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5" /> Apply Now
                    </button>
                    <button onClick={() => downloadPDF(t)}
                      className="h-9 px-4 rounded-xl border border-black/10 text-sm text-black/70 hover:bg-black/5 transition-colors flex items-center gap-1.5">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                    <button onClick={() => setDetailTender(t)}
                      className="h-9 px-4 rounded-xl border border-black/10 text-sm text-black/70 hover:bg-black/5 transition-colors flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "myapps" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
                  <div className="text-sm font-medium text-black/50 mb-1">No applications yet</div>
                  <div className="text-xs text-black/30 mb-4">Apply for a tender to see it here</div>
                  <button onClick={() => setActiveTab("tenders")}
                    className="h-9 px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5 mx-auto">
                    <ArrowRight className="h-4 w-4" /> Browse Tenders
                  </button>
                </div>
              ) : (
                applications.map((app, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-black/10 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-sm font-semibold text-black">{app.tenderTitle}</div>
                        <div className="text-xs font-mono text-black/40 mt-0.5">{app.tenderId}</div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        app.status === "Shortlisted" ? "bg-emerald-100 text-emerald-700" :
                        app.status === "Under Review" ? "bg-amber-100 text-amber-700" :
                        app.status === "Unsuccessful" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{app.status}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div><span className="text-black/40">Bid Amount</span><div className="font-semibold text-black mt-0.5">{app.bidAmount}</div></div>
                      <div><span className="text-black/40">Submitted</span><div className="text-black mt-0.5">{app.submittedAt}</div></div>
                      <div><span className="text-black/40">Documents</span><div className="text-black mt-0.5">{app.files.length} attached</div></div>
                    </div>
                    {app.files.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.files.map((f, j) => (
                          <span key={j} className="text-[11px] px-2 py-0.5 bg-black/5 rounded-full text-black/60 flex items-center gap-1">
                            <Paperclip className="h-2.5 w-2.5" /> {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Tender Detail Modal */}
      {detailTender && (
        <TenderDetailModal
          tender={detailTender}
          onClose={() => setDetailTender(null)}
          onApply={() => { setBidTender(detailTender); setDetailTender(null); }}
        />
      )}

      {/* Apply Modal */}
      {bidTender && (
        <BidModal
          tender={bidTender}
          onClose={() => setBidTender(null)}
          onSubmit={(app) => {
            setApplications(prev => [app, ...prev]);
            setBidTender(null);
            setActiveTab("myapps");
          }}
        />
      )}
    </div>
  );
}
