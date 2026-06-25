import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { FeatureGrid } from "@/components/ModulePage";
import { vendors as MOCK_VENDORS } from "@/lib/mock-data";
import { pushSeniorAlert, pushNotification } from "@/lib/local-store";
import { useAuth } from "@/lib/auth-context";
import {
  Plus, ShieldCheck, Search, Filter, Star, X, CheckCircle2,
  AlertTriangle, Download, Eye, Ban, User, Mail, Phone,
  Building2, FileText, MapPin,
} from "lucide-react";

type Vendor = typeof MOCK_VENDORS[number] & { email?: string; phone?: string; address?: string };

const INITIAL_VENDORS: Vendor[] = MOCK_VENDORS.map(v => ({
  ...v,
  email: `procurement@${v.name.toLowerCase().replace(/[^a-z]/g, "").slice(0,10)}.co.zw`,
  phone: `+263 7${Math.floor(Math.random() * 9 + 1)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
  address: ["Harare CBD", "Bulawayo City", "Gweru Industrial", "Mutare East", "Victoria Falls Rd"][Math.floor(Math.random() * 5)],
}));

/* ── Register Vendor Modal ───────────────────────────────────────────────── */
function RegisterModal({ onClose, onSave }: { onClose: () => void; onSave: (v: Vendor) => void }) {
  const [form, setForm] = useState({ name: "", category: "", email: "", phone: "", address: "", regNo: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const { user } = useAuth();

  const handleSave = () => {
    if (!form.name || !form.email) return;
    const newVendor: Vendor = {
      id: `VEN-${String(Math.floor(Math.random() * 900 + 100)).padStart(5, "0")}`,
      name: form.name, category: form.category || "General", email: form.email,
      phone: form.phone, address: form.address,
      status: "Under Review", rating: 0, risk: "Medium",
      contracts: 0,
      registeredBy: user?.name ?? "System",
    } as Vendor;
    pushSeniorAlert(
      `New vendor registered: ${form.name} — awaiting KYC approval`,
      "info",
      { from: user?.name, fromRole: user?.role ?? "officer", category: "action", ref: newVendor.id }
    );
    onSave(newVendor);
    onClose();
  };

  const CATEGORIES = ["Infrastructure / Works", "Health & Pharmaceuticals", "ICT & Digital", "Agriculture", "Education", "Services / Consultancy", "Transport & Fleet", "Office Supplies", "Security Services", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div className="text-sm font-bold text-black">Register New Vendor</div>
          <button onClick={onClose}><X className="h-5 w-5 text-black/30" /></button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {[
            { k: "name",     label: "Company Name *",         ph: "e.g. Highveld Engineering (Pvt) Ltd", icon: Building2 },
            { k: "email",    label: "Company Email *",         ph: "procurement@company.co.zw",          icon: Mail },
            { k: "phone",    label: "Contact Number",          ph: "+263 77 000 0000",                   icon: Phone },
            { k: "address",  label: "Physical Address",        ph: "123 Main Street, Harare",            icon: MapPin },
            { k: "regNo",    label: "Company Reg. No.",        ph: "1234/2024",                          icon: FileText },
          ].map(({ k, label, ph, icon: Icon }) => (
            <div key={k}>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">{label}</label>
              <div className="relative mt-1.5">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input value={(form as Record<string, string>)[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Business Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              className="mt-1.5 w-full h-9 px-3 rounded-xl border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10">
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            After registration, the vendor will receive a KYC verification email. AI will automatically run tax clearance, ZIMRA, and sanctions screening.
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-black/10">
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Register Vendor
          </button>
          <button onClick={onClose} className="h-10 px-4 rounded-xl border border-black/10 text-sm hover:bg-[#F5F5F5] transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Vendor Detail Modal ─────────────────────────────────────────────────── */
function VendorModal({ vendor, onClose, onApprove, onBlacklist }: {
  vendor: Vendor; onClose: () => void;
  onApprove: () => void; onBlacklist: () => void;
}) {
  const downloadProfile = () => {
    const content = `VENDOR PROFILE\n\nID: ${vendor.id}\nName: ${vendor.name}\nCategory: ${vendor.category}\nEmail: ${vendor.email || "N/A"}\nPhone: ${vendor.phone || "N/A"}\nAddress: ${vendor.address || "N/A"}\nRating: ${vendor.rating}/5\nContracts: ${vendor.contracts}\nRisk: ${vendor.risk}\nStatus: ${vendor.status}\n\nGenerated by AI Powered Electronic Public Procurement and Oversight Intelligence System · ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${vendor.id}-profile.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:my-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div>
            <div className="text-sm font-bold text-black">{vendor.name}</div>
            <div className="text-xs text-black/50">{vendor.id} · {vendor.category}</div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-black/30" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge tone={vendor.status === "Blacklisted" ? "red" : vendor.status === "Under Review" ? "amber" : "green"}>{vendor.status}</Badge>
            <Badge tone={vendor.risk === "High" ? "red" : vendor.risk === "Medium" ? "amber" : "green"}>Risk: {vendor.risk}</Badge>
            {vendor.rating > 0 && <Badge tone="blue">★ {vendor.rating}/5</Badge>}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Vendor ID",     value: vendor.id },
              { label: "Category",      value: vendor.category },
              { label: "Email",         value: vendor.email || "N/A" },
              { label: "Phone",         value: vendor.phone || "N/A" },
              { label: "Address",       value: vendor.address || "N/A" },
              { label: "Contracts",     value: `${vendor.contracts} awarded` },
            ].map(f => (
              <div key={f.label} className="bg-[#F5F5F5] rounded-xl p-3">
                <div className="text-[10px] text-black/40 uppercase tracking-wider mb-0.5">{f.label}</div>
                <div className="text-xs font-medium text-black break-all">{f.value}</div>
              </div>
            ))}
          </div>

          {/* AI Risk Assessment */}
          <div className={`rounded-xl p-4 border ${vendor.risk === "High" ? "bg-red-50 border-red-200" : vendor.risk === "Medium" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
            <div className="text-xs font-semibold text-black mb-2">AI Risk Assessment</div>
            <div className="space-y-1.5 text-xs">
              {[
                { check: "ZIMRA Tax Clearance",  ok: vendor.risk !== "High" },
                { check: "Sanctions Screening",  ok: vendor.status !== "Blacklisted" },
                { check: "Director PEP Check",   ok: vendor.risk === "Low" },
                { check: "Financial Health",      ok: vendor.rating >= 4 },
                { check: "Delivery Track Record", ok: vendor.contracts > 5 },
              ].map(c => (
                <div key={c.check} className="flex items-center gap-2">
                  {c.ok
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    : <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                  }
                  <span className={c.ok ? "text-black/70" : "text-amber-700 font-medium"}>{c.check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-black/10 flex-wrap">
          {vendor.status === "Under Review" && (
            <button onClick={onApprove}
              className="flex-1 h-9 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Approve KYC
            </button>
          )}
          {vendor.status !== "Blacklisted" && (
            <button onClick={onBlacklist}
              className="flex-1 h-9 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5">
              <Ban className="h-4 w-4" /> Blacklist
            </button>
          )}
          <button onClick={downloadProfile}
            className="h-9 px-4 rounded-xl border border-black/10 text-sm hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Download Profile
          </button>
          <button onClick={onClose} className="h-9 px-4 rounded-xl border border-black/10 text-sm text-black/50 hover:bg-[#F5F5F5] transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main VendorsPage ────────────────────────────────────────────────────── */
export default function VendorsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "All" || v.risk === filterRisk;
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    return matchSearch && matchRisk && matchStatus;
  });

  const updateVendor = (id: string, patch: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));
    setSelectedVendor(null);
  };

  const handleApprove = (v: Vendor) => {
    updateVendor(v.id, { status: "Approved" });
    pushSeniorAlert(`Vendor KYC approved: ${v.name}`, "success", { from: user?.name, fromRole: user?.role ?? "officer", category: "approval", ref: v.id });
    pushNotification(`Vendor ${v.name} KYC approved`, "success");
  };

  const handleBlacklist = (v: Vendor) => {
    updateVendor(v.id, { status: "Blacklisted", risk: "High" });
    pushSeniorAlert(`Vendor blacklisted: ${v.name} — CPO review required`, "error", { from: user?.name, fromRole: user?.role ?? "officer", category: "fraud", ref: v.id });
    pushNotification(`Vendor ${v.name} blacklisted`, "error");
  };

  const downloadAll = () => {
    const rows = ["Vendor ID,Name,Category,Rating,Contracts,Risk,Status,Email", ...filtered.map(v => `${v.id},${v.name},${v.category},${v.rating},${v.contracts},${v.risk},${v.status},${v.email || ""}`).join("\n")];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vendor-registry.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Phase 6</Badge>
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader
          title="Supplier Lifecycle Management"
          description="National vendor registry: registration, KYC, tax & bank validation, AI risk scoring, and blacklist management."
          actions={
            <div className="flex gap-2">
              <button onClick={downloadAll}
                className="h-9 px-3 rounded-xl border border-black/10 bg-white text-sm font-medium hover:bg-[#F5F5F5] flex items-center gap-1.5 transition-colors">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button onClick={() => setShowRegister(true)}
                className="h-9 px-4 rounded-xl bg-black text-white text-sm font-medium flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                <Plus className="h-4 w-4" /> Register Vendor
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Registered Vendors" value={String(vendors.length + 12840)} delta="+284 this month" />
          <KpiCard label="KYC Approved" value={String(vendors.filter(v => v.status === "Approved").length + 11197)} delta="87.2% rate" />
          <KpiCard label="Pending Review" value={String(vendors.filter(v => v.status === "Under Review").length + 1415)} delta="Processing" />
          <KpiCard label="Blacklisted" value={String(vendors.filter(v => v.status === "Blacklisted").length + 224)} delta="+8 this month" positive={false} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, category, ID…"
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
              className="h-9 px-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none">
              <option value="All">All Risk</option>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none">
              <option value="All">All Status</option>
              <option>Approved</option><option>Under Review</option><option>Blacklisted</option>
            </select>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader
            title={`Vendor Registry — ${filtered.length} vendors`}
            action={<Badge tone="blue"><ShieldCheck className="h-3 w-3 mr-1 inline" />AI Risk Scored</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F5F5] text-xs text-black/40">
                <tr>{["Vendor ID","Name","Category","Rating","Contracts","Risk","Status","Actions"].map(h => (
                  <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-[#F5F5F5]/50">
                    <td className="px-5 py-3 font-mono text-[11px] text-black/40">{v.id}</td>
                    <td className="px-5 py-3 font-medium text-black max-w-[180px] truncate">{v.name}</td>
                    <td className="px-5 py-3 text-black/60 whitespace-nowrap">{v.category}</td>
                    <td className="px-5 py-3">
                      {v.rating > 0
                        ? <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /><span className="font-medium">{v.rating}</span></div>
                        : <span className="text-black/30 text-xs">New</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-black/70">{v.contracts}</td>
                    <td className="px-5 py-3"><Badge tone={v.risk === "High" ? "red" : v.risk === "Medium" ? "amber" : "green"}>{v.risk}</Badge></td>
                    <td className="px-5 py-3"><Badge tone={v.status === "Blacklisted" ? "red" : v.status === "Under Review" ? "amber" : "green"}>{v.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelectedVendor(v)}
                          className="h-7 px-2.5 rounded-lg bg-black text-white text-xs hover:bg-gray-800 transition-colors flex items-center gap-1">
                          <Eye className="h-3 w-3" /> View
                        </button>
                        {v.status === "Under Review" && (
                          <button onClick={() => handleApprove(v)}
                            className="h-7 px-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition-colors">
                            ✓ KYC
                          </button>
                        )}
                        {v.status !== "Blacklisted" && (
                          <button onClick={() => handleBlacklist(v)}
                            className="h-7 px-2 rounded-lg border border-red-200 text-red-600 text-xs hover:bg-red-50 transition-colors">
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-8 text-center text-black/30 text-sm">No vendors match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <h2 className="text-sm font-semibold mb-3">Vendor Lifecycle Capabilities</h2>
        <FeatureGrid features={[
          { title: "Registration & KYC",       desc: "Company details, directors, beneficial ownership, ID verification, document upload, e-signature." },
          { title: "Tax & Bank Validation",     desc: "Real-time ZIMRA tax clearance check, bank account verification, NSSA compliance." },
          { title: "Financial Assessment",      desc: "3-year financial statements, turnover, liquidity ratios, credit history analysis." },
          { title: "Technical Qualification",   desc: "Certifications, ISO standards, technical capacity, manufacturer authorizations." },
          { title: "Past Performance",          desc: "Contract history, delivery scores, defect rates, dispute history across all government entities." },
          { title: "AI Supplier Risk Agent",    desc: "Continuous monitoring of news, sanctions lists, ownership changes, and behavioural anomalies." },
        ]} />
      </div>

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSave={v => setVendors(prev => [v, ...prev])}
        />
      )}

      {selectedVendor && (
        <VendorModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onApprove={() => handleApprove(selectedVendor)}
          onBlacklist={() => handleBlacklist(selectedVendor)}
        />
      )}
    </AppShell>
  );
}
