import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Search, Download, Eye, Filter, X,
  FileText, Calendar, DollarSign, Building2, ChevronRight,
  BarChart3, Shield, Sparkles, Globe, TrendingUp, CheckCircle2,
  Clock, AlertTriangle, ExternalLink,
} from "lucide-react";

/* ── Logo ──────────────────────────────────────────────────────────────── */
function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

/* ── Tenders data ──────────────────────────────────────────────────────── */
const PUBLIC_TENDERS = [
  { id: "ZW-PRA-2026-00184", title: "Supply & Installation of Solar Mini-Grids — 12 Rural Clinics", entity: "Ministry of Energy", category: "Infrastructure", value: "USD 14,800,000", method: "Open Tender", status: "Bidding", closing: "2026-07-08", bids: 11 },
  { id: "ZW-PRA-2026-00183", title: "Procurement of Antiretroviral Medicines (2-Year Framework)", entity: "Ministry of Health & Child Care", category: "Health & Pharma", value: "USD 42,500,000", method: "Framework", status: "Evaluation", closing: "2026-06-12", bids: 8 },
  { id: "ZW-PRA-2026-00182", title: "National Tax Administration System — Phase II", entity: "ZIMRA", category: "ICT & Digital", value: "USD 9,200,000", method: "Restricted", status: "Bidding", closing: "2026-07-21", bids: 5 },
  { id: "ZW-PRA-2026-00181", title: "Rehabilitation of Beitbridge–Harare Highway (Section 4)", entity: "Ministry of Transport", category: "Infrastructure", value: "USD 88,000,000", method: "Open Tender", status: "Published", closing: "2026-08-04", bids: 0 },
  { id: "ZW-PRA-2026-00180", title: "Supply of Fertiliser — Pfumvudza Programme 2026/27", entity: "Ministry of Agriculture", category: "Agriculture", value: "USD 31,400,000", method: "Open Tender", status: "Awarded", closing: "2026-05-30", bids: 14 },
  { id: "ZW-PRA-2026-00179", title: "Provision of External Audit Services (3 Years)", entity: "Office of the Auditor-General", category: "Services", value: "USD 1,850,000", method: "Open Tender", status: "Evaluation", closing: "2026-06-18", bids: 9 },
  { id: "ZW-PRA-2026-00178", title: "School Textbooks — Primary Grades 1–7", entity: "Ministry of Education", category: "Education", value: "USD 6,700,000", method: "Open Tender", status: "Bidding", closing: "2026-07-02", bids: 12 },
  { id: "ZW-PRA-2026-00177", title: "Construction of 4 District Hospitals", entity: "Ministry of Health & Child Care", category: "Infrastructure", value: "USD 56,000,000", method: "Open Tender", status: "Published", closing: "2026-09-15", bids: 0 },
  { id: "ZW-PRA-2026-00176", title: "Fleet Management Services — Government Vehicles", entity: "Ministry of Transport", category: "Services", value: "USD 4,200,000", method: "Open Tender", status: "Bidding", closing: "2026-07-15", bids: 7 },
  { id: "ZW-PRA-2026-00175", title: "CCTV & Security Systems — 18 Government Buildings", entity: "Ministry of Home Affairs", category: "ICT & Digital", value: "USD 3,800,000", method: "Restricted", status: "Evaluation", closing: "2026-06-30", bids: 4 },
  { id: "ZW-PRA-2026-00174", title: "Medical Equipment — 12 Provincial Hospitals", entity: "Ministry of Health & Child Care", category: "Health & Pharma", value: "USD 22,000,000", method: "Open Tender", status: "Published", closing: "2026-08-20", bids: 0 },
  { id: "ZW-PRA-2026-00173", title: "Rural Roads Rehabilitation — Mashonaland Central", entity: "Ministry of Transport", category: "Infrastructure", value: "USD 18,400,000", method: "Open Tender", status: "Awarded", closing: "2026-05-01", bids: 9 },
];

const STATUS_STYLE: Record<string, string> = {
  "Bidding":    "bg-blue-100 text-blue-700",
  "Evaluation": "bg-amber-100 text-amber-700",
  "Awarded":    "bg-emerald-100 text-emerald-700",
  "Published":  "bg-violet-100 text-violet-700",
  "Cancelled":  "bg-red-100 text-red-700",
};

const CATEGORIES = ["All", "Infrastructure", "Health & Pharma", "ICT & Digital", "Agriculture", "Education", "Services"];
const METHODS    = ["All Methods", "Open Tender", "Framework", "Restricted", "RFQ", "Direct"];
const STATUSES   = ["All Status", "Published", "Bidding", "Evaluation", "Awarded"];

/* ── Tender detail modal ───────────────────────────────────────────────── */
function TenderModal({ tender, onClose }: {
  tender: typeof PUBLIC_TENDERS[number];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[11px] text-black/50 bg-black/5 px-2 py-0.5 rounded">{tender.id}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${STATUS_STYLE[tender.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {tender.status}
                </span>
                <span className="text-[11px] text-black/40 bg-black/5 px-2 py-0.5 rounded">{tender.method}</span>
              </div>
              <h2 className="text-lg font-semibold text-black leading-tight">{tender.title}</h2>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-black/5 grid place-items-center flex-shrink-0 text-black/40 hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Contracting Entity", value: tender.entity, icon: Building2 },
              { label: "Category", value: tender.category, icon: FileText },
              { label: "Estimated Value", value: tender.value, icon: DollarSign },
              { label: "Procurement Method", value: tender.method, icon: Shield },
              { label: "Closing Date", value: tender.closing, icon: Calendar },
              { label: "Bids Received", value: tender.bids > 0 ? String(tender.bids) : "Not yet open", icon: BarChart3 },
            ].map(d => (
              <div key={d.label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-black/5">
                <d.icon className="h-4 w-4 text-black/30 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-black/40 uppercase tracking-wide mb-0.5">{d.label}</div>
                  <div className="text-sm font-semibold text-black">{d.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
            <div className="text-xs font-semibold text-black/50 uppercase tracking-wide mb-2">Tender Description</div>
            <p className="text-sm text-black/70 leading-relaxed">
              This tender invites qualified suppliers to submit bids for {tender.title.toLowerCase()}. All submissions must comply with the Public Procurement and Disposal of Public Assets Act (PPDPA) 2018. Bidders must be registered with PRAZ and possess a valid tax clearance certificate.
            </p>
          </div>

          {/* Eligibility */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Eligibility Requirements</div>
            <ul className="space-y-1.5">
              {[
                "Valid PRAZ registration certificate",
                "Valid ZIMRA tax clearance certificate (not older than 6 months)",
                "Minimum 3 years experience in the relevant field",
                "Audited financial statements for the last 3 years",
                "Conflict of interest declaration form duly completed",
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                const content = `TENDER NOTICE\n\nTender Number: ${tender.id}\nTitle: ${tender.title}\nEntity: ${tender.entity}\nValue: ${tender.value}\nMethod: ${tender.method}\nStatus: ${tender.status}\nClosing: ${tender.closing}\n\nFor more information visit: https://praz.gov.zw`;
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${tender.id}-tender-notice.txt`;
                a.click(); URL.revokeObjectURL(url);
              }}
              className="flex-1 h-11 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Download className="h-4 w-4" /> Download Tender Notice
            </button>
            <Link
              to="/signin"
              className="flex-1 h-11 rounded-full border border-black/15 text-black text-sm font-medium flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Submit Bid (Login)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tenders Section ───────────────────────────────────────────────────── */
function TendersSection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [method, setMethod] = useState("All Methods");
  const [status, setStatus] = useState("All Status");
  const [selectedTender, setSelectedTender] = useState<typeof PUBLIC_TENDERS[number] | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = PUBLIC_TENDERS.filter(t => {
    const q = search.toLowerCase();
    const matchQ = !search || t.title.toLowerCase().includes(q) || t.entity.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchCat = category === "All" || t.category === category;
    const matchM = method === "All Methods" || t.method === method;
    const matchS = status === "All Status" || t.status === status;
    return matchQ && matchCat && matchM && matchS;
  });

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const downloadAll = () => {
    const rows = ["Tender No,Title,Entity,Category,Value,Method,Status,Closing,Bids",
      ...filtered.map(t => `${t.id},"${t.title}","${t.entity}",${t.category},${t.value},${t.method},${t.status},${t.closing},${t.bids}`)
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "praz-tenders-2026.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="tenders" className="bg-[#F5F5F5] px-6 py-16 border-t border-black/10">
      <div className="max-w-[88rem] mx-auto">

        {/* Section heading */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-black/50 text-sm mb-1">Public Transparency</p>
            <h2 className="text-4xl md:text-5xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>
              Active Tenders
            </h2>
            <p className="text-black/50 text-base mt-2 max-w-lg">
              All government tenders are publicly disclosed. Browse, analyse, and download tender data in the interest of transparency and accountability.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={downloadAll}
              className="flex items-center gap-2 h-10 px-5 rounded-full border border-black/15 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors">
              <Download className="h-4 w-4" /> Download CSV
            </button>
            <Link to="/signin"
              className="flex items-center gap-2 h-10 px-5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              Submit a Bid <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search tenders, entities, reference numbers…"
              className="w-full h-11 pl-11 pr-4 rounded-full border border-black/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-all"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: category, setValue: (v: string) => { setCategory(v); setPage(1); }, options: CATEGORIES },
              { value: method,   setValue: (v: string) => { setMethod(v);   setPage(1); }, options: METHODS },
              { value: status,   setValue: (v: string) => { setStatus(v);   setPage(1); }, options: STATUSES },
            ].map((f, i) => (
              <select key={i} value={f.value} onChange={e => f.setValue(e.target.value)}
                className="h-11 px-4 pr-8 rounded-full border border-black/15 bg-white text-sm focus:outline-none cursor-pointer appearance-none hover:border-black/30 transition-colors">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-black/40 mb-4">
          Showing {paginated.length} of {filtered.length} tenders
          {(category !== "All" || method !== "All Methods" || status !== "All Status" || search) && (
            <button onClick={() => { setCategory("All"); setMethod("All Methods"); setStatus("All Status"); setSearch(""); setPage(1); }}
              className="ml-3 text-black/60 hover:text-black underline text-xs">Clear filters</button>
          )}
        </p>

        {/* Tender cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {paginated.map(tender => (
            <div
              key={tender.id}
              onClick={() => setSelectedTender(tender)}
              className="bg-white rounded-2xl border border-black/8 p-6 hover:border-black/20 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Status + method badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[tender.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {tender.status}
                </span>
                <span className="text-[11px] text-black/40 bg-black/5 px-2 py-0.5 rounded-full">{tender.method}</span>
                <span className="ml-auto text-[10px] font-mono text-black/30">{tender.id.slice(-5)}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-black leading-snug mb-2 group-hover:text-black transition-colors line-clamp-2">
                {tender.title}
              </h3>

              {/* Entity */}
              <div className="flex items-center gap-1.5 text-xs text-black/50 mb-4">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{tender.entity}</span>
              </div>

              {/* Value + closing */}
              <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <div>
                  <div className="text-[10px] text-black/35 uppercase tracking-wide">Value</div>
                  <div className="text-sm font-bold text-black">{tender.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-black/35 uppercase tracking-wide">Closing</div>
                  <div className="text-xs text-black/70">{tender.closing}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5">
                <span className="text-[11px] text-black/40">{tender.bids} bid{tender.bids !== 1 ? "s" : ""} received</span>
                <span className="text-[11px] font-medium text-black/60 group-hover:text-black flex items-center gap-1 transition-colors">
                  View details <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="text-black/20 text-5xl mb-3">⚡</div>
              <p className="text-sm text-black/40">No tenders match your search. Try different filters.</p>
            </div>
          )}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center">
            <button onClick={() => setPage(p => p + 1)}
              className="inline-flex items-center gap-2 h-11 px-8 rounded-full border border-black/15 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors">
              Load more tenders <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tender detail modal */}
      {selectedTender && (
        <TenderModal tender={selectedTender} onClose={() => setSelectedTender(null)} />
      )}
    </section>
  );
}
